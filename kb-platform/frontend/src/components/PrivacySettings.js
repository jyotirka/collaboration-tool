import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const PrivacySettings = () => {
  const [document, setDocument] = useState(null);
  const [viewers, setViewers] = useState('');
  const [editors, setEditors] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const doc = res.data;
      setDocument(doc);
      setIsPublic(doc.isPublic);
      setViewers(doc.viewers?.map(v => v.username).join(', ') || '');
      setEditors(doc.editors?.map(e => e.username).join(', ') || '');
    } catch (err) {
      console.error('Error fetching document:', err);
      alert('Failed to load document');
      navigate('/documents');
    }
    setLoading(false);
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      const viewerList = isPublic ? [] : viewers.split(',').map(v => v.trim()).filter(v => v);
      const editorList = editors.split(',').map(e => e.trim()).filter(e => e);

      await axios.put(`http://localhost:5000/api/documents/${id}/permissions`, {
        viewers: viewerList,
        editors: editorList,
        isPublic
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      alert('Permissions updated successfully!');
      navigate('/documents');
    } catch (err) {
      console.error('Error updating permissions:', err);
      alert('Failed to update permissions');
    }
    setSaving(false);
  };

  const generateShareLink = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/documents/${id}/share`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShareLink(res.data.shareLink);
    } catch (err) {
      console.error('Error generating share link:', err);
      if (err.response?.status === 403) {
        alert('Share links are only available for public documents');
      } else {
        alert('Failed to generate share link');
      }
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Share link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: '30px', color: '#333' }}>
          Privacy Settings: {document?.title}
        </h2>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
            Document Visibility
          </label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label htmlFor="isPublic">
              Make this document public (anyone can view, only editors can edit)
            </label>
          </div>
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {isPublic ? 
              '🌐 Public: Anyone can view this document' : 
              '🔒 Private: Only specified users can access this document'
            }
          </small>
        </div>

        {!isPublic && (
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
              Viewers (can only view)
            </label>
            <input
              type="text"
              placeholder="Enter usernames separated by commas (e.g., user1, user2)"
              value={viewers}
              onChange={(e) => setViewers(e.target.value)}
              className="form-input"
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Users who can view but not edit this document
            </small>
          </div>
        )}

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
            {isPublic ? 'Editors (can edit this public document)' : 'Editors (can view and edit)'}
          </label>
          <input
            type="text"
            placeholder="Enter usernames separated by commas (e.g., user1, user2)"
            value={editors}
            onChange={(e) => setEditors(e.target.value)}
            className="form-input"
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            {isPublic ? 
              'Only these users can edit this public document (everyone can view)' :
              'Users who can view and edit this document'
            }
          </small>
        </div>

        {isPublic && (
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
              Share Link
            </label>
            {shareLink ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button onClick={copyShareLink} className="btn btn-secondary btn-small">
                  Copy
                </button>
              </div>
            ) : (
              <button onClick={generateShareLink} className="btn btn-secondary">
                Generate Share Link
              </button>
            )}
            <small style={{ color: '#666', fontSize: '12px' }}>
              🔗 Anyone with this link can view the document (view-only access)
            </small>
          </div>
        )}

        <div style={{ marginTop: '30px', textAlign: 'right' }}>
          <button 
            onClick={() => navigate('/documents')} 
            className="btn btn-secondary"
            style={{ marginRight: '10px' }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSavePermissions}
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;