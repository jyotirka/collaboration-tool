import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../App.css';

const CreateDocument = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [users, setUsers] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const navigate = useNavigate();

  const searchUsers = async (query) => {
    if (!query) {
      setUsers([]);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/documents/users/search?q=${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('User search failed:', err);
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
    console.log('CreateDocument - Content changed:', value);
    
    const textContent = value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
    const lastAtIndex = textContent.lastIndexOf('@');
    console.log('CreateDocument - Last @ index:', lastAtIndex);
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textContent.substring(lastAtIndex + 1);
      const spaceIndex = textAfterAt.search(/[\s<>&]/);
      const query = spaceIndex === -1 ? textAfterAt : textAfterAt.substring(0, spaceIndex);
      
      console.log('CreateDocument - Query:', query);
      
      console.log('CreateDocument - Space index:', spaceIndex);
      console.log('CreateDocument - Query length:', query.length);
      
      if (query.length > 0 && query.length <= 20) {
        console.log('CreateDocument - Showing mentions for:', query);
        setMentionQuery(query);
        setShowMentions(true);
        searchUsers(query);
      } else {
        console.log('CreateDocument - Hiding mentions, conditions not met');
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (username) => {
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
    const lastAtIndex = textContent.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const htmlLastAtIndex = content.lastIndexOf('@');
      const beforeAt = content.substring(0, htmlLastAtIndex);
      const afterAt = content.substring(htmlLastAtIndex + mentionQuery.length + 1);
      const newContent = beforeAt + `@${username} ` + afterAt;
      setContent(newContent);
    }
    
    setShowMentions(false);
    setUsers([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    console.log('CreateDocument - Creating with content:', content);
    
    try {
      const response = await axios.post("http://localhost:5000/api/documents", {
        title,
        content,
        isPublic
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log('CreateDocument - Document created:', response.data);
      navigate("/documents");
    } catch (err) {
      console.error("Failed to create document:", err);
      alert('Failed to create document');
    }
    setCreating(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Knowledge Base</div>
          <div className="nav-links">
            <button onClick={() => navigate('/documents')} className="btn btn-secondary btn-small">
              ← Back to Documents
            </button>
            <button onClick={handleLogout} className="btn btn-secondary btn-small">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container">
        <div className="editor-container">
          <h2 style={{ marginBottom: '30px', color: '#333' }}>Create New Document</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Enter document title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="editor-title"
                required
              />
            </div>
            
            <div className="form-group" style={{ position: 'relative' }}>
              <ReactQuill
                value={content}
                onChange={handleContentChange}
                theme="snow"
                placeholder="Start writing your document... Use @username to mention someone"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
              />
              
              {showMentions && users.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '20px',
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  minWidth: '200px'
                }}>
                  {users.map(user => (
                    <div
                      key={user._id}
                      onClick={() => insertMention(user.username)}
                      style={{
                        padding: '10px 15px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: '#667eea',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500' }}>@{user.username}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="checkbox-container">
              <input 
                type="checkbox" 
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label htmlFor="isPublic" style={{ color: '#666', fontWeight: '500' }}>
                Make this document public
              </label>
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button 
                type="button"
                onClick={() => navigate('/documents')} 
                className="btn btn-secondary"
                style={{ marginRight: '10px' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={creating || !title.trim()}
              >
                {creating ? 'Creating...' : 'Create Document'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDocument;
