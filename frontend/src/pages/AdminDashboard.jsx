// import React from "react";

// export const AdminDashboard = () => {
// 	const handleLogout = () => {
// 		localStorage.removeItem("token"); // Remove token from storage
// 		localStorage.removeItem("role"); // Remove role from storage
// 		window.location.href = "/"; // Redirect to login page
// 	};

// 	return (
// 		<div className="p-8">
// 			<h1 className="text-3xl font-bold">Admin Dashboard</h1>
// 			<button
// 				onClick={handleLogout}
// 				className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
// 			>
// 				Logout
// 			</button>
// 		</div>
// 	);
// };

// export default AdminDashboard;

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
	const [dashboardStats, setDashboardStats] = useState({
		students: 0,
		teachers: 0,
		classes: 0,
	});

	useEffect(() => {
		fetch("http://localhost:5000/api/stats")
			.then((response) => response.json())
			.then((data) => setDashboardStats(data));

		fetch("http://localhost:5000/api/enrollment-trends")
			.then((response) => response.json())
			.then((data) => setStudentData(data));
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
						{[
							{ name: "Dashboard", icon: "🏠" },
							{ name: "Students", icon: "👨‍🎓" },
							{ name: "Teachers", icon: "👨‍🏫" },
							{ name: "Classes", icon: "🏫" },
							{ name: "Settings", icon: "⚙️" },
						].map((item) => (
							<li
								key={item.name}
								className="p-3 rounded-lg cursor-pointer hover:bg-blue-800 transition flex items-center space-x-3"
							>
								<span className="text-lg">{item.icon}</span>
								<span>{item.name}</span>
							</li>
						))}
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
									{
										[
											dashboardStats.students,
											dashboardStats.teachers,
											dashboardStats.classes,
										][index]
									}
								</p>
							</div>
						)
					)}
				</div>

				{/* Charts Section */}
				<div className="bg-white p-6 rounded-xl shadow-md mb-6">
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

				{/* Recent Activity Section */}
				<div className="bg-white p-6 rounded-xl shadow-md">
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
