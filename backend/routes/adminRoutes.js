const express = require("express");
const Admin = require("../models/admin"); // Assuming you have an Admin model
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const bcrypt = require("bcryptjs");

const router = express.Router();

// Create a new admin
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if student already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "admin already exists" });
    }

    // Create new student with plain text password
    admin = new Admin({
      name,
      email,
      password, // Now passing the plain text password
    });

    await admin.save(); // Pre-save hook will hash the password

    res.status(201).json({ message: "admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Read all admins
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).send(admins);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read a single admin by ID
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).send();
    }
    res.status(200).send(admin);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an admin by ID
router.patch("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"]; // Add other fields as necessary
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).send();
    }

    updates.forEach((update) => (admin[update] = req.body[update]));
    await admin.save();
    res.status(200).send(admin);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an admin by ID
router.delete("/:id", async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).send();
    }
    res.status(200).send(admin);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Admin login

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin || !admin.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin._id, email: admin.email, role: "admin" },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
