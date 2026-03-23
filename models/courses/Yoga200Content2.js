const mongoose = require("mongoose");

const yoga200Content2Schema = new mongoose.Schema(
  {
    evalH2: String,
    evalDesc: String,

    accommodationH2: String,
    accomImages: [String],

    foodH2: String,
    foodImages: [String],

    luxuryH2: String,
    luxFeatures: [String],
    luxImages: [String],

    indianFeeH2: String,
    indianFees: Array,

    scheduleH2: String,
    schedDesc: String,
    schedRows: Array,
    schedImages: [String],

    moreInfoH2: String,
    instrLangs: Array,
    visaPassportDesc: String,

    programs: Array,
    reviews: Array,

    requirementsH2: String,
    reqImage: String,

    faqItems: Array,

    metaTitle: String,
    metaDesc: String,
    slug: String,
    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Yoga200Content2", yoga200Content2Schema);