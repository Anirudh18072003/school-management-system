import React from "react";

export const StudentDashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from storage
    localStorage.removeItem("role"); // Remove role from storage
    window.location.href = "/"; // Redirect to login page
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;
