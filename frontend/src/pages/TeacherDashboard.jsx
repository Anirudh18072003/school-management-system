// import React from "react";

// const TeacherDashboard = () => {
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     window.location.href = "/";
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
//       <button
//         onClick={handleLogout}
//         className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default TeacherDashboard;




import React, { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import {
	FaChalkboardTeacher,
	FaBook,
	FaUserGraduate,
	FaSignOutAlt,
} from "react-icons/fa";

const TeacherDashboard = () => {
	const [teacherStats, setTeacherStats] = useState({
		students: 0,
		subjects: 0,
		classes: 0,
	});
	const [attendanceData, setAttendanceData] = useState([]);
	const [recentActivities, setRecentActivities] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const statsRes = await fetch("http://localhost:5000/api/teacher-stats");
				const statsData = await statsRes.json();
				setTeacherStats(statsData);

				const attendanceRes = await fetch(
					"http://localhost:5000/api/attendance-trends"
				);
				const attendanceData = await attendanceRes.json();
				setAttendanceData(attendanceData);

				const activitiesRes = await fetch(
					"http://localhost:5000/api/recent-activities"
				);
				const activitiesData = await activitiesRes.json();
				setRecentActivities(activitiesData);
			} catch (error) {
				console.error("Error fetching data:", error);
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
		<div className="min-h-screen flex bg-gray-50">
			{/* Sidebar */}
			<aside className="w-72 bg-gradient-to-b from-green-700 to-green-900 text-white p-6 min-h-screen shadow-lg">
				<h2 className="text-3xl font-bold mb-6 text-center">Teacher Panel</h2>
				<nav>
					<ul className="space-y-4">
						{[
							{ name: "Dashboard", icon: <FaChalkboardTeacher /> },
							{ name: "My Classes", icon: <FaBook /> },
							{ name: "Students", icon: <FaUserGraduate /> },
							{ name: "Logout", icon: <FaSignOutAlt />, action: handleLogout },
						].map((item) => (
							<li
								key={item.name}
								className="p-3 rounded-lg cursor-pointer hover:bg-green-800 transition flex items-center space-x-3"
								onClick={item.action}
							>
								<span className="text-lg">{item.icon}</span>
								<span>{item.name}</span>
							</li>
						))}
					</ul>
				</nav>
			</aside>

			{/* Main Content */}
			<div className="flex-1 p-8">
				{/* Header */}
				<div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-md">
					<h1 className="text-2xl font-bold">Teacher Dashboard</h1>
				</div>

				{/* Dashboard Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					{[
						{
							title: "Total Students",
							value: teacherStats.students,
							color: "text-green-600",
						},
						{
							title: "Subjects",
							value: teacherStats.subjects,
							color: "text-blue-600",
						},
						{
							title: "Classes",
							value: teacherStats.classes,
							color: "text-purple-600",
						},
					].map((stat, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
						>
							<h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
							<p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
						</div>
					))}
				</div>

				{/* Attendance Chart */}
				<div className="bg-white p-6 rounded-xl shadow-md mb-6">
					<h3 className="text-xl font-semibold mb-4">
						Student Attendance Trends
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={attendanceData}>
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Bar dataKey="attendance" fill="#10B981" />
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Recent Activities */}
				<div className="bg-white p-6 rounded-xl shadow-md">
					<h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
					<div className="space-y-4">
						{recentActivities.map((activity, index) => (
							<div
								key={index}
								className="p-4 flex items-center bg-gray-50 border-l-4 border-green-500 rounded-lg shadow-sm"
							>
								<span className="text-green-500 text-2xl mr-4">🔔</span>
								<span>{activity}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TeacherDashboard;

