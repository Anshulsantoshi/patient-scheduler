import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { setAuth } from "../auth";
import { UserPlusIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/users/register", form);
      if (data?.success) {
        setAuth({ token: data.token, user: data.user });
        data.user.role === "admin" ? navigate("/admin") : navigate("/patient");
      } else setError(data?.message || "Registration failed");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">

      {/* Heartbeat Background */}
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 800 200"
      >
        <path
          d="M0,100 C100,100 150,50 200,100 L220,100 L240,40 L260,160 L280,100 L320,100 L340,60 L360,140 L380,100 C430,100 480,150 520,100 L540,100 L560,50 L580,150 L600,100 C650,100 700,50 800,100"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0,2000"
            to="2000,0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      {/* Register Card */}
      <div className="relative bg-white/80 backdrop-blur-md border border-blue-200 shadow-xl rounded-2xl p-8 w-full max-w-md z-10">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 p-3 rounded-full shadow-lg">
            <UserPlusIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-1">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Register to schedule and manage your appointments
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-500 transition"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-500 transition"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-500 transition pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </span>
          </div>

          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition"
          >
            <option value="patient">Patient</option>
            <option value="admin">Admin</option>
          </select>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 shadow-md"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
