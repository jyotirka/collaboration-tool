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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await axios.post("http://localhost:5000/api/documents", {
        title,
        content,
        isPublic
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
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
            
            <div className="form-group">
              <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                placeholder="Start writing your document..."
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
