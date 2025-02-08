const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teacherSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\+?[0-9]{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    dateOfJoining: {
      type: Date,
      required: true,
      default: Date.now,
    },
    subjects: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    department: {
      type: String,
      required: true,
      trim: true,
    },
    qualifications: [
      {
        type: String,
        trim: true,
      },
    ],
    salary: {
      type: Number,
      required: true,
      default: 0,
    },
    address: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      default: "default_photo_url",
    },
    role: {
      type: String,
      default: "Teacher",
      enum: ["Teacher"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
