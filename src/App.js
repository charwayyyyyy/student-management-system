import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import StudentsPage from './components/StudentsPage';
import CoursesPage from './components/CoursesPage';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ParentPortal from './components/ParentPortal';
import TeacherPortal from './components/TeacherPortal';
import StudentPortal from './components/StudentPortal';
import AdminPortal from './components/AdminPortal';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background: #f4f6fa;
    margin: 0;
    font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
  }
  .fade-in {
    animation: fadeIn 0.7s;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px);}
    to { opacity: 1; transform: translateY(0);}
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole('');
  };

  // Role-based dashboard redirect
  const getDashboardRoute = () => {
    if (role === 'admin' || role === 'teacher' || role === 'student' || role === 'parent') {
      return "/dashboard";
    }
    return "/";
  };

  return (
    <>
      <GlobalStyle />
      <Router>
        <nav className="bg-blue-900 text-white px-8 py-4 flex justify-between items-center">
          <div className="flex gap-6">
            <Link to="/" className="font-bold text-xl">StudentMS</Link>
            <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
            <Link to="/students" className="hover:text-blue-300">Students</Link>
            <Link to="/courses" className="hover:text-blue-300">Courses</Link>
          </div>
          <div className="flex gap-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400 transition-all duration-200">Logout</button>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-300">Login</Link>
                <Link to="/signup" className="hover:text-blue-300">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
        <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded shadow min-h-[70vh] fade-in">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={
              isLoggedIn ? (
                role === 'admin' ? <AdminPortal /> :
                role === 'teacher' ? <TeacherPortal /> :
                role === 'student' ? <StudentPortal /> :
                role === 'parent' ? <ParentPortal /> :
                <DashboardPage />
              ) : <Navigate to="/login" />
            } />
            <Route path="/students" element={isLoggedIn && (role === 'admin' || role === 'teacher') ? <StudentsPage /> : <Navigate to={getDashboardRoute()} />} />
            <Route path="/courses" element={isLoggedIn && (role === 'admin' || role === 'teacher') ? <CoursesPage /> : <Navigate to={getDashboardRoute()} />} />
            <Route path="/login" element={<LoginPage onLogin={(userRole) => { setIsLoggedIn(true); setRole(userRole); }} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<Navigate to={getDashboardRoute()} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
