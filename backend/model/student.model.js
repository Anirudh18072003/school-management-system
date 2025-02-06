const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  date_of_birth: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  grade: { type: String, required: true },
  section: { type: String, required: true },
  parent_name: { type: String, required: true },
  parent_contact: { type: String, required: true },
  address: { type: String, required: true },
  enrollment_date: { type: Date, required: true },
  subjects: { type: [String], default: [] },
  attendance: [
    {
      date: { type: Date, required: true },
      status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true,
      },
    },
  ],
  grades: [
    {
      subject: { type: String, required: true },
      marks: { type: Number, required: true },
      max_marks: { type: Number, required: true },
      grade: { type: String, required: true },
    },
  ],
  role: { type: String, default: "Student", enum: ["Student"] },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
