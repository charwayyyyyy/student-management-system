import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  th, td {
    border: 1px solid #e5e7eb;
    padding: 0.7rem;
    text-align: left;
  }
  th {
    background: #f3f4f6;
  }
`;

const Button = styled.button`
  background: #2d3e50;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #61dafb;
    color: #222;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  min-width: 350px;
`;

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalCourse, setModalCourse] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [students, setStudents] = useState([]);
  const [assignStudentId, setAssignStudentId] = useState('');

  const fetchCourses = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('/api/courses', config);
    setCourses(res.data);
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('/api/students', config);
    setStudents(res.data);
  };

  useEffect(() => { fetchCourses(); fetchStudents(); }, []);

  const openModal = (course = null) => {
    setModalCourse(course);
    setForm(course ? { name: course.name, description: course.description } : { name: '', description: '' });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    if (modalCourse) {
      await axios.put(`/api/courses/${modalCourse.id}`, form, config);
    } else {
      await axios.post('/api/courses', form, config);
    }
    closeModal();
    fetchCourses();
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this course?')) {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/courses/${id}`, config);
      fetchCourses();
    }
  };

  const handleAssign = async (courseId) => {
    if (!assignStudentId) return;
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.post(`/api/courses/${courseId}/enroll`, { studentId: assignStudentId }, config);
    setAssignStudentId('');
    alert('Student assigned!');
  };

  return (
    <div>
      <h2>Courses</h2>
      <Button onClick={() => openModal()}>Add Course</Button>
      <Table>
        <thead>
          <tr>
            <th>Name</th><th>Description</th><th>Assign Student</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.description}</td>
              <td>
                <select value={assignStudentId} onChange={e => setAssignStudentId(e.target.value)}>
                  <option value="">Select student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <Button onClick={() => handleAssign(c.id)}>Assign</Button>
              </td>
              <td>
                <Button onClick={() => openModal(c)}>Edit</Button>
                <Button onClick={() => handleDelete(c.id)} style={{background:'#e53e3e',color:'#fff'}}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showModal && (
        <Modal>
          <ModalContent>
            <h3>{modalCourse ? 'Edit Course' : 'Add Course'}</h3>
            <form onSubmit={handleSave}>
              <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" required style={{width:'100%',marginBottom:'1rem',padding:'0.5rem'}} />
              <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description" style={{width:'100%',marginBottom:'1rem',padding:'0.5rem'}} />
              <div style={{display:'flex',justifyContent:'flex-end',gap:'1rem'}}>
                <Button type="submit">Save</Button>
                <Button type="button" onClick={closeModal} style={{background:'#aaa'}}>Cancel</Button>
              </div>
            </form>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
