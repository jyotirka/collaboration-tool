import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../App.css';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/documents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setDocuments(res.data);
        setFilteredDocuments(res.data);
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
      setLoading(false);
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const unread = res.data.filter(notif => !notif.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchDocs();
    fetchNotifications();
  }, []);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setFilteredDocuments(documents);
      setSearching(false);
      return;
    }
    
    setSearching(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/documents/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setFilteredDocuments(res.data);
    } catch (err) {
      console.error("Search error:", err);
      setFilteredDocuments([]);
    }
    setSearching(false);
  };

  const debouncedSearch = useCallback(debounce(performSearch, 300), [documents]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearching(true);
    }
    debouncedSearch(query);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const updatedDocs = documents.filter((doc) => doc._id !== id);
      setDocuments(updatedDocs);
      setFilteredDocuments(updatedDocs.filter(doc => 
        !searchQuery || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Knowledge Base</div>
          <div className="nav-links">
            <button 
              onClick={() => navigate("/notifications")} 
              className="btn btn-secondary btn-small"
              style={{ position: 'relative' }}
            >
              🔔 Notifications
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#ff4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
            <button onClick={() => navigate("/create")} className="btn btn-primary btn-small">
              + New Document
            </button>
            <button onClick={handleLogout} className="btn btn-secondary btn-small">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container">
        <div className="card">
          <div className="document-header">
            <h2>Your Documents</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">
                {searching ? '🔄' : '🔍'}
              </div>
            </div>
          </div>
          
          {filteredDocuments.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                {searchQuery ? `No documents found for "${searchQuery}"` : 'No documents yet. Create your first one!'}
              </p>
              {!searchQuery && (
                <button onClick={() => navigate("/create")} className="btn btn-primary">
                  Create Your First Document
                </button>
              )}
            </div>
          ) : (
            <div className="document-grid">
              {filteredDocuments.map((doc) => (
                <div key={doc._id} className="document-card">
                  <div className="document-title">{doc.title}</div>
                  
                  <div className="document-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ 
                        background: doc.isPublic ? '#4caf50' : '#ff9800', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {doc.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                    
                    <div style={{ marginBottom: '5px' }}>
                      <strong style={{ color: '#333', fontSize: '13px' }}>Author:</strong>
                      <span style={{ color: '#666', fontSize: '13px', marginLeft: '5px' }}>
                        {doc.author?.username || doc.author?.email || 'Unknown'}
                      </span>
                    </div>
                    
                    <div style={{ marginBottom: '5px' }}>
                      <strong style={{ color: '#333', fontSize: '13px' }}>Created:</strong>
                      <span style={{ color: '#666', fontSize: '13px', marginLeft: '5px' }}>
                        {new Date(doc.createdAt).toLocaleDateString()} at {new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </span>
                    </div>
                    
                    <div>
                      <strong style={{ color: '#333', fontSize: '13px' }}>Last Updated:</strong>
                      <span style={{ color: '#666', fontSize: '13px', marginLeft: '5px' }}>
                        {new Date(doc.updatedAt).toLocaleDateString()} at {new Date(doc.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </span>
                    </div>
                  </div>
                  
                  <div className="document-actions">
                    <button 
                      onClick={() => navigate(`/edit/${doc._id}`)} 
                      className="btn btn-primary btn-small"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(doc._id)} 
                      className="btn btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
