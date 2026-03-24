const mongoose = require("mongoose");

const fiveHundredBatchSchema = new mongoose.Schema(
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
      default: 50,
    },

    bookedSeats: {
      type: Number,
      default: 0, // auto increase when user registers
    },

    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FiveHundredBatch", fiveHundredBatchSchema);