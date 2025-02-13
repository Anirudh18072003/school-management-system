import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const AdminDashboard = () => {
  const [studentData, setStudentData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch stats
        const statsRes = await fetch("http://localhost:5000/api/stats", {
          headers,
        });
        const statsData = await statsRes.json();
        setDashboardStats(statsData);

        // Fetch student enrollment trends
        const trendsRes = await fetch(
          "http://localhost:5000/api/enrollment-trends",
          { headers }
        );
        const trendsData = await trendsRes.json();
        console.log("Enrollment Trends Data:", trendsData);

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        // Format enrollment data
        const formattedData = monthNames.map((month, index) => {
          const monthNumber = index + 1; // Months are 1-12
          const existing = trendsData.find((t) => t._id === monthNumber);
          return {
            name: month, // Use `name` for the XAxis
            students: existing ? existing.students : 0, // Use `students` for the BarChart
          };
        });

        console.log("Formatted Enrollment Data:", formattedData);
        setStudentData(formattedData);

        // Fetch attendance trends
        const attendanceRes = await fetch(
          "http://localhost:5000/api/attendance-trends",
          { headers }
        );
        const attendanceTrendsData = await attendanceRes.json();
        console.log("Attendance Trends Data:", attendanceTrendsData);

        // Format attendance data
        const formattedAttendanceData = monthNames.map((month, index) => {
          const monthNumber = index + 1; // Months are 1-12
          const existing = attendanceTrendsData.find(
            (t) => t._id === monthNumber
          );
          return {
            name: month, // Use `name` for the XAxis
            present: existing ? existing.present : 0, // Use `present` for the BarChart
            absent: existing ? existing.absent : 0, // Use `absent` for the BarChart
          };
        });

        console.log("Formatted Attendance Data:", formattedAttendanceData);
        setAttendanceData(formattedAttendanceData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6 min-h-screen shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            {["Dashboard", "Students", "Teachers", "Classes", "Settings"].map(
              (title, index) => (
                <li
                  key={title}
                  className="p-3 rounded-lg cursor-pointer hover:bg-blue-800 transition flex items-center space-x-3"
                >
                  <span>{["🏠", "👨‍🎓", "👨‍🏫", "🏫", "⚙️"][index]}</span>
                  <span>{title}</span>
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {["Total Students", "Total Teachers", "Total Classes"].map(
            (title, index) => (
              <div
                key={title}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-4xl font-bold text-blue-700">
                  {Object.values(dashboardStats)[index] || 0}
                </p>
              </div>
            )
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Student Enrollment Trends */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Student Enrollment Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Trends */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Monthly Attendance Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#34D399" name="Present" />
                <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              "New student enrolled - John Doe",
              "Class 10A schedule updated",
              "Teacher Jane Smith added a new assignment",
            ].map((activity, index) => (
              <div
                key={index}
                className="p-4 flex items-center bg-gray-50 border-l-4 border-blue-500 rounded-lg shadow-sm"
              >
                <span className="text-blue-500 text-2xl mr-4">🔔</span>
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
