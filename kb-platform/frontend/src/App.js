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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Knowledge Base Platform</h1>
      <p className="home-subtitle">Create, manage, and share your knowledge with the world</p>
      <div className="home-actions">
        <Link to="/login" className="btn btn-secondary">Get Started</Link>
        <Link to="/register" className="btn btn-secondary">Create Account</Link>
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
