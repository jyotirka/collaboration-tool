import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setMsg("Login successful!");
      setTimeout(() => navigate('/documents'), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login error');
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
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
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Link to="/forgot-password" className="nav-link">Forgot Password?</Link>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#666' }}>Don't have an account? </span>
          <Link to="/register" className="nav-link">Sign Up</Link>
        </div>
        
        {msg && (
          <div className={`message ${msg.includes('successful') ? 'success' : 'error'}`}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
