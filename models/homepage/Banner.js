const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    bannerName: {
      type: String,
      default: "",
      trim: true,
    },

    link: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Banner", bannerSchema);