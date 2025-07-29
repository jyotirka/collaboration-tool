// pages/ResetPassword.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Resetting...');

    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, { password });
      setStatus(res.data.message || 'Password reset successful. You can now login.');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      <p>{status}</p>
    </div>
  );
};

export default ResetPassword;
