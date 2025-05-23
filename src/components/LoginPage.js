import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId); // Save userId for personalized queries
      onLogin(res.data.role);
      setLoading(false);
      // Redirect based on role
      if (res.data.role === 'admin' || res.data.role === 'teacher' || res.data.role === 'student' || res.data.role === 'parent') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] fade-in">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Sign In</h2>
        <div className="mb-4 text-gray-600 text-sm">
          <b>Test credentials:</b><br />
          Email: <b>admin</b>, <b>teacher</b>, or <b>student</b><br />
          Password: <b>12345</b>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border rounded px-3 py-2 w-full"
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-xs text-blue-600"
              onClick={() => setShowPwd(v => !v)}
              tabIndex={-1}
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-500 flex items-center justify-center transition-all duration-200"
            disabled={loading}
          >
            {loading ? <span className="loader mr-2"></span> : null}
            Login
          </button>
          {error && <div className="text-red-600">{error}</div>}
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </div>
        <div className="mt-4 text-center text-sm">  
          <b>Note:</b> This is a demo application. Please use the test credentials provided above.
          
        </div>

      </div>
      <style>
        {`
          .loader {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
            display: inline-block;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
        
      </style>
    </div>
  );
}
