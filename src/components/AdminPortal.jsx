import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPortal() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.get('/api/students', config).then(res => setUsers(res.data));
    axios.get('/api/courses', config).then(res => setCourses(res.data));
    axios.get('/api/grades', config).then(res => setReports(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Admin Portal</h2>
      <div className="mb-4">
        <h3 className="font-bold">User Management</h3>
        <div>{users.length} users</div>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Course Management</h3>
        <div>{courses.length} courses</div>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Reports & Analytics</h3>
        <div>{reports.length} grade records</div>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">System Configuration</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Configure System</button>
      </div>
    </div>
    
  );
}
