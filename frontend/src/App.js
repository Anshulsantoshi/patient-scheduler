import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointments';
import MyAppointments from './pages/MyAppointments';
import AllAppointments from './pages/AllAppointments';

import SubmitIntakeForm from './pages/SubmitIntakeForm';
import MyIntakeForms from './pages/IntakeForms';

function Home() {
  return (
    <div style={{maxWidth:900,margin:'32px auto'}}>
      <h2>Welcome to Patient Scheduler</h2>
      <p>Login or Register to continue.</p>
      <div style={{display:'flex',gap:12}}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/book"
          element={
            <ProtectedRoute role="patient">
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/my"
          element={
            <ProtectedRoute role="patient">
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/intake/submit"
          element={
            <ProtectedRoute role="patient">
              <SubmitIntakeForm />
            </ProtectedRoute>
          }
        />

        <Route
         path="/patient/intake/forms"
         element={
         <ProtectedRoute role="patient">
          <MyIntakeForms />
          </ProtectedRoute>
        }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/all"
          element={
            <ProtectedRoute role="admin">
              <AllAppointments />
            </ProtectedRoute>
          }
        />

         <Route
          path="/admin/intake/forms"
          element={
            <ProtectedRoute role="admin">
              <MyIntakeForms />
            </ProtectedRoute>
          }
        />

        /* Fallback /
        <Route path="" element={<Home />} />
      </Routes>
    </>
  );
}