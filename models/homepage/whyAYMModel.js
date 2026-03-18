const mongoose = require("mongoose");

/* Feature Schema */
const featureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false }
);

/* Main Schema */
const whyAYMSchema = new mongoose.Schema(
  {
    superTitle: { type: String, required: true },
    mainTitle: { type: String, required: true },
    introPara: { type: String, required: true },

    imageSrc: { type: String, required: true },
    imageAlt: { type: String },
    imgBadgeYear: { type: String },
    imgQuote: { type: String },

    sideFeatures: {
      type: [featureSchema],
      validate: [(arr) => arr.length > 0, "At least one side feature required"],
    },

    bottomFeatures: {
      type: [featureSchema],
      validate: [(arr) => arr.length > 0, "At least one bottom feature required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhyAYM", whyAYMSchema);