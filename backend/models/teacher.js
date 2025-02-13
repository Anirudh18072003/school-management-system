const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  { _id: false }
);

const teacherSchema = new mongoose.Schema(
  {
    // Basic Information
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, trim: true },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },

    // Contact Details
    address: addressSchema,

    // Authentication
    password: { type: String, required: true },

    // Academic & Professional Details
    subjects: [{ type: String, trim: true }], // subjects taught
    department: { type: String, trim: true },
    designation: { type: String, trim: true },
    experience: { type: Number, default: 0 }, // years of experience
    qualifications: [{ type: String, trim: true }], // degrees, certifications, etc.

    // Certifications (optional details)
    certifications: [
      {
        title: { type: String, trim: true },
        issuer: { type: String, trim: true },
        dateIssued: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook to hash password
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Teacher", teacherSchema);
