const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendance");
const Class = require("../models/class");
const Student = require("../models/student"); // for fetching students
// Assumed middleware for teacher auth
const verifyTeacher = require("../middleware/teacherAuthMiddleware");

/**
 * GET /api/attendance/students/:classId
 * - Fetch all students for a given class.
 */
router.get("/students/:classId", verifyTeacher, async (req, res) => {
  try {
    const { classId } = req.params;
    if (!classId) {
      return res.status(400).json({ message: "Class ID is required" });
    }
    // Fetch students for this class.
    const students = await Student.find({ classId });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students by class:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/attendance/mark
 * - Mark attendance for all students in a given class.
 * - Request body format:
 *   {
 *     "classId": "<classId>",
 *     "attendanceRecords": [
 *       { "studentId": "<studentId>", "status": "Present", "remarks": "On time" },
 *       { "studentId": "<studentId>", "status": "Absent" }
 *     ]
 *   }
 */
router.post("/mark", verifyTeacher, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { classId, attendanceRecords } = req.body;
    if (!classId || !attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    // Verify that the teacher is assigned to the class
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    if (classData.teacher.toString() !== teacherId) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this class" });
    }

    // Prepare attendance records according to your schema.
    // Note: Allowed status values are "Present", "Absent", "Late", and "Excused".
    const recordsToInsert = attendanceRecords.map((record) => ({
      studentId: record.studentId,
      classId: classId,
      status: record.status,
      remarks: record.remarks || "",
      date: new Date(), // current date/time
      markedBy: teacherId,
    }));

    await Attendance.insertMany(recordsToInsert);
    res.json({ message: "Attendance submitted successfully" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
