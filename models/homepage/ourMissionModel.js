const mongoose = require("mongoose");

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