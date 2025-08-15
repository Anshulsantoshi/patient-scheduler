import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../auth";
import {
  CalendarIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  CheckCircleIcon
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

export default function BookAppointment() {
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

  const [form, setForm] = useState({ date: "", time: "", doctorId: "", reason: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

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
    setMsg("");
    setErr("");
    setLoading(true);
    
    try {
      const { data } = await api.post("/appointments/portal", form);
      if (data?.success) {
        setMsg("Appointment created successfully");
        setForm({ date: "", time: "", doctorId: "", reason: "" });
      }
    } catch (error) {
      setErr(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/');
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
      <main className="flex-1 flex items-center justify-center p-10 relative z-10">
        <div className="w-full max-w-lg bg-slate-800/50 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-slate-700/50 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Book Appointment
              </h1>
              <p className="text-slate-300">Schedule your next visit with us</p>
            </div>

            {msg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{msg}</span>
              </div>
            )}

            {err && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl mb-6">
                <span className="font-medium">Error: </span>{err}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={onChange}
                  required
                  className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 
                             text-white placeholder-slate-400 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Preferred Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={onChange}
                  required
                  className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 
                             text-white placeholder-slate-400 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Doctor ID <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="doctorId"
                  placeholder="Enter doctor ID if you have a preference"
                  value={form.doctorId}
                  onChange={onChange}
                  className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 
                             text-white placeholder-slate-400 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  placeholder="Briefly describe your reason for the appointment"
                  value={form.reason}
                  onChange={onChange}
                  rows="3"
                  className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 
                             text-white placeholder-slate-400 transition-all duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 
                           ${loading 
                             ? 'bg-slate-600 cursor-not-allowed' 
                             : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25'
                           }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Appointment...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Create Appointment
                  </div>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/patient/my" 
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View My Appointments →
              </Link>
            </div>
          </div>
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