const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    years: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isGuest: {
      type: Boolean,
      default: false,
    },

    bio: [
      {
        type: String,
        required: true,
      },
    ],

    education: [
      {
        type: String,
        required: true,
      },
    ],

    expertise: [
      {
        type: String,
        required: true,
      },
    ],

    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);