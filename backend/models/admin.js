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

const adminSchema = new mongoose.Schema(
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

    // Authentication
    password: { type: String, required: true },

    // Role & Permissions
    role: { type: String, enum: ["superadmin", "admin"], default: "admin" },
    permissions: [{ type: String, trim: true }], // e.g., ["manage_users", "view_reports"]

    // Additional Details
    profileImage: { type: String, trim: true },
    address: addressSchema,
  },
  { timestamps: true }
);

// Pre-save hook to hash password
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Admin", adminSchema);
