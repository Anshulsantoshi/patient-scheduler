import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuth, getUser, isLoggedIn } from '../auth';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  // Update auth state on mount and when storage changes
  useEffect(() => {
    const updateAuthState = () => {
      setUser(getUser());
      setLoggedIn(isLoggedIn());
    };

    // Initial load
    updateAuthState();

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'user') {
        updateAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    clearAuth();
    setUser(null);
    setLoggedIn(false);
    navigate('/login');
  };

  const linkStyle = { color: '#fff', textDecoration: 'none', marginRight: '16px' };
  const buttonStyle = { color: '#fff', background: 'transparent', border: 'none', cursor: 'pointer' };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#111827' }}>
      {/* Logo */}
      <div>
        <Link to="/" style={{ ...linkStyle, fontWeight: 'bold', fontSize: '20px' }}>
          Patient Scheduler
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div>
        {loggedIn && (
          <>
            {user?.role === 'admin' ? (
              <>
                <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>
                <Link to="/admin/appointments" style={linkStyle}>All Appointments</Link>
                <Link to="/admin/forms" style={linkStyle}>All Forms</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                <Link to="/book-appointment" style={linkStyle}>Book Appointment</Link>
                <Link to="/my-appointments" style={linkStyle}>My Appointments</Link>
                <Link to="/submit-form" style={linkStyle}>Submit Form</Link>
                <Link to="/my-forms" style={linkStyle}>My Forms</Link>
              </>
            )}
          </>
        )}
      </div>

      {/* User Actions */}
      <div>
        {loggedIn ? (
          <>
            <span style={{ ...linkStyle, marginRight: '12px' }}>
              {user?.name && user?.role ? `Welcome, ${user.name} (${user.role})` : 'Welcome'}
            </span>
            <button onClick={logout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
