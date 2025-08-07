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
    try {
      const searchQuery = query || '';
      const res = await axios.get(`http://localhost:5000/api/documents/users/search?q=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('User search failed:', err);
      setUsers([]);
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
      
      if (query.length >= 0 && query.length <= 20) {
        setMentionQuery(query);
        setShowMentions(true);
        searchUsers(query || '');
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

  const compressImage = (base64, maxSize = 50000) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions to reduce file size
        let { width, height } = img;
        const maxDimension = 400; // Max width/height
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress with quality adjustment
        let quality = 0.7;
        let compressedBase64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
        
        // Reduce quality if still too large
        while (compressedBase64.length > maxSize && quality > 0.1) {
          quality -= 0.1;
          compressedBase64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
        }
        
        resolve(compressedBase64);
      };
      img.src = `data:image/jpeg;base64,${base64}`;
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    
    try {
      let processedContent = content;
      
      // Find all base64 images and compress them
      const imageMatches = content.match(/<img[^>]+src="data:image\/[^;]+;base64,([^"]+)"/g);
      
      if (imageMatches) {
        for (const match of imageMatches) {
          const base64Match = match.match(/base64,([^"]+)/);
          if (base64Match && base64Match[1].length > 50000) {
            try {
              const compressedBase64 = await compressImage(base64Match[1]);
              processedContent = processedContent.replace(base64Match[1], compressedBase64);
            } catch (err) {
              console.warn('Image compression failed:', err);
            }
          }
        }
      }
      
      if (docId) {
        await axios.put(`http://localhost:5000/api/documents/${docId}`, 
          { title, content: processedContent, isPublic }, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } else {
        await axios.post(`http://localhost:5000/api/documents`, 
          { title, content: processedContent, isPublic }, 
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
      if (err.response?.status === 413) {
        alert('Document too large. Please use smaller images.');
      } else {
        alert('Failed to save document');
      }
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
                {users.filter(user => user.username).map(user => (
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
                      {user.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>@{user.username || 'unknown'}</div>
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
