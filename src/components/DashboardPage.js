import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

export default function DashboardPage() {
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [role, setRole] = useState('');
  const [studentInfo, setStudentInfo] = useState({});
  const [teacherInfo, setTeacherInfo] = useState({});
  const [adminInfo, setAdminInfo] = useState({});
  const chartRef = useRef();
  const chartInstance = useRef(null);

  useEffect(() => {
    setRole(localStorage.getItem('role') || '');
    async function fetchStats() {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const students = await axios.get('/api/students', config);
      const courses = await axios.get('/api/courses', config);
      setStudentCount(students.data.length);
      setCourseCount(courses.data.length);

      // Fetch personalized info based on role
      if (role === 'student') {
        // Example: fetch student dashboard data
        const [grades, attendance, notifications] = await Promise.all([
          axios.get(`/api/grades/${localStorage.getItem('userId')}`, config).catch(() => ({ data: [] })),
          axios.get(`/api/attendance/report/${localStorage.getItem('userId')}`, config).catch(() => ({ data: [] })),
          axios.get(`/api/notifications`, config).catch(() => ({ data: [] })),
        ]);
        setStudentInfo({
          grades: grades.data,
          attendance: attendance.data,
          notifications: notifications.data,
          // ...add more as needed
        });
      } else if (role === 'teacher') {
        // Example: fetch teacher dashboard data
        const [rosters, assignments, analytics] = await Promise.all([
          axios.get('/api/courses', config).catch(() => ({ data: [] })),
          axios.get('/api/grades', config).catch(() => ({ data: [] })),
          axios.get('/api/attendance', config).catch(() => ({ data: [] })),
        ]);
        setTeacherInfo({
          rosters: rosters.data,
          assignments: assignments.data,
          analytics: analytics.data,
          // ...add more as needed
        });
      } else if (role === 'admin') {
        // Example: fetch admin dashboard data
        const [users, reports] = await Promise.all([
          axios.get('/api/students', config).catch(() => ({ data: [] })),
          axios.get('/api/grades', config).catch(() => ({ data: [] })),
        ]);
        setAdminInfo({
          users: users.data,
          reports: reports.data,
          // ...add more as needed
        });
      }

      if (chartRef.current) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(chartRef.current, {
          type: 'pie',
          data: {
            labels: ['Students', 'Courses'],
            datasets: [{
              data: [students.data.length, courses.data.length],
              backgroundColor: ['#61dafb', '#2d3e50']
            }]
          },
          options: { responsive: true }
        });
      }
    }
    fetchStats();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [role]);

  // Student dashboard
  const StudentDashboard = () => (
    <div>
      <h3 className="font-bold text-lg mb-2">Your Academic Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded">
          <h4 className="font-semibold mb-1">Grades</h4>
          <ul className="list-disc ml-5 text-sm">
            {(studentInfo.grades || []).map((g, i) => (
              <li key={i}>{g.course_id}: {g.grade}</li>
            ))}
          </ul>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <h4 className="font-semibold mb-1">Attendance</h4>
          <div className="text-sm">{studentInfo.attendance ? studentInfo.attendance : 'No data'}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded">
          <h4 className="font-semibold mb-1">Notifications</h4>
          <ul className="list-disc ml-5 text-sm">
            {(studentInfo.notifications || []).map((n, i) => (
              <li key={i}>{n.message}</li>
            ))}
          </ul>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <h4 className="font-semibold mb-1">Fee Payment</h4>
          <div className="text-sm">Status: <span className="font-bold text-green-700">Paid</span></div>
        </div>
      </div>
      <div className="mt-6 bg-white rounded p-4 shadow">
        <h4 className="font-semibold mb-1">Academic Queries</h4>
        <textarea className="w-full border rounded p-2 mb-2" placeholder="Ask a question..."></textarea>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Query</button>
      </div>
    </div>
  );

  // Teacher dashboard
  const TeacherDashboard = () => (
    <div>
      <h3 className="font-bold text-lg mb-2">Classroom Management</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded">
          <h4 className="font-semibold mb-1">Class Rosters</h4>
          <ul className="list-disc ml-5 text-sm">
            {(teacherInfo.rosters || []).map((c, i) => (
              <li key={i}>{c.name}</li>
            ))}
          </ul>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <h4 className="font-semibold mb-1">Assignments</h4>
          <div className="text-sm">{teacherInfo.assignments ? teacherInfo.assignments.length : 0} assignments</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded">
          <h4 className="font-semibold mb-1">Grading Analytics</h4>
          <div className="text-sm">{teacherInfo.analytics ? teacherInfo.analytics.length : 0} records</div>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <h4 className="font-semibold mb-1">Lesson Planning & Resources</h4>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload Resource</button>
        </div>
      </div>
      <div className="mt-6 bg-white rounded p-4 shadow">
        <h4 className="font-semibold mb-1">Communicate</h4>
        <textarea className="w-full border rounded p-2 mb-2" placeholder="Message students or parents..."></textarea>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Send Message</button>
      </div>
    </div>
  );

  // Admin dashboard
  const AdminDashboard = () => (
    <div>
      <h3 className="font-bold text-lg mb-2">Admin Control Panel</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded">
          <h4 className="font-semibold mb-1">User Management</h4>
          <div className="text-sm">{adminInfo.users ? adminInfo.users.length : 0} users</div>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <h4 className="font-semibold mb-1">Course Scheduling</h4>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Schedule Course</button>
        </div>
        <div className="bg-yellow-50 p-4 rounded">
          <h4 className="font-semibold mb-1">Reports & Analytics</h4>
          <div className="text-sm">{adminInfo.reports ? adminInfo.reports.length : 0} reports</div>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <h4 className="font-semibold mb-1">Permissions</h4>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Manage Permissions</button>
        </div>
      </div>
      <div className="mt-6 bg-white rounded p-4 shadow">
        <h4 className="font-semibold mb-1">System Performance</h4>
        <div className="text-sm">All systems operational.</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Dashboard</h2>
          <div className="text-gray-600 mt-1">Welcome, <span className="font-semibold">{role}</span>!</div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="bg-blue-100 p-4 rounded text-center">
            <div className="text-2xl font-bold">{studentCount}</div>
            <div className="text-gray-700">Students</div>
          </div>
          <div className="bg-green-100 p-4 rounded text-center">
            <div className="text-2xl font-bold">{courseCount}</div>
            <div className="text-gray-700">Courses</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <canvas ref={chartRef} width={300} height={300}></canvas>
        </div>
        <div className="flex-1 bg-gray-50 rounded p-6">
          {role === 'admin' && <AdminDashboard />}
          {role === 'teacher' && <TeacherDashboard />}
          {role === 'student' && <StudentDashboard />}
          {role === 'parent' && <div>Parent dashboard goes here</div>}
          {role === 'guardian' && <div>Guardian dashboard goes here</div>}
          {role === 'guest' && <div>Guest dashboard goes here </div>}
          {role === 'other' && <div>Other dashboard goes here</div>}
          <div className="mt-6">  
            <h4 className="font-semibold mb-1">Recent Activities</h4>
            <ul className="list-disc ml-5 text-sm">
              <li>Logged in at {new Date().toLocaleTimeString()}</li>
              <li>Checked grades</li>
              <li>Updated profile</li>
            </ul>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-1">System Notifications</h4>
            <ul className="list-disc ml-5 text-sm">
              <li>New course available: React Basics</li>
              <li>Upcoming parent-teacher meeting on Friday</li>
              <li>System maintenance scheduled for Saturday</li>
            </ul>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-1">Support Tickets</h4>
            <ul className="list-disc ml-5 text-sm">
              <li>Issue with login: Password reset requested</li>
              <li>Request for new course: Python Programming</li>
              <li>Feedback on website design: Enhancements suggested</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}