import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUser } from "../auth";
import { CalendarIcon, ClipboardDocumentListIcon, PlusCircleIcon, DocumentTextIcon, HomeIcon } from "@heroicons/react/24/outline";
import api from "../api";

export default function SubmitIntakeForm() {
  const user = getUser();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/patient", icon: HomeIcon, color: "text-blue-600" },
    { name: "Book Appointment", path: "/patient/book", icon: CalendarIcon, color: "text-blue-500" },
    { name: "My Appointments", path: "/patient/my", icon: ClipboardDocumentListIcon, color: "text-green-600" },
    { name: "Submit Form", path: "/patient/intake/submit", icon: PlusCircleIcon, color: "text-purple-600" },
    { name: "View My Forms", path: "/patient/intake/forms", icon: DocumentTextIcon, color: "text-gray-600" },
  ];

  const [form, setForm] = useState({
    medicalHistory: "",
    insurance: "",
    symptoms: ""
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      const { data } = await api.post("/intake/submit", form);
      if (data.success) {
        setMsg("Form submitted successfully!");
        setForm({ medicalHistory: "", insurance: "", symptoms: "" });
      }
    } catch (error) {
      setErr(error?.response?.data?.message || error.message);
    }
  };

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
      <main className="flex-1 flex items-center justify-center p-10 relative z-10">
        <div className="w-full max-w-md p-8 bg-white/30 backdrop-blur-lg border border-white/40 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">📝 Submit Intake Form</h3>

          {msg && <div className="text-green-600 mb-4 font-semibold text-center">{msg}</div>}
          {err && <div className="text-red-600 mb-4 font-semibold text-center">{err}</div>}

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              name="medicalHistory"
              placeholder="Medical History"
              value={form.medicalHistory}
              onChange={onChange}
              required
              className="p-4 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 backdrop-blur-sm placeholder-gray-600 transition"
            />
            <input
              type="text"
              name="insurance"
              placeholder="Insurance Details (optional)"
              value={form.insurance}
              onChange={onChange}
              className="p-4 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 backdrop-blur-sm placeholder-gray-600 transition"
            />
            <input
              type="text"
              name="symptoms"
              placeholder="Symptoms"
              value={form.symptoms}
              onChange={onChange}
              required
              className="p-4 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 backdrop-blur-sm placeholder-gray-600 transition"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transform transition"
            >
              Submit Form
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
