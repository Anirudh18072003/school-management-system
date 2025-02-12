// import React from "react";

// export const StudentDashboard = () => {
//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Remove token from storage
//     localStorage.removeItem("role"); // Remove role from storage
//     window.location.href = "/"; // Redirect to login page
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold">Student Dashboard</h1>
//       <button
//         onClick={handleLogout}
//         className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default StudentDashboard;




import React, { useEffect, useState } from "react";
import axios from "axios";

export const StudentDashboard = () => {
	const [studentData, setStudentData] = useState({
		subjects: 0,
		assignments: 0,
		attendance: "0%",
		activities: [],
	});

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/student/dashboard", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			})
			.then((response) => {
				setStudentData(response.data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("role");
		window.location.href = "/";
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			{/* Header */}
			<header className="bg-blue-700 text-white py-4 px-6 flex justify-between items-center shadow-lg">
				<h1 className="text-2xl font-bold">Student Dashboard</h1>
				<button
					onClick={handleLogout}
					className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
				>
					Logout
				</button>
			</header>

			{/* Main Content */}
			<div className="flex flex-1 p-6">
				{/* Sidebar */}
				<aside className="w-64 bg-white shadow-md rounded-lg p-4">
					<h2 className="text-xl font-semibold mb-4">Menu</h2>
					<ul className="space-y-3">
						{[
							"Profile",
							"Courses",
							"Attendance",
							"Assignments",
							"Results",
							"Library",
							"Notices",
						].map((item) => (
							<li
								key={item}
								className="p-3 rounded-lg cursor-pointer hover:bg-blue-200 transition"
							>
								{item}
							</li>
						))}
					</ul>
				</aside>

				{/* Dashboard Content */}
				<main className="flex-1 bg-white shadow-md rounded-lg p-6 ml-4">
					<h2 className="text-xl font-bold mb-4">Welcome, Student!</h2>

					{/* Dashboard Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						{[
							"Total Subjects",
							"Total Assignments",
							"Attendance Percentage",
						].map((title, index) => (
							<div
								key={title}
								className="bg-blue-500 text-white p-6 rounded-xl shadow-lg text-center"
							>
								<h3 className="text-lg font-semibold">{title}</h3>
								<p className="text-2xl font-bold">
									{index === 0
										? studentData.subjects
										: index === 1
										? studentData.assignments
										: studentData.attendance}
								</p>
							</div>
						))}
					</div>

					{/* Recent Activities */}
					<div className="bg-gray-50 p-6 rounded-lg shadow-md">
						<h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
						<ul className="space-y-3">
							{studentData.activities.length > 0 ? (
								studentData.activities.map((activity, index) => (
									<li key={index} className="p-3 bg-white shadow rounded-lg">
										{activity}
									</li>
								))
							) : (
								<li className="p-3 bg-white shadow rounded-lg">
									No recent activities
								</li>
							)}
						</ul>
					</div>
				</main>
			</div>
		</div>
	);
};

export default StudentDashboard;

