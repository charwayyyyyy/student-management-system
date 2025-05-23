import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4 text-blue-900 animate-fade-in">Welcome to Student Management System</h1>
      <p className="mb-8 text-lg text-gray-700">Manage students, courses, attendance, and more with ease.</p>
      <div className="flex gap-6 mb-8">
        <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-500 transition">Sign In</Link>
        <Link to="/signup" className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-500 transition">Sign Up</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="bg-blue-100 p-6 rounded shadow hover:scale-105 transition-transform duration-200">
          <h2 className="font-semibold text-xl mb-2">Role-based Access</h2>
          <p className="text-gray-600">Admins, teachers, students, and parents have different permissions and dashboards.</p>
          <Link to="/dashboard" className="text-blue-700 underline mt-2 inline-block">View Dashboard</Link>
        </div>
        <div className="bg-green-100 p-6 rounded shadow hover:scale-105 transition-transform duration-200">
          <h2 className="font-semibold text-xl mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">Visualize student and course data with interactive charts.</p>
          <Link to="/dashboard" className="text-green-700 underline mt-2 inline-block">Go to Analytics</Link>
        </div>
        <div className="bg-yellow-100 p-6 rounded shadow hover:scale-105 transition-transform duration-200">
          <h2 className="font-semibold text-xl mb-2">Modern UI</h2>
          <p className="text-gray-600">Built with React and Tailwind CSS for a fast, responsive experience.</p>
          <Link to="/students" className="text-yellow-700 underline mt-2 inline-block">Manage Students</Link>
        </div>
      </div>
      <div className="mt-12 flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <div className="flex-1 bg-white rounded shadow p-6">
          <h3 className="font-bold text-lg mb-2">Quick Tips</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Use the sidebar to navigate between modules.</li>
            <li>Admins can add, edit, and delete students and courses.</li>
            <li>Teachers can manage grades and attendance.</li>
            <li>Students can view their own records and performance.</li>
          </ul>
        </div>
        <div className="flex-1 bg-white rounded shadow p-6">
          <h3 className="font-bold text-lg mb-2">Get Started</h3>
          <p className="mb-2">Try logging in as:</p>
          <ul className="list-none text-gray-700">
            <li><b>admin</b> / 12345</li>
            <li><b>teacher</b> / 12345</li>
            <li><b>student</b> / 12345</li>
          </ul>
        </div>
        <div className="flex-1 bg-white rounded shadow p-6">
          <h3 className="font-bold text-lg mb-2">Support</h3>
          <p>Need help? Contact us at <a href="mailto:support@example.com" className="text-blue-700 underline">support@example.com</a></p>
          <p>For more information, visit our <a href="https://github.com/theo-kyei/student-management-system" className="text-blue-700 underline">GitHub repository</a></p>
          <p>Stay tuned for updates and new features!</p>
          <div className="flex items-center justify-center mt-8">
            <img src="/images/github-logo.png" alt="GitHub Logo" className="w-16 h-16" />
            <img src="/images/react-logo.png" alt="React Logo" className="w-16 h-16 ml-4" />
            <img src="/images/tailwind-logo.png" alt="Tailwind CSS Logo" className="w-16 h-16 ml-4" />
          </div>
          <p className="mt-4 text-center text-gray-600">© 2023 Student Management System. All rights reserved.</p>
          <p className="mt-4 text-center text-gray-600">Built with love by <a href="https://github.com/theo-kyei" className="text-blue-700 underline">Theo Kyei</a></p>
          <p className="mt-4 text-center text-gray-600">Powered by <a href="https://nextjs.org/" className="text-blue-700 underline">Next.js</a> and <a href="https://tailwindcss.com/" className="text-blue-700 underline">Tailwind CSS</a></p>
          <p className="mt-4 text-center text-gray-600">Follow us on <a href="https://twitter.com/theokyei" className="text-blue-700 underline">Twitter</a> and <a href="https://github.com/theo-kyei/student-management-system" className="text-blue-700 underline">GitHub</a></p>
        </div>
      </div>
    </div>
  );
}
