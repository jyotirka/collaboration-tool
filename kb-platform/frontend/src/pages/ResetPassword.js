import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setStatus('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    setStatus('');

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setStatus(res.data.message || 'Password reset successful!');
      if (res.data.message && res.data.message.includes('success')) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error resetting password');
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create New Password</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Enter your new password below.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-input"
              required
              minLength="6"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          <div className="form-group" style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="form-input"
              required
              minLength="6"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/login" className="nav-link">← Back to Login</Link>
        </div>
        
        {status && (
          <div className={`message ${status.includes('success') ? 'success' : 'error'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
