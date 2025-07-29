import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMsg('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, username, password });
      setMsg(res.data.message);
      if (res.data.message.includes('success')) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error occurred');
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Choose a username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Create password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Confirm password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: '#666' }}>Already have an account? </span>
          <Link to="/login" className="nav-link">Sign In</Link>
        </div>
        
        {msg && (
          <div className={`message ${msg.includes('success') ? 'success' : 'error'}`}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
