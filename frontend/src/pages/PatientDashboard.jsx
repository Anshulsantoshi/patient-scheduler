import React from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../auth';

export default function PatientDashboard() {
  const user = getUser();
  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold mb-4">Patient Dashboard</h2>
      <p className="text-gray-700 mb-6">Welcome, {user?.name}</p>

      <div className="flex flex-wrap gap-4 mb-8">
        <Link className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" to="/patient/book">Book Appointment</Link>
        <Link className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" to="/patient/my">My Appointments</Link>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Intake Forms</h3>
        <div className="flex flex-wrap gap-4">
          <Link className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition" to="/patient/intake/submit">Submit Form</Link>
          <Link className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition" to="/patient/intake/forms">View My Forms</Link>
        </div>
      </div>
    </div>
  );
}
