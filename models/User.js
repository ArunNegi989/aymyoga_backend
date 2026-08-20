const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    refreshToken: { type: String },
     // ── Forgot Password OTP ──────────────────────────────────
    resetOTP: { type: String },          // hashed OTP stored in DB
    resetOTPExpiry: { type: Date },      // OTP valid for 10 minutes
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
