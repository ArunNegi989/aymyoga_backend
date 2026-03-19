const mongoose = require("mongoose");

const guestTeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },

    bio: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GuestTeacher", guestTeacherSchema);