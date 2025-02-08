import React, { useState } from "react";

export const LoginPage = () => {
  const [role, setRole] = useState("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ role, userId, password });
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Video Wrapper */}
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

      {/* Main Content Area */}
      <div className="relative flex-1 z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-4 py-8 md:py-12">
        {/* Left Section (Login Form) */}
        <div className="w-full max-w-md md:max-w-xl bg-white/50 p-8 rounded-lg shadow-lg backdrop-blur-md order-1 md:order-1 mt-8 md:mt-0">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Log in
          </h2>
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
              <label className="block text-white">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your User ID"
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

        {/* Right Section (Content) */}
        <div className="w-full max-w-md md:max-w-xl bg-black/20 p-6 md:p-8 rounded-xl backdrop-blur-md order-2 md:order-2 md:mt-0">
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
                  real-time
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
                  analytics
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
                  Fully responsive design works seamlessly on any device
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
                  Military-grade encryption and regular security audits
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
