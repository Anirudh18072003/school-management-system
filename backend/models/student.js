const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const guardianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
  },
  { _id: false }
);

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

const studentSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, trim: true },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
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

    // Contact & Demographics
    address: addressSchema,
    password: { type: String, required: true },

    // Academic Details
    grade: { type: String, required: true, trim: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },

    // Guardians/Parents Information
    guardians: [guardianSchema],

    // Enrollment and Status
    enrollmentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    // Extra Curricular Activities
    extraCurriculars: [{ type: String, trim: true }],
  },
  { timestamps: true } // createdAt & updatedAt are added automatically
);

// Pre-save hook to hash password before saving
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Export the model only once
module.exports = mongoose.model("Student", studentSchema);
