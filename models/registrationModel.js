const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    birthDate: String,
    gender: String,
    nationality: String,
    country: String,
    address: String,
    howKnow: String,
    course: String,
    startDate: String,
    endDate: String,
    location: String,
    coupon: String,
    batchId: String,
    courseId: String,
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);