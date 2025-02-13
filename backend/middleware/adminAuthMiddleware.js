const jwt = require("jsonwebtoken");
const Admin = require("../models/admin"); // Assuming you have an Admin model
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Check if token starts with "Bearer "
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(400).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);

    // Check if user is an admin
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    req.admin = admin; // Attach admin data to request
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = authMiddleware;
