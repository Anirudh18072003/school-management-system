import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import axios from "axios"; // For API requests

export const LoginPage = () => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const API_URL = `http://localhost:5000/api/${role}s/login`;

    try {
      const response = await axios.post(API_URL, { email, password });

      // Store token & role in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "student") {
        navigate("/student-dashboard");
      } else if (role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Video */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source
            src="https://cdn.pixabay.com/video/2024/06/06/215470_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Heading */}
      <div className="relative z-20 pt-8 md:pt-12 px-4">
        <h1 className="text-white text-3xl md:text-5xl font-semibold text-center">
          School Management System
        </h1>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-4 py-8 md:py-12">
        {/* Login Form */}
        <div className="w-full max-w-md md:max-w-xl bg-white/50 p-8 rounded-lg shadow-lg backdrop-blur-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Log in
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white/80 text-black"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white/80 text-black"
              />
            </div>

            <div>
              <label className="block text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white/80 text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="w-full max-w-md md:max-w-xl bg-black/20 p-6 md:p-8 rounded-xl backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Empowering Modern Education
          </h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="text-2xl mr-4">📚</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Centralized Dashboard
                </h3>
                <p className="opacity-90 text-white">
                  Access academic records, schedules, and announcements in
                  real-time.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-2xl mr-4">🏫</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Smart Management Tools
                </h3>
                <p className="opacity-90 text-white">
                  Automated attendance tracking, grade management, and progress
                  analytics.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-2xl mr-4">📱</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Multi-Platform Access
                </h3>
                <p className="opacity-90 text-white">
                  Fully responsive design works seamlessly on any device.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-2xl mr-4">🔒</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Enterprise-Grade Security
                </h3>
                <p className="opacity-90 text-white">
                  Military-grade encryption and regular security audits.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/20 pt-6">
            <p className="text-sm opacity-80 text-white">
              Trusted by 150+ institutions worldwide • ISO 27001 Certified •
              GDPR Compliant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
