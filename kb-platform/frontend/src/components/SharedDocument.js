import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const SharedDocument = () => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { shareLink } = useParams();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/documents/shared/${shareLink}`);
        setDocument(response.data);
      } catch (err) {
        setError('Document not found or access denied');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [shareLink]);

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <h2 style={{ color: '#e74c3c', textAlign: 'center' }}>Access Denied</h2>
          <p style={{ textAlign: 'center' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Knowledge Base - Shared Document</div>
        </div>
      </nav>
      
      <div className="container">
        <div className="card">
          <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '5px' }}>
              📄 Shared Document (Read-Only)
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Author: {document.author.username} • Created: {new Date(document.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <h1 style={{ marginBottom: '20px', color: '#333' }}>{document.title}</h1>
          
          <div 
            style={{ 
              minHeight: '300px', 
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}
            dangerouslySetInnerHTML={{ __html: document.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedDocument;