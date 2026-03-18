const mongoose = require("mongoose");

/* ── Reusable sub-schema for a content block ── */
const blockSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },

    seoTagline: {
      type: String,
      default: "",
      trim: true,
    },

    leadBold: {
      type: String,
      default: "",
      trim: true,
    },

    paragraphs: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { _id: false }
);

/* ── Main schema — ONE document holds BOTH blocks ── */
const ourMissionSchema = new mongoose.Schema(
  {
    missionBlock: {
      type: blockSchema,
      required: true,
    },

    whyBlock: {
      type: blockSchema,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OurMission", ourMissionSchema);