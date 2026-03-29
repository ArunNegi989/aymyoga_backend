const mongoose = require("mongoose");

const hathaYogaBatchSchema = new mongoose.Schema(
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
      default: 0,
    },

    note: {
      type: String,
      default: "",
      maxlength: 400,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HathaYogaBatch", hathaYogaBatchSchema);