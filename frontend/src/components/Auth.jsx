import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Call parent login handler
      onLogin(data.user, data.token);
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <label>
            <span>Username</span>
            <input 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="your name"
              disabled={loading}
            />
          </label>
          <label>
            <span>Password</span>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="password"
              disabled={loading}
            />
          </label>
          <div className="auth-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Login')}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setIsSignup(prev => !prev);
                setError('');
              }}
              disabled={loading}
            >
              {isSignup ? 'Have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;
