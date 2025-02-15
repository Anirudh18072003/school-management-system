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
  FaCheckSquare,
} from "react-icons/fa";

const TeacherDashboard = () => {
  // Dashboard states
  const [teacherStats, setTeacherStats] = useState({
    students: 0,
    subjects: 0,
    classes: 0,
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Active tab state
  const [activeTab, setActiveTab] = useState("Dashboard");

  // States for Mark Attendance section
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  // Fetch dashboard data when Dashboard tab is active
  useEffect(() => {
    if (activeTab === "Dashboard") {
      const fetchData = async () => {
        try {
          const statsRes = await fetch(
            "http://localhost:5000/api/teacher-stats"
          );
          const statsData = await statsRes.json();
          setTeacherStats(statsData);

          const attendanceRes = await fetch(
            "http://localhost:5000/api/attendance-trends"
          );
          const attData = await attendanceRes.json();
          setAttendanceData(attData);

          const activitiesRes = await fetch(
            "http://localhost:5000/api/recent-activities"
          );
          const activitiesData = await activitiesRes.json();
          setRecentActivities(activitiesData);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };
      fetchData();
    }
  }, [activeTab]);

  // Fetch teacher's classes when Mark Attendance tab is active
useEffect(() => {
  if (activeTab === "Mark Attendance") {
    const fetchClasses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/teachers/classes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        console.log("Fetched teacher classes:", data); // Check what is returned
        setTeacherClasses(data);
      } catch (error) {
        console.error("Error fetching teacher classes:", error);
      }
    };
    fetchClasses();
  }
}, [activeTab]);


  // When a class is selected, fetch its students
  useEffect(() => {
    if (selectedClass) {
      const fetchStudents = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/attendance/students/${selectedClass._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await res.json();
          setClassStudents(data);
          // Initialize each student's status to "Present"
          const initialStatus = {};
          data.forEach((student) => {
            initialStatus[student._id] = "Present";
          });
          setAttendanceStatus(initialStatus);
        } catch (error) {
          console.error("Error fetching students for class:", error);
        }
      };
      fetchStudents();
    }
  }, [selectedClass]);

  // Handle dropdown change for each student
  const handleAttendanceChange = (studentId, status) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Submit attendance for the selected class
  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    if (!selectedClass) {
      alert("Please select a class.");
      return;
    }
    const records = Object.entries(attendanceStatus).map(
      ([studentId, status]) => ({
        studentId,
        status,
      })
    );
    try {
      const res = await fetch("http://localhost:5000/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          classId: selectedClass._id,
          attendanceRecords: records,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Attendance submitted successfully!");
        // Reset selection to allow marking for another class
        setSelectedClass(null);
        setClassStudents([]);
        setAttendanceStatus({});
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Error submitting attendance.");
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  // Sidebar menu items
  const menuItems = [
    { name: "Dashboard", icon: <FaChalkboardTeacher /> },
    { name: "My Classes", icon: <FaBook /> },
    { name: "Students", icon: <FaUserGraduate /> },
    { name: "Mark Attendance", icon: <FaCheckSquare /> },
    { name: "Logout", icon: <FaSignOutAlt />, action: handleLogout },
  ];

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === "Dashboard") {
      return (
        <div>
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
                <p className={`text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
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
      );
    } else if (activeTab === "Mark Attendance") {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
          {/* If no class is selected, display the list of assigned classes */}
          {!selectedClass ? (
            <div>
              <h3 className="text-xl mb-4">Select a Class</h3>
              {teacherClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teacherClasses.map((cls) => (
                    <div
                      key={cls._id}
                      onClick={() => setSelectedClass(cls)}
                      className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                    >
                      <h4 className="text-lg font-semibold">{cls.name}</h4>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No classes assigned to you.</p>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-xl mb-4">
                {selectedClass.name} - Students List
              </h3>
              {classStudents.length > 0 ? (
                <form onSubmit={handleSubmitAttendance}>
                  <table className="min-w-full border">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border">Student Name</th>
                        <th className="px-4 py-2 border">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStudents.map((student) => (
                        <tr key={student._id}>
                          <td className="px-4 py-2 border">{student.name}</td>
                          <td className="px-4 py-2 border">
                            <select
                              value={attendanceStatus[student._id] || "Present"}
                              onChange={(e) =>
                                handleAttendanceChange(
                                  student._id,
                                  e.target.value
                                )
                              }
                              className="p-2 border rounded-lg"
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="submit"
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Submit Attendance
                  </button>
                </form>
              ) : (
                <p>No students found for this class.</p>
              )}
              <button
                onClick={() => {
                  // Reset selection to go back to the list of classes
                  setSelectedClass(null);
                  setClassStudents([]);
                  setAttendanceStatus({});
                }}
                className="mt-4 text-blue-600 underline"
              >
                Back to Classes
              </button>
            </div>
          )}
        </div>
      );
    } else if (activeTab === "My Classes") {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">My Classes</h2>
          <p>My Classes functionality coming soon...</p>
        </div>
      );
    } else if (activeTab === "Students") {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Students</h2>
          <p>Students functionality coming soon...</p>
        </div>
      );
    } else {
      return <div className="p-6">Select an option</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-green-700 to-green-900 text-white p-6 min-h-screen shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Teacher Panel</h2>
        <nav>
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li
                key={item.name}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveTab(item.name);
                  }
                }}
                className={`p-3 rounded-lg cursor-pointer transition flex items-center space-x-3 ${
                  activeTab === item.name
                    ? "bg-green-800"
                    : "hover:bg-green-800"
                }`}
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
        <main className="bg-white p-6 rounded-lg shadow-md">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
