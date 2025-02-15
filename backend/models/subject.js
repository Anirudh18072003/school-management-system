// models/Subject.js

const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    teacher: {
      // Reference to a Teacher document
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    creditHours: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Subject", subjectSchema);
