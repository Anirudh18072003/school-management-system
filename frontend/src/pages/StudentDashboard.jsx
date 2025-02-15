import React, { useEffect, useState } from "react";
import axios from "axios";

export const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [activeTab, setActiveTab] = useState("Profile");
  const [attendanceData, setAttendanceData] = useState(null);
  const [subjectsData, setSubjectsData] = useState(null); // State for subjects

  useEffect(() => {
    if (activeTab === "Profile") {
      axios
        .get("http://localhost:5000/api/students/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setStudentData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
        });
    } else if (activeTab === "Attendance") {
      axios
        .get("http://localhost:5000/api/students/attendance", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setAttendanceData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching attendance data:", error);
        });
    } else if (activeTab === "Subjects") {
      // Fetch subjects assigned to the student when the Subjects tab is active
      axios
        .get("http://localhost:5000/api/students/subjects", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setSubjectsData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching subjects data:", error);
        });
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return studentData ? (
          <div className="p-6">
            {/* Profile Header with Photo and Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={studentData.photo || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{studentData.name}</h2>
                <p className="text-gray-600 mb-1">
                  <strong>Registration Number:</strong>{" "}
                  {studentData.registrationNumber}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Email:</strong> {studentData.email}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Phone:</strong> {studentData.phone || "N/A"}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(studentData.dateOfBirth).toDateString()}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Gender:</strong> {studentData.gender}
                </p>
              </div>
            </div>
            {/* Address Section */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-2">Address</h3>
              {studentData.address ? (
                <p className="text-gray-700">
                  {studentData.address.street}, {studentData.address.city},{" "}
                  {studentData.address.state}, {studentData.address.postalCode},{" "}
                  {studentData.address.country}
                </p>
              ) : (
                <p className="text-gray-700">Address not available</p>
              )}
            </div>
            {/* Guardians Section */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-2">Guardians</h3>
              {studentData.guardians && studentData.guardians.length > 0 ? (
                studentData.guardians.map((guardian, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 border rounded-lg bg-gray-50"
                  >
                    <p className="text-gray-800">
                      <strong>Name:</strong> {guardian.name} (
                      {guardian.relationship})
                    </p>
                    <p className="text-gray-800">
                      <strong>Phone:</strong> {guardian.phone || "N/A"}
                    </p>
                    <p className="text-gray-800">
                      <strong>Email:</strong> {guardian.email || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">No guardians available</p>
              )}
            </div>
            {/* Academics Section */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-2">Academics</h3>
              <p className="text-gray-700">
                <strong>Grade:</strong> {studentData.grade}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong> {studentData.status}
              </p>
              <p className="text-gray-700">
                <strong>Enrollment Date:</strong>{" "}
                {new Date(studentData.enrollmentDate).toDateString()}
              </p>
            </div>
            {/* Extra Curricular Activities */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-2">
                Extra Curricular Activities
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {studentData.extraCurriculars &&
                studentData.extraCurriculars.length > 0 ? (
                  studentData.extraCurriculars.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))
                ) : (
                  <li>No extra curricular activities</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <p className="p-6">Loading profile...</p>
        );
      case "Attendance":
        return attendanceData ? (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Attendance Record</h2>
            <p className="mb-2">
              <strong>Total Days:</strong> {attendanceData.totalDays}
            </p>
            <p className="mb-2">
              <strong>Present Days:</strong> {attendanceData.presentDays}
            </p>
            <p className="mb-2">
              <strong>Absent Days:</strong> {attendanceData.absentDays}
            </p>
            <p className="mb-2">
              <strong>Late Days:</strong> {attendanceData.lateDays}
            </p>
            <p className="mb-2">
              <strong>Excused Days:</strong> {attendanceData.excusedDays}
            </p>
            <p className="mb-4">
              <strong>Attendance Percentage:</strong>{" "}
              {attendanceData.attendancePercentage}
            </p>
            <div>
              <h3 className="text-xl font-semibold mb-2">Attendance History</h3>
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Class</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Remarks</th>
                    <th className="px-4 py-2 border">Marked By</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.records.map((record, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">
                        {record.classId && record.classId.name
                          ? record.classId.name
                          : "-"}
                      </td>
                      <td className="px-4 py-2 border">{record.status}</td>
                      <td className="px-4 py-2 border">
                        {record.remarks || "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        {record.markedBy && record.markedBy.name
                          ? record.markedBy.name
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="p-6">Loading attendance data...</p>
        );
      case "Subjects":
        return subjectsData ? (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Assigned Subjects</h2>
            {subjectsData.length > 0 ? (
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Subject Code</th>
                    <th className="px-4 py-2 border">Subject Name</th>
                    <th className="px-4 py-2 border">Teacher</th>
                    <th className="px-4 py-2 border">Credit Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectsData.map((subject, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">
                        {subject.code || "-"}
                      </td>
                      <td className="px-4 py-2 border">{subject.name}</td>
                      <td className="px-4 py-2 border">
                        {subject.teacher && subject.teacher.name ? subject.teacher.name : "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {subject.creditHours || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No subjects assigned.</p>
            )}
          </div>
        ) : (
          <p className="p-6">Loading subjects data...</p>
        );

      default:
        return <div className="p-6">Select an option</div>;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 fixed h-full">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <ul className="space-y-4">
          {[
            "Profile",
            "Subjects",
            "Attendance",
            "Assignments",
            "Results",
            "Library",
            "Notices",
          ].map((item) => (
            <li
              key={item}
              onClick={() => setActiveTab(item)}
              className={`p-3 rounded-lg cursor-pointer transition ${
                activeTab === item
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-200"
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 ml-64 p-6">
        <header className="bg-blue-700 text-white py-4 px-6 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
        </header>
        <main className="bg-white shadow-md rounded-lg p-6 mt-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
