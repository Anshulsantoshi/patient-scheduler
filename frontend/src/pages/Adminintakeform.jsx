import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUser } from "../auth";
import { HomeIcon, DocumentTextIcon, ClipboardDocumentListIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import api from "../api";

export default function AdminIntakeForms() {
  const user = getUser();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: HomeIcon, color: "text-blue-600" },
    { name: "All Appointments", path: "/admin/appointments", icon: ClipboardDocumentListIcon, color: "text-green-600" },
    { name: "All Intake Forms", path: "/admin/intake/forms", icon: DocumentTextIcon, color: "text-purple-600" },
    { name: "Submit Form", path: "/admin/intake/submit", icon: PlusCircleIcon, color: "text-gray-600" },
  ];

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllIntakeForms();
  }, []);

  const fetchAllIntakeForms = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/intake/admin/forms");
      if (data.success) setForms(data.forms);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch intake forms");
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = forms.filter(
    (form) =>
      form.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.symptoms?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openFormDetails = (form) => setSelectedForm(form);
  const closeFormDetails = () => setSelectedForm(null);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-200px] right-0 w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-[-150px] w-[400px] h-[400px] bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Sidebar */}
      <aside className="w-64 bg-white/30 backdrop-blur-xl border-r border-white/50 shadow-2xl flex flex-col p-6 z-10">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-extrabold text-blue-800 tracking-tight">🩺 Admin Portal</h1>
          <p className="text-sm text-gray-700 mt-1">Hello, <span className="font-semibold">{user?.name}</span></p>
        </div>
        <nav className="flex flex-col gap-2">
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-10 relative z-10">
        <div className="w-full max-w-5xl p-8 bg-white/30 backdrop-blur-lg border border-white/40 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">📄 All Patient Intake Forms</h3>

          {loading && <div className="text-center text-gray-700">Loading intake forms...</div>}
          {error && <div className="text-center text-red-600 font-semibold mb-4">{error}</div>}

          {/* Search */}
          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Search by patient name, email, or symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {filteredForms.length === 0 ? (
            <div className="text-center p-12 bg-white/50 rounded-xl border border-gray-200">
              <h4 className="text-gray-600 mb-2">
                {forms.length === 0 ? "No intake forms submitted yet" : "No forms match your search"}
              </h4>
              <p className="text-gray-400">
                {forms.length === 0 ? "Forms will appear here once patients submit them." : "Try adjusting your search terms."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredForms.map((form) => (
                <div
                  key={form._id}
                  className="p-4 bg-white/50 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => openFormDetails(form)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-gray-800 font-semibold">{form.patient?.name || "Unknown Patient"}</h4>
                      <p className="text-gray-500 text-sm">{form.patient?.email || "No email"}</p>
                    </div>
                    <div className="text-right text-gray-500 text-sm">
                      <p>{new Date(form.createdAt).toLocaleDateString()}</p>
                      <p>{new Date(form.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase">Primary Symptoms</p>
                      <p className="text-gray-500">{form.symptoms || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase">Insurance Provider</p>
                      <p className="text-gray-500">{form.insurance || "-"}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      Click to view details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {selectedForm && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={closeFormDetails}
            >
              <div
                className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedForm.patient?.name || "Unknown Patient"}</h2>
                    <p className="text-gray-500">{selectedForm.patient?.email || "No email"}</p>
                  </div>
                  <button
                    onClick={closeFormDetails}
                    className="text-gray-500 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="grid gap-4">
                  <div>
                    <h4 className="text-gray-700 font-semibold">Medical History</h4>
                    <p className="bg-gray-50 p-3 rounded-md text-gray-600">{selectedForm.medicalHistory || "-"}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-700 font-semibold">Symptoms</h4>
                    <p className="bg-gray-50 p-3 rounded-md text-gray-600">{selectedForm.symptoms || "-"}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-700 font-semibold">Insurance</h4>
                    <p className="bg-gray-50 p-3 rounded-md text-gray-600">{selectedForm.insurance || "-"}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-400 text-sm">
                      Submitted on: {new Date(selectedForm.createdAt).toLocaleString()}
                    </p>
                    {selectedForm.updatedAt !== selectedForm.createdAt && (
                      <p className="text-gray-400 text-sm">
                        Last updated: {new Date(selectedForm.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
