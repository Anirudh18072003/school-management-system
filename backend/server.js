require("dotenv").config();
const express = require("express");

const cors = require("cors");
const connectDB = require("./database/db");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

const app = express();

// Database Connection
connectDB();

app.use(express.json()); // Middleware for JSON parsing
app.use(cors()); // Enable CORS
app.use("/api/students", studentRoutes); // Student Authentication + CRUD
app.use("/api/teachers", teacherRoutes); // Teacher Authentication + CRUD

// Sample Route
app.get("/", (req, res) => {
  res.send("School Management System API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
