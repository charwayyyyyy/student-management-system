import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TeacherPortal() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [gradeData, setGradeData] = useState({ studentId: '', courseId: '', grade: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.get('/api/courses', config).then(res => setCourses(res.data));
  }, []);

  const handleCreateAssignment = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.post('/api/assignments', {
      course_id: selectedCourse,
      title: 'New Assignment',
      description: 'Description here',
      due_date: new Date().toISOString().slice(0, 10)
    }, config);
    alert('Assignment created!');
  };

  const handleGrade = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.post('/api/grades', gradeData, config);
    alert('Grade submitted!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Teacher Portal</h2>
      <div className="mb-4">
        <h3 className="font-bold">Manage Classes</h3>
        <select className="border rounded px-2 py-1" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          <option value="">--Select Course--</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="ml-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={handleCreateAssignment}>Create Assignment</button>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Upload Grades</h3>
        <input type="text" placeholder="Student ID" className="border px-2 py-1 rounded mr-2" onChange={e => setGradeData({ ...gradeData, studentId: e.target.value })} />
        <input type="text" placeholder="Course ID" className="border px-2 py-1 rounded mr-2" onChange={e => setGradeData({ ...gradeData, courseId: e.target.value })} />
        <input type="text" placeholder="Grade" className="border px-2 py-1 rounded mr-2" onChange={e => setGradeData({ ...gradeData, grade: e.target.value })} />
        <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleGrade}>Submit Grade</button>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Communicate</h3>
        <textarea className="w-full border rounded p-2 mb-2" placeholder="Message students or parents..."></textarea>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Send Message</button>
      </div>
    </div>
  );
}

