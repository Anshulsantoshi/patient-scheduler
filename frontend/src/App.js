import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
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

// Advanced Loading Component
function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid rgba(59, 130, 246, 0.3)',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '500' }}>
          Loading Healthcare Portal...
        </p>
      </div>
    </div>
  );
}

// Floating Particles Background
function ParticlesBackground() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
}

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%)',
      position: 'relative',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      overflow: 'hidden'
    }}>
      <ParticlesBackground />
      
      {/* Dynamic cursor gradient */}
      <div
        style={{
          position: 'fixed',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          transition: 'all 0.1s ease',
          zIndex: 1
        }}
      />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '60px 48px',
          boxShadow: '0 40px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          maxWidth: '1200px',
          width: '95%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          animation: 'slideUp 1s ease-out'
        }}>
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '50%',
            opacity: '0.1',
            animation: 'pulse 4s ease-in-out infinite'
          }} />

          {/* Header Section */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px auto',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              position: 'relative',
              animation: 'float 6s ease-in-out infinite'
            }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
                <path d="M19 15L19.91 18.26L23 19L19.91 19.74L19 23L18.09 19.74L15 19L18.09 18.26L19 15Z" fill="white" opacity="0.8"/>
                <path d="M5 6L5.91 9.26L9 10L5.91 10.74L5 14L4.09 10.74L1 10L4.09 9.26L5 6Z" fill="white" opacity="0.6"/>
              </svg>
              
              <div style={{
                position: 'absolute',
                width: '140px',
                height: '140px',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '50%',
                animation: 'spin 20s linear infinite'
              }} />
            </div>
            
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0 0 16px 0',
              letterSpacing: '-1px',
              textShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
            }}>
              Patient Scheduler
            </h1>
            
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '0 auto 24px auto',
              fontWeight: '400',
              lineHeight: '1.6',
              maxWidth: '600px'
            }}>
              Your healthcare appointments, simplified and organized
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              HIPAA Compliant & Secure
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '48px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/login" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                padding: '18px 36px',
                borderRadius: '16px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '18px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.05)';
                e.target.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.4)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10,17 15,12 10,7"/>
                <line x1="15" x2="3" y1="12" y2="12"/>
              </svg>
              Access Your Account
            </Link>
            
            <Link 
              to="/register" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '18px 36px',
                borderRadius: '16px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '18px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(-4px) scale(1.05)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" x2="19" y1="8" y2="14"/>
                <line x1="22" x2="16" y1="11" y2="11"/>
              </svg>
              Create Account
            </Link>
          </div>

          {/* Simple Features as before */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '32px',
            marginTop: '40px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '32px',
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📅</div>
                <div style={{ fontWeight: '600', color: 'white' }}>Easy Scheduling</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏰</div>
                <div style={{ fontWeight: '600', color: 'white' }}>Real-time Updates</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
                <div style={{ fontWeight: '600', color: 'white' }}>Secure & Private</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '60px',
            paddingTop: '40px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px'
          }}>
            <p>© 2024 Patient Scheduler. Healthcare appointments made simple and secure.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
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

        {/* Admin Routes */}
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

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}