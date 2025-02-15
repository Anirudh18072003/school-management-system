const express = require("express");
const Teacher = require("../models/teacher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyTeacher = require("../middleware/teacherAuthMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Create a new teacher
router.post("/", async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Error creating teacher", error });
  }
});

// Get all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Error fetching teachers", error });
  }
});

router.get("/classes", verifyTeacher, async (req, res) => {
  try {
    console.log("Teacher ID from token:", req.user.id);
    const teacher = await Teacher.findById(req.user.id).populate(
      "assignedClasses"
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher.assignedClasses);
  } catch (error) {
    console.error("Error fetching teacher classes:", error);
    res
      .status(500)
      .json({ message: "Error fetching teacher", error: error.message });
  }
});

// Get a single teacher by ID
router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ message: "Error fetching teacher", error });
  }
});

// Update a teacher by ID
router.put("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Error updating teacher", error });
  }
});

// Delete a teacher by ID
router.delete("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ message: "Error deleting teacher", error });
  }
});

// Teacher Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: teacher._id, role: "teacher" }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token, teacher });
  } catch (error) {
    console.error("Error during teacher login:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
