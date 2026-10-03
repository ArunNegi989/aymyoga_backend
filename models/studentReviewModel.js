const mongoose = require("mongoose");

const studentReviewSchema = new mongoose.Schema(
  {
    courseType: { type: String, required: true },

    name: { type: String, required: true },
    country: { type: String },

    rating: { type: Number, default: 5, min: 1, max: 5 },

    review: { type: String, required: true },

    courseBadge: { type: String },

    date: { type: Date, required: true },

    image: { type: String },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentReview", studentReviewSchema);