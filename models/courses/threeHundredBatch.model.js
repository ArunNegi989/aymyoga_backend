const mongoose = require("mongoose");

const threeHundredBatchSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },

    usdFee: {
      type: String,
      required: true,
      trim: true,
    },
    
    inrFee: {
      type: String,
      default: "",
      trim: true,
    },

    dormPrice: {
      type: Number,
      required: true,
    },
    
    inrDormPrice: {
      type: Number,
      default: 0,
    },
    
    twinPrice: {
      type: Number,
      required: true,
    },
    
    inrTwinPrice: {
      type: Number,
      default: 0,
    },
    
    privatePrice: {
      type: Number,
      required: true,
    },
    
    inrPrivatePrice: {
      type: Number,
      default: 0,
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
      trim: true,
      maxlength: 400,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ThreeHundredBatch",
  threeHundredBatchSchema
);