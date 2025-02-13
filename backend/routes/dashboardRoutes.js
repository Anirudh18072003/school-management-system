const express = require("express");
const router = express.Router();
const Student = require("../models/student"); // Your Student model (with timestamps)
const Teacher = require("../models/teacher"); // Your Teacher model
const Class = require("../models/class"); // Your Class model
const Attendance = require("../models/attendance"); // Your Attendance model

// 1. Get overall stats: total students, teachers, and classes
router.get("/stats", async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    const classCount = await Class.countDocuments();
    res.json({
      students: studentCount,
      teachers: teacherCount,
      classes: classCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats", error });
  }
});

// 2. Get enrollment trends: group students by the month they were created
router.get("/enrollment-trends", async (req, res) => {
  try {
    const enrollmentTrends = await Student.aggregate([
      { $match: { createdAt: { $exists: true } } },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month (1-12)
          students: { $sum: 1 }, // Count students enrolled in each month
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    console.log("Enrollment Trends:", enrollmentTrends);
    res.json(enrollmentTrends);
  } catch (error) {
    console.error("Error fetching enrollment trends:", error);
    res
      .status(500)
      .json({ message: "Error fetching enrollment trends", error });
  }
});

// 3. Get attendance trends: group attendance records by month using the date field
router.get("/attendance-trends", async (req, res) => {
  try {
    const attendanceTrends = await Attendance.aggregate([
      { $match: { date: { $exists: true } } },
      {
        $group: {
          _id: { $month: "$date" }, // Group by month (1-12)
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0], // Count Present records
            },
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ["$status", "Absent"] }, 1, 0], // Count Absent records
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(attendanceTrends);
  } catch (error) {
    console.error("Error fetching attendance trends:", error);
    res
      .status(500)
      .json({ message: "Error fetching attendance trends", error });
  }
});

module.exports = router;
