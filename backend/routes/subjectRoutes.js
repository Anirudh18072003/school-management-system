const express = require("express");
const router = express.Router();
const Subject = require("../models/subject");

// CREATE a new subject
router.post("/", async (req, res) => {
  try {
    const { code, name, teacher, description, creditHours } = req.body;
    const newSubject = new Subject({
      code,
      name,
      teacher,
      description,
      creditHours,
    });
    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// READ all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// READ a single subject by id
router.get("/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE a subject by id
router.put("/:id", async (req, res) => {
  try {
    const { code, name, teacher, description, creditHours } = req.body;
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { code, name, teacher, description, creditHours },
      { new: true } // Return the updated document
    );
    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(updatedSubject);
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a subject by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
