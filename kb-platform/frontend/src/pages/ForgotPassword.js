import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setStatus(res.data.message);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error sending reset link');
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/login" className="nav-link">← Back to Login</Link>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ color: '#666' }}>Don't have an account? </span>
          <Link to="/register" className="nav-link">Sign Up</Link>
        </div>
        
        {status && (
          <div className={`message ${status.includes('sent') || status.includes('link') ? 'success' : 'error'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
