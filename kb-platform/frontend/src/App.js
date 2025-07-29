import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentList from "./components/DocumentList";
import ProtectedRoute from './components/ProtectedRoute';
import CreateDocument from './components/CreateDocument';
import Editor from './components/Editor';
import Notifications from './components/Notifications';
import PrivacySettings from './components/PrivacySettings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🚀 New Features Available</span>
          </div>
          <h1 className="hero-title">
            Your Knowledge,
            <span className="gradient-text"> Organized</span>
          </h1>
          <p className="hero-subtitle">
            Create, collaborate, and share your knowledge with powerful tools.
            Real-time mentions, privacy controls, and beautiful editing experience.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started Free
              <span className="btn-icon">→</span>
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Sign In
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">📝</span>
              <span className="stat-text">Rich Editor</span>
            </div>
            <div className="stat">
              <span className="stat-number">👥</span>
              <span className="stat-text">Collaboration</span>
            </div>
            <div className="stat">
              <span className="stat-number">🔒</span>
              <span className="stat-text">Privacy Control</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-header">
              <div className="card-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div className="card-content">
              <h3>📋 Project Notes</h3>
              <p>Collaborate with @team members...</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-header">
              <div className="card-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div className="card-content">
              <h3>🔔 Notifications</h3>
              <p>You were mentioned in "Project Plan"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Everything you need to organize knowledge</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Rich Text Editor</h3>
              <p>Beautiful editing experience with formatting, links, images, and more</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>@Mentions & Collaboration</h3>
              <p>Mention team members and collaborate in real-time with notifications</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Privacy Controls</h3>
              <p>Granular permissions with public/private docs and share links</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Powerful Search</h3>
              <p>Find any document instantly with full-text search capabilities</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Join thousands of users organizing their knowledge</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Create Your Account
            <span className="btn-icon">🚀</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="home-container">
      <h1 className="home-title">404</h1>
      <p className="home-subtitle">Page Not Found</p>
      <div className="home-actions">
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/documents" element={<ProtectedRoute> <DocumentList /> </ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute> <CreateDocument /> </ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} /> 
        <Route path="/privacy/:id" element={<ProtectedRoute><PrivacySettings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
