const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher"); // Import teacher model

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ===============================
// 📌 Register a New Teacher
// ===============================
router.post("/register", async (req, res) => {
  const { name, email, password, subject } = req.body;

  try {
    // Check if teacher already exists
    let teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // Hash password

    // Create new teacher
    teacher = new Teacher({
      name,
      email,
      password: password,
      subject,
    });

    await teacher.save();

    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ===============================
// 📌 Teacher Login
// ===============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find teacher by email
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: teacher._id, role: "teacher" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, teacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ===============================
// 📌 Get All Teachers
// ===============================
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ===============================
// 📌 Get a Single Teacher by ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ===============================
// 📌 Update Teacher by ID
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { name, email, subject } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { name, email, subject },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ===============================
// 📌 Delete Teacher by ID
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
