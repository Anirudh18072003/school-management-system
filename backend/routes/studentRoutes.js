const express = require("express");
const Student = require("../models/student"); // Adjust path if needed
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const studentAuthMiddleware = require("../middleware/studentAuthMiddleware");
const Attendance = require("../models/attendance");

/**
 * Create a new student
 * POST /api/students
 */
router.post("/", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Error creating student", error });
  }
});

/**
 * Get all students
 * GET /api/students
 */
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students", error });
  }
});

// routes/student.js

router.get("/profile", studentAuthMiddleware, async (req, res) => {
  try {
    // req.user.id is automatically populated by the middleware
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Error fetching student", error });
  }
});

// routes/studentRoutes.js (or wherever you fetch student subjects)
router.get("/subjects", studentAuthMiddleware, async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await Student.findById(studentId).populate({
      path: "subjects",
      select: "code name teacher creditHours",
      populate: {
        path: "teacher",
        select: "name",
      },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student.subjects);
  } catch (error) {
    console.error("Error fetching student subjects:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /api/students/attendance – Get attendance records for the authenticated student
router.get("/attendance", studentAuthMiddleware, async (req, res) => {
  try {
    // Populate markedBy and classId fields
    const records = await Attendance.find({ studentId: req.user.id })
      .populate("markedBy", "name")
      .populate("classId", "name");

    // Calculate summary statistics as needed
    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === "Present").length;
    const absentDays = records.filter((r) => r.status === "Absent").length;
    const lateDays = records.filter((r) => r.status === "Late").length;
    const excusedDays = records.filter((r) => r.status === "Excused").length;
    const attendancePercentage =
      totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) + "%" : "0%";

    res.json({
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      excusedDays,
      attendancePercentage,
      records,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res
      .status(500)
      .json({ message: "Error fetching attendance", error: error.message });
  }
});

/**
 * Get a single student by ID
 * GET /api/students/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Error fetching student", error });
  }
});

/**
 * Update a student by ID
 * PUT /api/students/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Error updating student", error });
  }
});

/**
 * Delete a student by ID
 * DELETE /api/students/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Error deleting student", error });
  }
});

/**
 * Search students by query parameters
 * GET /api/students/search?registrationNumber=...&grade=...&name=...
 */
router.get("/search", async (req, res) => {
  try {
    const { registrationNumber, grade, name } = req.query;
    let filter = {};

    if (registrationNumber) {
      filter.registrationNumber = { $regex: registrationNumber, $options: "i" };
    }
    if (grade) {
      filter.grade = grade;
    }
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const students = await Student.find(filter);
    res.json(students);
  } catch (error) {
    console.error("Error searching students:", error);
    res.status(500).json({ message: "Error searching students", error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: student._id, role: "teacher" }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token, student });
  } catch (error) {
    console.error("Error during teacher login:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
