const express = require("express");
const Class = require("../models/class"); // Adjust the path if needed

const router = express.Router();

// Create a new class
router.post("/", async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Error creating class", error });
  }
});

// Get all classes
router.get("/", async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Error fetching classes", error });
  }
});

// Get a single class by ID
router.get("/:id", async (req, res) => {
  try {
    const foundClass = await Class.findById(req.params.id);
    if (!foundClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(foundClass);
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ message: "Error fetching class", error });
  }
});

// Update a class by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({ message: "Error updating class", error });
  }
});

// Delete a class by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ message: "Error deleting class", error });
  }
});

module.exports = router;
