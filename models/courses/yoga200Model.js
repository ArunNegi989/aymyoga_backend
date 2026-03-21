const mongoose = require("mongoose");

const yoga200Schema = new mongoose.Schema(
  {
    // SEO
    metaTitle: String,
    metaDesc: String,
    metaKeywords: String,
    slug: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    // Hero
    pageMainH1: String,
    heroImgAlt: String,
    heroImage: String,

    // Stats
    stats: [
      {
        icon: String,
        val: String,
        title: String,
        desc: String,
      },
    ],

    // Intro paragraphs
    introPara1: String,
    introPara2: String,
    introPara3: String,
    introPara4: String,

    // Aims
    aimsH3: String,
    aimsKeyObjLabel: String,
    aimsIntro: String,
    aimsOutro: String,
    aimsBullets: [String],

    // Overview
    overview: {
      h2: String,
      certName: String,
      level: String,
      eligibility: String,
      minAge: String,
      credits: String,
      language: String,
    },

    // Fee
    includedFee: [String],
    notIncludedFee: [String],

    // Modules (dynamic)
    modules: [
      {
        title: String,
        intro: String,
        items: [String],
        body: String,
      },
    ],

    // Images
    ashtangaImage: String,
    hathaImage: String,
    requirementsImage: String,

    accommodationImages: [String],
    foodImages: [String],
    luxuryImages: [String],
    scheduleImages: [String],

    // Complex JSON
    scheduleRows: Array,
    instructionLangs: Array,
    indianFees: Array,
    hatha43: Array,
    weekGrid: Array,
    programs: Array,
    reviews: Array,
    faqItems: Array,
    knowQA: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Yoga200", yoga200Schema);