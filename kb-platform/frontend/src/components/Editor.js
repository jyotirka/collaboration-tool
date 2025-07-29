import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../App.css';

const Editor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [user, setUser] = useState(null);
  const { id: docId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (docId) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/documents/${docId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setIsPublic(res.data.isPublic);
        setLoading(false);
      }).catch(err => {
        console.error('Error loading document:', err);
        setLoading(false);
      });
    }
  }, [docId]);

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
    
    // Convert HTML to plain text for mention detection
    const textContent = value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
    
    // Check for @ mentions
    const lastAtIndex = textContent.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textContent.substring(lastAtIndex + 1);
      const spaceIndex = textAfterAt.search(/[\s<>&]/);
      const query = spaceIndex === -1 ? textAfterAt : textAfterAt.substring(0, spaceIndex);
      
      if (query.length > 0 && query.length <= 20) {
        setMentionQuery(query);
        setShowMentions(true);
        searchUsers(query);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (username) => {
    // Find the last @ in the plain text version
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
    const lastAtIndex = textContent.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      // Find corresponding position in HTML content
      const htmlLastAtIndex = content.lastIndexOf('@');
      const beforeAt = content.substring(0, htmlLastAtIndex);
      const afterAt = content.substring(htmlLastAtIndex + mentionQuery.length + 1);
      const newContent = beforeAt + `@${username} ` + afterAt;
      setContent(newContent);
    }
    
    setShowMentions(false);
    setUsers([]);
  };

  const handleSubmit = async () => {
    setSaving(true);
    
    try {
      if (docId) {
        await axios.put(`http://localhost:5000/api/documents/${docId}`, 
          { title, content, isPublic }, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } else {
        await axios.post(`http://localhost:5000/api/documents`, 
          { title, content, isPublic }, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      }
      navigate('/documents');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save document');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">
            Knowledge Base
            {user && (
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'normal', 
                marginLeft: '15px',
                color: '#667eea'
              }}>
                Welcome, {user.username}! 👋
              </span>
            )}
          </div>
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
          <div className="editor-header">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter document title..."
              className="editor-title"
            />
            
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
              />
              <label htmlFor="isPublic" style={{ color: '#666', fontWeight: '500' }}>
                Make this document public
              </label>
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
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

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button 
              onClick={() => navigate('/documents')} 
              className="btn btn-secondary"
              style={{ marginRight: '10px' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={saving || !title.trim()}
            >
              {saving ? 'Saving...' : (docId ? 'Update Document' : 'Create Document')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
