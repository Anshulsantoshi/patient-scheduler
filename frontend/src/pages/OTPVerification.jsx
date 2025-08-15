import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { setAuth } from "../auth";

// Floating Particles Background (same as Register)
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

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const inputRefs = useRef([]);

  // Get userId and email from navigation state
  const { userId, email } = location.state || {};

  useEffect(() => {
    if (!userId || !email) {
      navigate("/register");
      return;
    }

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [userId, email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOTPChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus next empty input or last input
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const { data } = await api.post("/users/verify-otp", {
        userId,
        otp: otpString
      });

      if (data?.success) {
        setSuccess("Account verified successfully! Redirecting...");
        setAuth({ token: data.token, user: data.user });
        
        setTimeout(() => {
          data.user.role === "admin" ? navigate("/admin") : navigate("/patient");
        }, 1500);
      } else {
        setError(data?.message || "Invalid OTP");
        
        // Clear OTP inputs if invalid
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Verification failed");
      
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const { data } = await api.post("/users/resend-otp", { userId });
      
      if (data?.success) {
        setSuccess("New OTP sent to your email!");
        setTimeLeft(600); // Reset timer to 10 minutes
        setOtp(['', '', '', '', '', '']); // Clear inputs
        inputRefs.current[0]?.focus();
      } else {
        setError(data?.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
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
          maxWidth: '520px',
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
            background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
            borderRadius: '50%',
            opacity: '0.1',
            animation: 'pulse 4s ease-in-out infinite'
          }} />

          {/* Header Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              position: 'relative',
              animation: 'float 6s ease-in-out infinite'
            }}>
              {/* Shield Check Icon */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              <div style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                border: '2px solid rgba(59, 130, 246, 0.3)',
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
              textShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
            }}>
              Verify Your Email
            </h1>
            
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: '0 auto 20px auto',
              fontWeight: '400',
              lineHeight: '1.5',
              maxWidth: '400px'
            }}>
              We've sent a 6-digit code to <br />
              <span style={{ color: '#3b82f6', fontWeight: '600' }}>{email}</span>
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '6px 12px',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#3b82f6',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              Code expires in {formatTime(timeLeft)}
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {success}
            </div>
          )}

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
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleVerifyOTP} style={{ textAlign: 'center' }}>
            {/* OTP Input Fields */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '32px'
            }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  style={{
                    width: '60px',
                    height: '70px',
                    fontSize: '24px',
                    fontWeight: '700',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: digit ? '2px solid rgba(59, 130, 246, 0.5)' : '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    outline: 'none',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '2px solid rgba(59, 130, 246, 0.8)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = digit ? '2px solid rgba(59, 130, 246, 0.5)' : '2px solid rgba(255, 255, 255, 0.2)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              disabled={loading || otp.join('').length !== 6}
              type="submit"
              style={{
                width: '100%',
                background: (loading || otp.join('').length !== 6)
                  ? 'rgba(59, 130, 246, 0.6)' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
                padding: '18px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '18px',
                fontWeight: '700',
                cursor: (loading || otp.join('').length !== 6) ? 'not-allowed' : 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: (loading || otp.join('').length !== 6)
                  ? 'none' 
                  : '0 8px 32px rgba(59, 130, 246, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                opacity: (loading || otp.join('').length !== 6) ? 0.6 : 1,
                marginBottom: '24px'
              }}
              onMouseEnter={(e) => {
                if (!loading && otp.join('').length === 6) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = '0 16px 40px rgba(59, 130, 246, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && otp.join('').length === 6) {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.4)';
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
                  Verifying...
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Verify Account
                </div>
              )}
            </button>

            {/* Resend OTP */}
            <div style={{
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                Didn't receive the code?
              </p>
              
              <button
                type="button"
                disabled={resendLoading || timeLeft > 540} // Can resend after 1 minute
                onClick={handleResendOTP}
                style={{
                  background: 'none',
                  border: 'none',
                  color: (resendLoading || timeLeft > 540) ? 'rgba(255, 255, 255, 0.4)' : '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: (resendLoading || timeLeft > 540) ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!resendLoading && timeLeft <= 540) {
                    e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                    e.target.style.color = '#60a5fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!resendLoading && timeLeft <= 540) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#3b82f6';
                  }
                }}
              >
                {resendLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid rgba(59, 130, 246, 0.3)',
                      borderTop: '2px solid #3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Sending...
                  </span>
                ) : timeLeft > 540 ? (
                  `Resend in ${Math.ceil((timeLeft - 540) / 60)}m`
                ) : (
                  'Resend Code'
                )}
              </button>
            </div>
          </form>

          {/* Back to Register Link */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.6)';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              ← Back to Register
            </button>
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