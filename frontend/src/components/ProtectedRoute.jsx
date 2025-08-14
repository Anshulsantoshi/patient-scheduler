import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn, hasRole } from '../auth';

export default function ProtectedRoute({ children, role }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (role && !hasRole(role)) return <Navigate to="/" replace />;
  return children;
}
