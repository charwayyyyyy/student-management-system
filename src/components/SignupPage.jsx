import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [form, setForm] = useState({ email: '', password: '', confirm: '', role: 'student' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/auth/signup', { email: form.email, password: form.password, role: form.role });
      setSuccess('Account created! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] fade-in">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Sign Up</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />
          <input
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>
          <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-500 transition-all duration-200" disabled={loading}>
            {loading ? <span className="loader mr-2"></span> : null}
            Sign Up
          </button>
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign In</a>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <b>Role info:</b> Students can view their records. Teachers can manage courses and grades. Parents can view their child's performance.
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <b>Password requirements:</b> 8 characters long, including uppercase, lowercase, numbers, and special characters.
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <b>Email format:</b> 5-64 characters, including lowercase and uppercase letters, numbers, dots, and underscores.
          <b>Password strength indicator:</b> <span className="text-red-600">Weak</span>, <span className="text-yellow-600">Medium</span>, or <span className="text-green-600">Strong</span>
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
          .fade-in {
            animation: fadeIn 0.7s;
          }
            @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .fade-in {
            animation: fadeIn 0.7s;
          }
        `}
      </style>
    </div>
  );
}
