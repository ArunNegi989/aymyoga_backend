const mongoose = require("mongoose");

const studentVideoReviewSchema = new mongoose.Schema(
  {
    courseType: { type: String, required: true },

    name: { type: String, required: true },
    country: { type: String },

    thumbnail: { type: String },

    videoUrl: { type: String },
    videoFile: { type: String }, 

    label: { type: String },

    rating: { type: Number, default: 5, min: 1, max: 5 },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "StudentVideoReview",
  studentVideoReviewSchema
);