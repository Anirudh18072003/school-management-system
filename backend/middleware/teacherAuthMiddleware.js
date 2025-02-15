// middleware/teacherAuthMiddleware.js
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher");

const verifyTeacher = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Expecting format: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the teacher id is set from the token payload, not from any route parameter.
    req.user = { id: decoded.id }; // decoded.id should be the teacher's ObjectId string
    next();
  } catch (error) {
    console.error("Teacher auth error:", error);
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

module.exports = verifyTeacher;
