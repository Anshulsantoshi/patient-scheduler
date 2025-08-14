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
  UserCircleIcon
} from "@heroicons/react/24/outline";

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

export default function PatientDashboard() {
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
                    "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-lg" : 
                    "hover:bg-slate-700/50 text-slate-300 hover:text-white"
                  }
                `}
              >
                {active && (
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                )}
                <Icon className={`h-6 w-6 ${active ? "text-white" : color}`} />
                <span className={`font-medium ${active ? "text-white" : "text-slate-300"}`}>{name}</span>
                {active && (
                  <div className="absolute right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout Section */}
        <div className="mt-auto border-t border-slate-700/50 pt-6">
          {/* User Profile Info */}
          <div className="flex items-center gap-3 p-3 mb-3 bg-slate-800/50 rounded-lg backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 
                       bg-gradient-to-r from-red-600/80 to-rose-600/80 hover:from-red-500/80 hover:to-rose-500/80
                       text-white hover:text-white group shadow-lg hover:shadow-red-500/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
            <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-slate-700/50 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-full animate-pulse"></div>
          
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Manage your appointments, forms, and medical records in one secure place.
          </p>
          
          {/* Quick Actions */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/patient/book" 
                className="bg-gradient-to-r from-blue-600/50 to-indigo-600/50 hover:from-blue-500/50 hover:to-indigo-500/50 
                           p-6 rounded-2xl border border-blue-700/50 backdrop-blur-sm transition-all duration-300
                           hover:shadow-lg hover:shadow-blue-500/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-all">
                    <PlusCircleIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Book New Appointment</p>
                    <p className="text-sm text-slate-400">Schedule with your doctor</p>
                  </div>
                </div>
              </Link>
              
              <Link 
                to="/patient/intake/submit" 
                className="bg-gradient-to-r from-purple-600/50 to-fuchsia-600/50 hover:from-purple-500/50 hover:to-fuchsia-500/50 
                           p-6 rounded-2xl border border-purple-700/50 backdrop-blur-sm transition-all duration-300
                           hover:shadow-lg hover:shadow-purple-500/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-all">
                    <DocumentTextIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Submit Intake Form</p>
                    <p className="text-sm text-slate-400">Complete before your visit</p>
                  </div>
                </div>
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