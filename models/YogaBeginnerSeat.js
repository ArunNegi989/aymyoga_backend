// FILE: models/YogaBeginnerSeat.js
const mongoose = require("mongoose");

const yogaBeginnerSeatSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, required: [true, "End date is required"] },

    usdFee: { type: String, required: [true, "USD fee is required"], trim: true },
    inrFee: { type: String, required: [true, "INR fee is required"], trim: true },

    dormPrice: { type: Number, required: [true, "USD dorm price is required"], min: 0 },
    inrDormPrice: { type: Number, required: [true, "INR dorm price is required"], min: 0 },

    twinPrice: { type: Number, required: [true, "USD twin price is required"], min: 0 },
    inrTwinPrice: { type: Number, required: [true, "INR twin price is required"], min: 0 },

    privatePrice: { type: Number, required: [true, "USD private price is required"], min: 0 },
    inrPrivatePrice: { type: Number, required: [true, "INR private price is required"], min: 0 },

    totalSeats: { type: Number, required: [true, "Total seats is required"], min: [1, "Total seats must be at least 1"] },
    bookedSeats: { type: Number, default: 0, min: 0 },

    note: { type: String, trim: true, maxlength: 400, default: "" },
  },
  { timestamps: true }
);

// ✅ next() ka use hata diya — direct throw karo, Mongoose khud sync/async dono handle kar lega
yogaBeginnerSeatSchema.pre("validate", function () {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    throw new Error("End date must be after start date");
  }
});

module.exports = mongoose.model("YogaBeginnerSeat", yogaBeginnerSeatSchema);