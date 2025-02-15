// middleware/studentAuthMiddleware.js
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
require("dotenv").config();

const studentAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from headers: "Bearer <token>"
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Verify token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach student id from token payload to req.user
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = studentAuthMiddleware;
