// FILE: src/models/courses/onlineSeatsModel.js

const mongoose = require("mongoose");

const onlineSeatsSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    /* ── 200 Hour fees ── */
    usd200: {
      type: String,
      required: true,
    },

    inr200: {
      type: String,
      required: true,
    },

    /* ── 300 Hour fees ── */
    usd300: {
      type: String,
      required: true,
    },

    inr300: {
      type: String,
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
    },
  },
  { timestamps: true }
);

/* Auto-delete document when endDate passes (MongoDB TTL index) */
onlineSeatsSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OnlineSeats", onlineSeatsSchema);