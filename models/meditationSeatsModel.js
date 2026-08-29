const mongoose = require("mongoose");

const meditationSeatsSchema = new mongoose.Schema(
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
      trim: true,
    },
    inrFee: {
      type: String,
      required: true,
      trim: true,
    },
    dormPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    inrDormPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    twinPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    inrTwinPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    privatePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    inrPrivatePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
      default: 20,
    },
    bookedSeats: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 400,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MeditationSeats", meditationSeatsSchema);