import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUser } from "../auth";
import { HomeIcon, ClipboardDocumentListIcon, DocumentTextIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import api from "../api";

export default function AllAppointments() {
  const user = getUser();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: HomeIcon, color: "text-blue-600" },
    { name: "All Appointments", path: "/admin/appointments", icon: ClipboardDocumentListIcon, color: "text-green-600" },
    { name: "All Intake Forms", path: "/admin/intake/forms", icon: DocumentTextIcon, color: "text-purple-600" },
    { name: "Submit Form", path: "/admin/intake/submit", icon: PlusCircleIcon, color: "text-gray-600" },
  ];

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMap, setStatusMap] = useState({});

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/appointments/portal");
      setAppointments(data?.appointments || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id) => {
    const status = statusMap[id];
    if (!status) return;
    try {
      await api.put(`/appointments/portal/${id}`, { status });
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await api.delete(`/appointments/portal/${id}`);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 relative overflow-hidden">
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
        <div className="w-full max-w-6xl p-8 bg-white/30 backdrop-blur-lg border border-white/40 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">📋 All Appointments</h3>

          {loading && <div className="text-center text-gray-700">Loading appointments...</div>}
          {error && <div className="text-center text-red-600 font-semibold mb-4">{error}</div>}

          {appointments.length === 0 ? (
            <div className="text-center p-12 bg-white/50 rounded-xl border border-gray-200">
              <h4 className="text-gray-600 mb-2">No appointments found.</h4>
              <p className="text-gray-400">Appointments submitted by patients will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3">Patient</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Doctor</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a._id} className="border-t border-gray-200 hover:bg-white/30 transition">
                      <td className="p-3">{a?.patient?.name || "-"}</td>
                      <td className="p-3">{a?.patient?.email || "-"}</td>
                      <td className="p-3">{a?.doctor?.name || "-"}</td>
                      <td className="p-3">{a.date ? new Date(a.date).toLocaleDateString() : "-"}</td>
                      <td className="p-3">{a.time || "-"}</td>
                      <td className="p-3">{a.status}</td>
                      <td className="p-3">{a.reason || "-"}</td>
                      <td className="p-3 flex flex-col md:flex-row gap-2">
                        <select
                          value={statusMap[a._id] ?? ""}
                          onChange={(e) => setStatusMap((s) => ({ ...s, [a._id]: e.target.value }))}
                          className="p-2 rounded-md border border-gray-300"
                        >
                          <option value="">Set status</option>
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                        <button
                          onClick={() => updateStatus(a._id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => del(a._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
