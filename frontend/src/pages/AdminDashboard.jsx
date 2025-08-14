import React from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../auth';

export default function AdminDashboard() {
  const user = getUser();
  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      <p className="text-gray-700 mb-6">Welcome, {user?.name}</p>

      <div className="flex flex-wrap gap-4 mb-8">
        <Link className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" to="/admin/all">All Appointments</Link>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Intake Forms</h3>
        <Link className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition" to="/admin/intake/forms">View All Forms</Link>
      </div>
    </div>
  );
}
