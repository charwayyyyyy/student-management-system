import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentPortal() {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.get(`/api/grades/${userId}`, config).then(res => setGrades(res.data));
    axios.get('/api/courses', config).then(res => setCourses(res.data));
  }, []);

  const handleRegisterCourse = async () => {
    if (!selectedCourse) return;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.post(`/api/courses/${selectedCourse}/enroll`, { studentId: userId }, config);
    alert('Registered!');
  };

  const handleViewAssignments = async (courseId) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`/api/assignments/course/${courseId}`, config);
    setAssignments(res.data);
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.post(`/api/assignments/${assignmentId}/submit`, { file_url: fileUrl }, config);
    alert('Assignment submitted!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Student Portal</h2>
      <div className="mb-4">
        <h3 className="font-bold">Grades</h3>
        <ul className="list-disc ml-6">
          {grades.map((g, i) => <li key={i}>{g.course_id}: {g.grade}</li>)}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Register for Course</h3>
        <select className="border rounded px-2 py-1" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          <option value="">--Select Course--</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="ml-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={handleRegisterCourse}>Register</button>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Assignments</h3>
        <select className="border rounded px-2 py-1" onChange={e => handleViewAssignments(e.target.value)}>
          <option value="">--Select Course--</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <ul className="list-disc ml-6">
          {assignments.map(a => (
            <li key={a.id}>
              {a.title} (Due: {a.due_date})
              <input type="text" placeholder="File URL" className="ml-2 border px-2 py-1 rounded" value={fileUrl} onChange={e => setFileUrl(e.target.value)} />
              <button className="ml-2 bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleSubmitAssignment(a.id)}>Submit</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center">
        <button className="bg-red-600 text-white px-4 py-2 rounded mt-4" onClick={() => localStorage.removeItem('token')}>Logout</button>

        <p className="mt-2 text-gray-600">Logged in as: {localStorage.getItem('userId')}</p>
        <p className="text-gray-600">Role: {localStorage.getItem('role')}</p>
        <p className="text-gray-600">Token: {localStorage.getItem('token')}</p>
        <p className="text-gray-600">Student ID: {localStorage.getItem('userId')}</p>
        <p className="text-gray-600">Email: {localStorage.getItem('email')}</p>
      </div>
      </div>
  );
}
