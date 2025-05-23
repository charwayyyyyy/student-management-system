import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ParentPortal() {
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.get('/api/students', config).then(res => setWards(res.data));
  }, []);

  const handleSelectWard = async (ward) => {
    setSelectedWard(ward);
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [gradesRes, attendanceRes, notificationsRes] = await Promise.all([
      axios.get(`/api/grades/${ward.id}`, config).catch(() => ({ data: [] })),
      axios.get(`/api/attendance/report/${ward.id}`, config).catch(() => ({ data: [] })),
      axios.get(`/api/notifications`, config).catch(() => ({ data: [] })),
    ]);
    setGrades(gradesRes.data);
    setAttendance(attendanceRes.data);
    setNotifications(notificationsRes.data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Parent Portal</h2>
      <div className="mb-4">
        <label className="font-semibold">Select Ward:</label>
        <select className="ml-2 border rounded px-2 py-1" onChange={e => {
          const ward = wards.find(w => w.id === Number(e.target.value));
          handleSelectWard(ward);
        }}>
          <option value="">--Select--</option>
          {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>
      {selectedWard && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Grades</h3>
          <ul className="list-disc ml-6">
            {grades.map((g, i) => <li key={i}>{g.course_id}: {g.grade}</li>)}
          </ul>
          <h3 className="font-bold mt-4 mb-2">Attendance</h3>
          <div>{attendance ? JSON.stringify(attendance) : 'No data'}</div>
          <h3 className="font-bold mt-4 mb-2">Notifications</h3>
          <ul className="list-disc ml-6">
            {notifications.map((n, i) => <li key={i}>{n.message}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
//             <button
//               type="button"
//               onClick={() => setShowPwd(!showPwd)}
//               className="absolute right-2 top-2 text-xs text-blue-600"