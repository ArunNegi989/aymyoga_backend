const mongoose = require("mongoose");

const Yoga500Schema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    pageMainH1: String,
    heroImgAlt: String,
    heroImage: String,

    shivaImage: String,
    evalImage: String,

    standApartH2: String,
    gainsH2: String,
    seatSectionH2: String,
    seatSectionSubtext: String,

    tableNoteText: String,
    tableNoteEmail: String,
    tableNoteAirportText: String,

    credibilityH2: String,
    durationH2: String,
    syllabusH2: String,
    eligibilityH3: String,
    evaluationH3: String,

    includedTitle: String,
    includedNote: String,
    notIncludedTitle: String,

    fictionH3: String,
    reviewsSectionH2: String,

    refundH3: String,
    refundPara: String,
    applyH3: String,
    applyPara: String,

    indianFeeH3: String,

    // Arrays
    introParas: [String],
    standApartParas: [String],
    gainsParas: [String],
    credibilityParas: [String],
    durationParas: [String],
    syllabusParas: [String],
    eligibilityParas: [String],
    evaluationParas: [String],
    fictionParas: [String],

    includedItems: [String],
    notIncludedItems: [String],
    indianFees: [String],

    syllabusModules: [
      {
        label: String,
        text: String,
      },
    ],

    reviews: [
      {
        name: String,
        platform: String,
        initial: String,
        rating: Number,
        text: String,
      },
    ],

    accomImages: [String],
    foodImages: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Yoga500Content", Yoga500Schema);