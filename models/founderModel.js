const mongoose = require("mongoose");

const founderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    sectionLabel: {
      type: String,
      default: "Founder & Director",
    },
    estYear: {
      type: String,
      default: "Est. 2005",
    },
    ctaText: {
      type: String,
    },
    bio: [
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

module.exports = mongoose.model("Founder", founderSchema);