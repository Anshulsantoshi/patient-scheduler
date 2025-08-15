import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../auth";
import {
  CalendarIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import api from "../api";

// Floating Particles Background Component
function ParticlesBackground() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      {[...Array(30)].map((_, i) => (
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

export default function MyAppointments() {
  const user = getUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navItems = [
    { name: "Dashboard", path: "/patient", icon: HomeIcon, color: "text-blue-400" },
    { name: "Book Appointment", path: "/patient/book", icon: CalendarIcon, color: "text-indigo-400" },
    { name: "My Appointments", path: "/patient/my", icon: ClipboardDocumentListIcon, color: "text-emerald-400" },
    { name: "Submit Form", path: "/patient/intake/submit", icon: PlusCircleIcon, color: "text-purple-400" },
    { name: "View My Forms", path: "/patient/intake/forms", icon: DocumentTextIcon, color: "text-gray-400" },
  ];

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/appointments/my-appointments");
        setAppointments(data?.appointments || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'text-emerald-400 bg-emerald-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Dynamic cursor gradient */}
      <div
        className="fixed w-[300px] h-[300px] rounded-full pointer-events-none transition-all duration-100 z-0"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
        }}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl flex flex-col p-6 relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            🏥 Patient Portal
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Hello, <span className="font-semibold text-white">{user?.name}</span>
          </p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map(({ name, path, icon: Icon, color }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 relative overflow-hidden
                  ${active ? 
                    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20" : 
                    "hover:bg-slate-700/50 text-slate-300 hover:text-white"
                  }
                `}
              >
                <Icon className={`h-6 w-6 relative z-10 ${active ? "text-white" : color}`} />
                <span className={`font-medium relative z-10 ${active ? "text-white" : "text-slate-300"}`}>{name}</span>
                {active && (
                  <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse z-10"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout Section */}
        <div className="mt-auto border-t border-slate-700/50 pt-6">
          <div className="flex items-center gap-3 p-3 mb-3 bg-slate-800/50 rounded-lg backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 
                       bg-gradient-to-r from-red-600/80 to-rose-600/80 hover:from-red-500/80 hover:to-rose-500/80
                       text-white hover:text-white group shadow-lg hover:shadow-red-500/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
            <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
            <span className="font-medium relative z-10">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-slate-700/50 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full animate-pulse"></div>
          
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            📋 My Appointments
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mb-8">
            View and manage all your scheduled appointments.
          </p>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-slate-300">Loading appointments...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl mb-6">
              <span className="font-medium">Error: </span>{error}
            </div>
          )}

          {!loading && !error && appointments.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-400 text-lg">No appointments scheduled yet.</p>
              <Link 
                to="/patient/book" 
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                           hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all duration-300"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Book Your First Appointment
              </Link>
            </div>
          )}

          {!loading && !error && appointments.length > 0 && (
            <div className="relative z-10">
              <div className="grid gap-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 
                               hover:bg-slate-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <CalendarIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {appointment?.doctor?.name || 'Doctor TBD'}
                            </h3>
                            <p className="text-sm text-slate-400">
                              {appointment.date ? new Date(appointment.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'Date TBD'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Time:</span>
                            <p className="text-white font-medium">{appointment.time || 'TBD'}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Reason:</span>
                            <p className="text-white font-medium">{appointment.reason || 'General consultation'}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Status:</span>
                            <div className="mt-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                                {appointment.status || 'pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 flex gap-4">
                <Link 
                  to="/patient/book"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 
                             hover:from-blue-500/80 hover:to-indigo-500/80 text-white font-medium rounded-xl 
                             transition-all duration-300 backdrop-blur-sm"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Book New Appointment
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}