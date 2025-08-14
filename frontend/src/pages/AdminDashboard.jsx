import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../auth";
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  HomeIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const user = getUser();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: HomeIcon, color: "text-blue-600" },
    { name: "All Appointments", path: "/admin/all", icon: ClipboardDocumentListIcon, color: "text-green-600" },
    { name: "View All Forms", path: "/admin/intake/forms", icon: DocumentTextIcon, color: "text-purple-600" },
    { name: "Manage Users", path: "/admin/users", icon: UsersIcon, color: "text-indigo-600" },
  ];

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white/30 backdrop-blur-xl border-r border-white/50 shadow-2xl flex flex-col p-6">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-extrabold text-blue-800 tracking-tight">🛡️ Admin Portal</h1>
          <p className="text-sm text-gray-700 mt-1">Hello, <span className="font-semibold">{user?.name}</span></p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map(({ name, path, icon: Icon, color }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                  ${active ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" : "hover:bg-white/50"}
                `}
              >
                <Icon className={`h-6 w-6 ${active ? "text-white" : color}`} />
                <span className={`font-medium ${active ? "text-white" : "text-gray-800"}`}>{name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout Section */}
        <div className="mt-auto border-t border-white/20 pt-6">
          {/* Admin Profile Info */}
          <div className="flex items-center gap-3 p-3 mb-3 bg-white/20 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-indigo-600 capitalize font-medium">{user?.role}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 
                       bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 
                       text-red-700 hover:text-red-800 group"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="bg-white/60 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/50">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-700 text-lg">
            Manage all appointments, intake forms, and users from this dashboard.
          </p>
        </div>
      </main>
    </div>
  );
}