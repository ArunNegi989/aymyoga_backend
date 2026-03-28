const mongoose = require("mongoose");

const prenatalSeatsSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usdFee: {
      type: String,
      required: true,
    },
    inrFee: {
      type: String,
      required: true,
    },
    dormPrice: {
      type: Number,
      required: true,
    },
    twinPrice: {
      type: Number,
      required: true,
    },
    privatePrice: {
      type: Number,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    bookedSeats: {
      type: Number,
      default: 0, // auto increment later
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrenatalSeats", prenatalSeatsSchema);