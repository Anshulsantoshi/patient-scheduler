import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUser } from "../auth";
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  XMarkIcon
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

function LoadingSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-24 bg-slate-700/50 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
}

export default function AdminIntakeForms() {
  const user = getUser();
  const location = useLocation();
  const [state, setState] = useState({
    forms: [],
    loading: true,
    error: null,
    selectedForm: null,
    searchTerm: "",
  });

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: HomeIcon, color: "text-indigo-400" },
    { name: "All Appointments", path: "/admin/all", icon: ClipboardDocumentListIcon, color: "text-emerald-400" },
    { name: "Patient Forms", path: "/admin/intake/forms", icon: DocumentTextIcon, color: "text-purple-400" }
  ];

  const fetchAllIntakeForms = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { data } = await api.get("/intake/admin/forms");
      if (data.success) {
        setState(prev => ({ ...prev, forms: data.forms }));
      }
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: err?.response?.data?.message || "Failed to fetch intake forms" 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchAllIntakeForms();
  }, []);

  const filteredForms = state.forms.filter(
    (form) =>
      form.patient?.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      form.patient?.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      form.symptoms?.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  const openFormDetails = (form) => setState(prev => ({ ...prev, selectedForm: form }));
  const closeFormDetails = () => setState(prev => ({ ...prev, selectedForm: null }));

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
                  <DocumentTextIcon className="h-6 w-6 text-purple-400" />
                  Patient Intake Forms
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Review all submitted patient intake documents
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={fetchAllIntakeForms}
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
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by patient name, email, or symptoms..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

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
            {!state.loading && filteredForms.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                  <DocumentTextIcon className="h-10 w-10 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">
                  {state.forms.length === 0 ? "No intake forms submitted yet" : "No forms match your search"}
                </h3>
                <p className="text-slate-500 mt-1">
                  {state.forms.length === 0 ? "Forms will appear here once patients submit them." : "Try adjusting your search terms."}
                </p>
              </div>
            )}

            {/* Forms List */}
            {!state.loading && filteredForms.length > 0 && (
              <div className="grid gap-4">
                {filteredForms.map((form) => (
                  <div
                    key={form._id}
                    className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-xl hover:bg-slate-700/40 transition cursor-pointer"
                    onClick={() => openFormDetails(form)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white font-semibold">{form.patient?.name || "Unknown Patient"}</h4>
                        <p className="text-slate-400 text-sm">{form.patient?.email || "No email"}</p>
                      </div>
                      <div className="text-right text-slate-400 text-sm">
                        <p>{new Date(form.createdAt).toLocaleDateString()}</p>
                        <p>{new Date(form.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">Primary Symptoms</p>
                        <p className="text-slate-300">{form.symptoms || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">Insurance Provider</p>
                        <p className="text-slate-300">{form.insurance || "-"}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-600/50">
                      <span className="inline-block bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-medium">
                        Click to view details →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form Details Modal */}
            {state.selectedForm && (
              <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
                onClick={closeFormDetails}
              >
                <div
                  className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700/50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {state.selectedForm.patient?.name || "Unknown Patient"}
                      </h2>
                      <p className="text-slate-400">
                        {state.selectedForm.patient?.email || "No email"}
                      </p>
                    </div>
                    <button
                      onClick={closeFormDetails}
                      className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700/50 transition"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid gap-4">
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <h4 className="text-slate-300 font-semibold mb-2">Personal Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase">Date of Birth</p>
                          <p className="text-slate-200">
                            {state.selectedForm.dob || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase">Phone</p>
                          <p className="text-slate-200">
                            {state.selectedForm.patient?.phone || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase">Address</p>
                          <p className="text-slate-200">
                            {state.selectedForm.address || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase">Insurance</p>
                          <p className="text-slate-200">
                            {state.selectedForm.insurance || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <h4 className="text-slate-300 font-semibold mb-2">Medical Information</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase">Primary Symptoms</p>
                          <p className="text-slate-200">
                            {state.selectedForm.symptoms || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase">Medical History</p>
                          <p className="text-slate-200 whitespace-pre-line">
                            {state.selectedForm.medicalHistory || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase">Medications</p>
                          <p className="text-slate-200 whitespace-pre-line">
                            {state.selectedForm.medications || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase">Allergies</p>
                          <p className="text-slate-200 whitespace-pre-line">
                            {state.selectedForm.allergies || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50 text-sm text-slate-400">
                      <p>
                        Submitted on: {new Date(state.selectedForm.createdAt).toLocaleString()}
                      </p>
                      {state.selectedForm.updatedAt !== state.selectedForm.createdAt && (
                        <p>
                          Last updated: {new Date(state.selectedForm.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
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