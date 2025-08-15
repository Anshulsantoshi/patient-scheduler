import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import { getUser } from "../auth";
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  DocumentTextIcon,
  ArrowPathIcon,
  TrashIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import api from "../api";

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
            backgroundColor: 'rgba(99, 102, 241, 0.1)', 
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

function StatusBadge({ status }) {
  const statusConfig = {
    pending: { color: 'bg-amber-500/20 text-amber-400', icon: ClockIcon },
    confirmed: { color: 'bg-emerald-500/20 text-emerald-400', icon: CheckBadgeIcon },
    completed: { color: 'bg-blue-500/20 text-blue-400', icon: CheckBadgeIcon },
    cancelled: { color: 'bg-red-500/20 text-red-400', icon: XCircleIcon },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      <span>{status}</span>
    </div>
  );
}

function LoadingSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AllAppointments() {
  const user = getUser();
  const location = useLocation();
  const [state, setState] = useState({
    appointments: [],
    loading: true,
    error: null,
    statusUpdates: {},
    isUpdating: false,
    currentPage: 1,
    totalPages: 1,
  });

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: HomeIcon, color: "text-indigo-400" },
    { name: "All Appointments", path: "/admin/all", icon: ClipboardDocumentListIcon, color: "text-emerald-400" },
    { name: "Patient Forms", path: "/admin/intake/forms", icon: DocumentTextIcon, color: "text-purple-400" }
  ];

  const statusOptions = [
    { value: "pending", label: "Pending", icon: ClockIcon, color: "bg-amber-500" },
    { value: "confirmed", label: "Confirmed", icon: CheckBadgeIcon, color: "bg-emerald-500" },
    { value: "completed", label: "Completed", icon: CheckBadgeIcon, color: "bg-blue-500" },
    { value: "cancelled", label: "Cancelled", icon: XCircleIcon, color: "bg-red-500" },
  ];

  const loadAppointments = async (page = 1) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { data } = await api.get(`/appointments/portal?page=${page}`);
      setState(prev => ({
        ...prev,
        appointments: data.appointments,
        loading: false,
        totalPages: data.totalPages || 1,
        currentPage: page,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err?.response?.data?.message || err.message,
      }));
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusUpdate = async (id) => {
    if (!state.statusUpdates[id]) return;
    
    try {
      setState(prev => ({ ...prev, isUpdating: true }));
      await api.put(`/appointments/portal/${id}`, { 
        status: state.statusUpdates[id] 
      });
      await loadAppointments(state.currentPage);
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    } finally {
      setState(prev => ({ ...prev, isUpdating: false }));
    }
  };

  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the appointment.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel"
  });

  if (!result.isConfirmed) return; // if cancelled, stop

  try {
    setState(prev => ({ ...prev, isUpdating: true }));
    await api.delete(`/appointments/portal/${id}`);

    // Success message
    Swal.fire({
      title: "Deleted!",
      text: "The appointment has been removed.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    });

    await loadAppointments(state.currentPage);
  } catch (err) {
    Swal.fire({
      title: "Error!",
      text: err?.response?.data?.message || err.message,
      icon: "error"
    });
  } finally {
    setState(prev => ({ ...prev, isUpdating: false }));
  }
};

  const handleStatusChange = (id, value) => {
    setState(prev => ({
      ...prev,
      statusUpdates: { ...prev.statusUpdates, [id]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl flex flex-col p-6 relative z-10">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
            🏥 Clinic Admin
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Logged in as <span className="font-medium text-white">{user?.name}</span>
          </p>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive 
                    ? "bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg"
                    : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-white" : item.color}`} />
                <span className="text-sm font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-4 border-t border-slate-700/50">
          <div className="text-xs text-slate-500 mb-2">
            v{process.env.REACT_APP_VERSION || '1.0.0'}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 relative z-10 overflow-auto">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-emerald-400" />
                  Appointment Management
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  View and manage all patient appointments
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => loadAppointments(state.currentPage)}
                  disabled={state.loading}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-200 transition-colors"
                >
                  <ArrowPathIcon className={`h-4 w-4 ${state.loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Status Messages */}
            {state.error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-lg">
                <p className="text-red-300 text-sm">{state.error}</p>
              </div>
            )}

            {/* Loading State */}
            {state.loading && !state.error && (
              <LoadingSkeleton count={5} />
            )}

            {/* Empty State */}
            {!state.loading && state.appointments.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                  <ClipboardDocumentListIcon className="h-10 w-10 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">No appointments found</h3>
                <p className="text-slate-500 mt-1">When patients book appointments, they will appear here</p>
              </div>
            )}

            {/* Data Table */}
            {!state.loading && state.appointments.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="p-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Patient</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contact</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Provider</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date/Time</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Reason</th>
                      <th className="p-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {state.appointments.map((appointment) => (
                      <tr 
                        key={appointment._id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-8 w-8 bg-indigo-500/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-400">
                                {appointment.patient?.name?.charAt(0) || "P"}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {appointment.patient?.name || "N/A"}
                              </div>
                              <div className="text-xs text-slate-400">
                                ID: {appointment.patient?.id || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-slate-300">
                          <div>{appointment.patient?.email || "N/A"}</div>
                          <div className="text-xs text-slate-500">
                            {appointment.patient?.phone || "No phone"}
                          </div>
                        </td>
                        <td className="p-3 text-sm text-slate-300">
                          {appointment.doctor?.name || "N/A"}
                          <div className="text-xs text-slate-500">
                            {appointment.doctor?.specialty || "General"}
                          </div>
                        </td>
                        <td className="p-3 text-sm text-slate-300">
                          <div>
                            {appointment.date ? new Date(appointment.date).toLocaleDateString() : "N/A"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {appointment.time || "No time set"}
                          </div>
                        </td>
                        <td className="p-3">
                          <StatusBadge status={appointment.status} />
                        </td>
                        <td className="p-3 text-sm text-slate-300 max-w-xs truncate">
                          {appointment.reason || "Not specified"}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <select
                              value={state.statusUpdates[appointment._id] ?? ""}
                              onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                              className="text-xs bg-slate-700 border border-slate-600 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="">Change status</option>
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleStatusUpdate(appointment._id)}
                              disabled={!state.statusUpdates[appointment._id] || state.isUpdating}
                              className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/30 disabled:cursor-not-allowed text-white px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                            >
                              {state.isUpdating ? "Updating..." : "Update"}
                            </button>
                            <button
                              onClick={() => handleDelete(appointment._id)}
                              disabled={state.isUpdating}
                              className="text-xs bg-red-600/30 hover:bg-red-600/40 text-red-400 hover:text-red-300 p-1 rounded-md transition-colors disabled:opacity-50"
                              title="Delete appointment"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {state.totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => loadAppointments(state.currentPage - 1)}
                  disabled={state.currentPage === 1}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-400">
                  Page {state.currentPage} of {state.totalPages}
                </span>
                <button
                  onClick={() => loadAppointments(state.currentPage + 1)}
                  disabled={state.currentPage === state.totalPages}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}