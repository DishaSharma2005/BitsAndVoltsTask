const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 2 },
    lastName: { type: String, required: true, trim: true, minlength: 2 },

    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    mobile: { type: String, required: true, trim: true },

    gender: { type: String, enum: ["M", "F"], required: true },

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    location: { type: String, required: true, trim: true },

    profileImage: { type: String, default: "" }, // store filename or URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
