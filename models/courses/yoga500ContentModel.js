const mongoose = require("mongoose");

// New schema for intro items (each with para and image)
const IntroItemSchema = new mongoose.Schema({
  paragraph: { type: String, required: true },
  image: { type: String, default: "" },
  imageAlt: { type: String, default: "" },
});

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

    // NEW: Enhanced intro section with alternating image-text layout
    introItems: [IntroItemSchema],

    // Keep old introParas for backward compatibility (will be converted)
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
    // In yoga500ContentModel.js, update the introItems schema:
introItems: [
  {
    paragraph: String,
    media: String,      // Changed from 'image' to 'media'
    mediaAlt: String,   // Changed from 'imageAlt' to 'mediaAlt'
    mediaType: { type: String, default: "image" }, // New field for image/video
  }
],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Yoga500Content", Yoga500Schema);