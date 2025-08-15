import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointments';
import MyAppointments from './pages/MyAppointments';
import AllAppointments from './pages/AllAppointments';
import SubmitIntakeForm from './pages/SubmitIntakeForm';
import MyIntakeForms from './pages/IntakeForms';
import AdminIntakeForms from './pages/Adminintakeform';

// Advanced Loading Component with Medical Theme
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
        {/* Medical cross loading animation */}
        <div style={{
          position: 'relative',
          width: '60px',
          height: '60px'
        }}>
          <div style={{
            position: 'absolute',
            width: '60px',
            height: '20px',
            background: 'linear-gradient(90deg, #3b82f6, #10b981)',
            borderRadius: '10px',
            top: '20px',
            animation: 'pulseHorizontal 2s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            width: '20px',
            height: '60px',
            background: 'linear-gradient(180deg, #3b82f6, #10b981)',
            borderRadius: '10px',
            left: '20px',
            animation: 'pulseVertical 2s ease-in-out infinite 0.5s'
          }}></div>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '500' }}>
          Loading Healthcare Portal...
        </p>
      </div>
    </div>
  );
}

// Medical-themed floating elements
function MedicalParticlesBackground() {
  const medicalIcons = [
    '🏥', '💊', '🩺', '💉', '🧬', '⚕️', '🔬', '💚', '📋', '🔍'
  ];

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
      {/* Floating medical icons */}
      {medicalIcons.map((icon, i) => (
        <div
          key={`icon-${i}`}
          style={{
            position: 'absolute',
            fontSize: `${Math.random() * 20 + 15}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.1,
            animation: `floatMedical ${Math.random() * 10 + 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            filter: 'blur(0.5px)'
          }}
        >
          {icon}
        </div>
      ))}
      
      {/* Animated heartbeat lines */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`heartbeat-${i}`}
          style={{
            position: 'absolute',
            width: '200px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
            left: `${Math.random() * 80}%`,
            top: `${20 + i * 30}%`,
            opacity: 0.3,
            animation: `heartbeat ${2 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`
          }}
        />
      ))}

      {/* DNA Helix animation */}
      <div style={{
        position: 'absolute',
        right: '10%',
        top: '20%',
        width: '100px',
        height: '200px',
        opacity: 0.1
      }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={`dna-${i}`}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              backgroundColor: i % 2 === 0 ? '#3b82f6' : '#10b981',
              borderRadius: '50%',
              left: `${Math.sin(i * 0.5) * 40 + 46}px`,
              top: `${i * 25}px`,
              animation: `dnaRotate ${4}s linear infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Medical cross patterns */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`cross-${i}`}
          style={{
            position: 'absolute',
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
            opacity: 0.05,
            animation: `rotateCross ${10 + i * 2}s linear infinite`
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="#10b981">
            <rect x="15" y="5" width="10" height="30" rx="2"/>
            <rect x="5" y="15" width="30" height="10" rx="2"/>
          </svg>
        </div>
      ))}

      {/* Pulse circles (like heart monitor) */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`pulse-${i}`}
          style={{
            position: 'absolute',
            width: `${30 + Math.random() * 50}px`,
            height: `${30 + Math.random() * 50}px`,
            border: '2px solid rgba(16, 185, 129, 0.1)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `pulseMedical ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`
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
    const timer = setTimeout(() => setIsLoading(false), 2000);
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
      <MedicalParticlesBackground />
      
      {/* Enhanced cursor gradient with medical theme */}
      <div
        style={{
          position: 'fixed',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
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
          {/* Animated medical background elements */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '80px',
            height: '80px',
            opacity: 0.1,
            animation: 'medicalCrossSpin 8s linear infinite'
          }}>
            <svg viewBox="0 0 100 100" fill="#10b981">
              <rect x="35" y="10" width="30" height="80" rx="5"/>
              <rect x="10" y="35" width="80" height="30" rx="5"/>
            </svg>
          </div>

          <div style={{
            position: 'absolute',
            top: '50px',
            left: '20px',
            width: '60px',
            height: '60px',
            opacity: 0.08,
            animation: 'stethoscopeFloat 6s ease-in-out infinite'
          }}>
            <div style={{ fontSize: '60px' }}>🩺</div>
          </div>

          {/* Header Section with enhanced medical icon */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px auto',
              boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              position: 'relative',
              animation: 'heartbeatIcon 3s ease-in-out infinite'
            }}>
              {/* Medical cross with heartbeat animation */}
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="8" width="16" height="44" rx="3" fill="white"/>
                <rect x="8" y="22" width="44" height="16" rx="3" fill="white"/>
                <circle cx="30" cy="15" r="3" fill="rgba(255,255,255,0.8)"/>
                <circle cx="30" cy="45" r="3" fill="rgba(255,255,255,0.8)"/>
                <circle cx="15" cy="30" r="3" fill="rgba(255,255,255,0.8)"/>
                <circle cx="45" cy="30" r="3" fill="rgba(255,255,255,0.8)"/>
              </svg>
              
              <div style={{
                position: 'absolute',
                width: '140px',
                height: '140px',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '50%',
                animation: 'medicalPulse 4s ease-in-out infinite'
              }} />
              
              <div style={{
                position: 'absolute',
                width: '160px',
                height: '160px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '50%',
                animation: 'medicalPulse 4s ease-in-out infinite 1s'
              }} />
            </div>
            
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #ffffff 0%, #10b981 50%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0 0 16px 0',
              letterSpacing: '-1px',
              textShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
              animation: 'textGlow 3s ease-in-out infinite alternate'
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
                animation: 'healthPulse 2s ease-in-out infinite'
              }} />
              HIPAA Compliant & Secure
            </div>
          </div>

          {/* Enhanced Action Buttons */}
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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '18px 36px',
                borderRadius: '16px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '18px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.05)';
                e.target.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.6)';
                e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.4)';
                e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
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
                border: '2px solid rgba(16, 185, 129, 0.3)',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(16, 185, 129, 0.2)';
                e.target.style.transform = 'translateY(-4px) scale(1.05)';
                e.target.style.borderColor = 'rgba(16, 185, 129, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.borderColor = 'rgba(16, 185, 129, 0.3)';
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

          {/* Enhanced Features with medical icons */}
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
                <div style={{ 
                  fontSize: '32px', 
                  marginBottom: '12px',
                  animation: 'bounceIcon 3s ease-in-out infinite'
                }}>🗓️</div>
                <div style={{ fontWeight: '600', color: 'white' }}>Easy Scheduling</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '32px', 
                  marginBottom: '12px',
                  animation: 'bounceIcon 3s ease-in-out infinite 1s'
                }}>⏰</div>
                <div style={{ fontWeight: '600', color: 'white' }}>Real-time Updates</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '32px', 
                  marginBottom: '12px',
                  animation: 'bounceIcon 3s ease-in-out infinite 2s'
                }}>🔒</div>
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

      {/* Enhanced styles with medical animations */}
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

        @keyframes heartbeatIcon {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.05); }
          50% { transform: scale(1); }
          75% { transform: scale(1.02); }
        }

        @keyframes medicalPulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.3; 
          }
          50% { 
            transform: scale(1.2); 
            opacity: 0.1; 
          }
        }

        @keyframes floatMedical {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.1; 
          }
          25% { 
            transform: translateY(-20px) rotate(5deg); 
            opacity: 0.2; 
          }
          50% { 
            transform: translateY(-10px) rotate(-5deg); 
            opacity: 0.15; 
          }
          75% { 
            transform: translateY(-25px) rotate(3deg); 
            opacity: 0.1; 
          }
        }

        @keyframes heartbeat {
          0%, 20%, 40%, 60%, 80%, 100% {
            transform: scaleX(1);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: scaleX(1.2);
          }
        }

        @keyframes dnaRotate {
          0% { transform: rotateY(0deg) translateZ(40px); }
          100% { transform: rotateY(360deg) translateZ(40px); }
        }

        @keyframes rotateCross {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(0.9); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes pulseMedical {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.1; 
          }
          50% { 
            transform: scale(1.5); 
            opacity: 0.05; 
          }
        }

        @keyframes pulseHorizontal {
          0%, 100% { transform: scaleX(1); opacity: 1; }
          50% { transform: scaleX(1.2); opacity: 0.7; }
        }

        @keyframes pulseVertical {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(1.2); opacity: 0.7; }
        }

        @keyframes medicalCrossSpin {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes stethoscopeFloat {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          33% { transform: translateY(-10px) rotate(0deg); }
          66% { transform: translateY(-5px) rotate(5deg); }
        }

        @keyframes textGlow {
          0% { text-shadow: 0 0 30px rgba(16, 185, 129, 0.5); }
          100% { text-shadow: 0 0 40px rgba(16, 185, 129, 0.8), 0 0 60px rgba(16, 185, 129, 0.3); }
        }

        @keyframes healthPulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); 
          }
          50% { 
            transform: scale(1.2); 
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); 
          }
        }

        @keyframes bounceIcon {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
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
              <AdminIntakeForms />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}