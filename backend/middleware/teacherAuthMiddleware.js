const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher"); // Your Teacher model
require("dotenv").config();

const teacherAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Ensure token is in "Bearer <token>" format
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(400).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);

    // Check if user is a teacher by finding the teacher record
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) {
      return res.status(403).json({ message: "Access denied. Not a teacher." });
    }

    // Attach teacher data to request for further use
    req.teacher = teacher;
    next();
  } catch (error) {
    console.error("Teacher Auth Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = teacherAuthMiddleware;
