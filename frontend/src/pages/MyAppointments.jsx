import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUser } from "../auth";
import { CalendarIcon, ClipboardDocumentListIcon, PlusCircleIcon, DocumentTextIcon, HomeIcon } from "@heroicons/react/24/outline";
import api from "../api";

export default function MyAppointments() {
  const user = getUser();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/patient", icon: HomeIcon, color: "text-blue-600" },
    { name: "Book Appointment", path: "/patient/book", icon: CalendarIcon, color: "text-blue-500" },
    { name: "My Appointments", path: "/patient/my", icon: ClipboardDocumentListIcon, color: "text-green-600" },
    { name: "Submit Form", path: "/patient/intake/submit", icon: PlusCircleIcon, color: "text-purple-600" },
    { name: "View My Forms", path: "/patient/intake/forms", icon: DocumentTextIcon, color: "text-gray-600" },
  ];

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-200px] right-0 w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-[-150px] w-[400px] h-[400px] bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Sidebar */}
      <aside className="w-64 bg-white/30 backdrop-blur-xl border-r border-white/50 shadow-2xl flex flex-col p-6 z-10">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-extrabold text-blue-800 tracking-tight">🏥 Patient Portal</h1>
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
        <div className="w-full max-w-4xl p-8 bg-white/30 backdrop-blur-lg border border-white/40 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">📋 My Appointments</h3>

          {loading && <div className="text-center text-gray-700">Loading...</div>}
          {error && <div className="text-center text-red-600 font-semibold">{error}</div>}

          {!loading && !error && appointments.length === 0 && (
            <p className="text-center text-gray-800">You have no appointments yet.</p>
          )}

          {!loading && !error && appointments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Doctor</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Reason</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {appointments.map((a) => (
                    <tr key={a._id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{a.date ? new Date(a.date).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4">{a.time || '-'}</td>
                      <td className="px-6 py-4">{a?.doctor?.name || '-'}</td>
                      <td className="px-6 py-4 capitalize">{a.status}</td>
                      <td className="px-6 py-4">{a.reason || '-'}</td>
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
