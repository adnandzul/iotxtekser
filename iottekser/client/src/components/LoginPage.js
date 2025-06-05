// components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'animate.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://47.84.53.252:31001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/admin/delete');
    } else {
      setError(data.message || 'Login gagal');
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center animate__animated animate__fadeIn"
      style={{ minHeight: '90vh' }}
    >
      <div
        className="card shadow-lg p-5"
        style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#0c1e33',
          color: '#e0e7ff',
          borderRadius: '16px',
          boxShadow: '0 0 30px rgba(14, 56, 112, 0.8)',
          border: '2px solid #1e90ff',
          transformOrigin: 'center',
          animation: 'pulse 3s infinite alternate',
        }}
      >
        <h3
          className="text-center mb-4"
          style={{ textShadow: '0 0 8px #1e90ff', fontWeight: '700', fontSize: '2rem' }}
        >
          Admin Login
        </h3>

        {error && (
          <div className="alert alert-danger shadow-sm" role="alert" style={{ fontWeight: '600' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="form-label" style={{ fontWeight: '600' }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                backgroundColor: '#1e2d55',
                border: '1.5px solid #1e90ff',
                color: '#e0e7ff',
                fontWeight: '600',
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label" style={{ fontWeight: '600' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                backgroundColor: '#1e2d55',
                border: '1.5px solid #1e90ff',
                color: '#e0e7ff',
                fontWeight: '600',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              fontWeight: '600',
              letterSpacing: '0.05em',
              boxShadow: '0 0 15px #1e90ff',
              borderRadius: '8px',
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
