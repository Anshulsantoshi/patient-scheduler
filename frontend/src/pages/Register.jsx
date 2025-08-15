import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

// Floating Particles Background (same as original)
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

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { data } = await api.post("/users/register", form);
      
      if (data?.success) {
        // Navigate to OTP verification with user data
        navigate("/verify-otp", {
          state: {
            userId: data.userId,
            email: data.email,
            message: data.message
          }
        });
      } else {
        setError(data?.message || "Registration failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

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
          padding: '48px 40px',
          boxShadow: '0 40px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          animation: 'slideUp 1s ease-out'
        }}>
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '50%',
            opacity: '0.1',
            animation: 'pulse 4s ease-in-out infinite'
          }} />

          {/* Header Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              position: 'relative',
              animation: 'float 6s ease-in-out infinite'
            }}>
              {/* User Plus Icon */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="19" x2="19" y1="8" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="22" x2="16" y1="11" y2="11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              <div style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '50%',
                animation: 'spin 20s linear infinite'
              }} />
            </div>
            
            <h1 style={{
              fontSize: '36px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0 0 12px 0',
              letterSpacing: '-1px',
              textShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
            }}>
              Create Account
            </h1>
            
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: '0 auto 20px auto',
              fontWeight: '400',
              lineHeight: '1.5',
              maxWidth: '400px'
            }}>
              Register to schedule and manage your appointments
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '6px 12px',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              Email Verification Required
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '20px' }}>
              <input
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={onChange}
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500',
                  outline: 'none',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(16, 185, 129, 0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={onChange}
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500',
                  outline: 'none',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(16, 185, 129, 0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={onChange}
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  paddingRight: '60px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500',
                  outline: 'none',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(16, 185, 129, 0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500',
                  outline: 'none',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(16, 185, 129, 0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="patient" style={{ background: '#1e293b', color: 'white' }}>Patient</option>
                <option value="admin" style={{ background: '#1e293b', color: 'white' }}>Admin</option>
              </select>
            </div>

            <button
              disabled={loading}
              type="submit"
              style={{
                width: '100%',
                background: loading 
                  ? 'rgba(16, 185, 129, 0.6)' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '18px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '18px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: loading 
                  ? 'none' 
                  : '0 8px 32px rgba(16, 185, 129, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = '0 16px 40px rgba(16, 185, 129, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.4)';
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Creating Account...
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" x2="19" y1="8" y2="14"/>
                    <line x1="22" x2="16" y1="11" y2="11"/>
                  </svg>
                  Create Account
                </div>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              margin: '0'
            }}>
              Already have an account?{" "}
              <Link 
                to="/login" 
                style={{
                  color: '#10b981',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  padding: '2px 4px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                  e.target.style.color = '#34d399';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#10b981';
                }}
              >
                Sign in here
              </Link>
            </p>
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
          50% { transform: translateY(-8px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}