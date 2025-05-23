import React, { useEffect, useState, useCallback } from 'react';
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


export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalStudent, setModalStudent] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', dob: '' });

  const fetchStudents = useCallback(async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`/api/students?search=${search}&page=${page}`, config);
    setStudents(res.data);
  }, [search, page]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const openModal = (student = null) => {
    setModalStudent(student);
    setForm(student ? { name: student.name, email: student.email, dob: student.dob?.slice(0,10) || '' } : { name: '', email: '', dob: '' });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    if (modalStudent) {
      await axios.put(`/api/students/${modalStudent.id}`, form, config);
    } else {
      await axios.post('/api/students', form, config);
    }
    closeModal();
    fetchStudents();
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this student?')) {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/students/${id}`, config);
      fetchStudents();
    }
  };

  return (
    <div>
      <h2>Students</h2>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}>
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{padding:'0.5rem',borderRadius:'5px',border:'1px solid #ccc',width:'250px'}}
        />
        <Button onClick={() => openModal()}>Add Student</Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Date of Birth</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.dob ? s.dob.slice(0,10) : ''}</td>
              <td>
                <Button onClick={() => openModal(s)}>Edit</Button>
                <Button onClick={() => handleDelete(s.id)} style={{background:'#e53e3e',color:'#fff'}}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{display:'flex',justifyContent:'center',gap:'1rem'}}>
        <Button onClick={() => setPage(p => Math.max(1, p-1))}>Prev</Button>
        <span>Page {page}</span>
        <Button onClick={() => setPage(p => p+1)}>Next</Button>
      </div>
      {showModal && (
        <Modal>
          <ModalContent>
            <h3>{modalStudent ? 'Edit Student' : 'Add Student'}</h3>
            <form onSubmit={handleSave}>
              <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" required style={{width:'100%',marginBottom:'1rem',padding:'0.5rem'}} />
              <input name="email" value={form.email} onChange={handleFormChange} placeholder="Email" required style={{width:'100%',marginBottom:'1rem',padding:'0.5rem'}} />
              <input name="dob" type="date" value={form.dob} onChange={handleFormChange} placeholder="Date of Birth" style={{width:'100%',marginBottom:'1rem',padding:'0.5rem'}} />
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
