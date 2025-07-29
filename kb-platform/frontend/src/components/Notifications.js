import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
    setLoading(false);
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    if (notification.documentId) {
      navigate(`/edit/${notification.documentId._id}`);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: '30px', color: '#333' }}>Notifications</h2>
        
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>No notifications yet</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                style={{
                  padding: '15px',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  backgroundColor: notification.read ? '#f9f9f9' : '#e3f2fd',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = notification.read ? '#f9f9f9' : '#e3f2fd'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontWeight: notification.read ? 'normal' : 'bold' }}>
                      {notification.message}
                    </p>
                    {notification.documentId && (
                      <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        Document: {notification.documentId.title}
                      </p>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {!notification.read && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#667eea',
                    position: 'absolute',
                    right: '10px',
                    top: '10px'
                  }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;