
const mongoose = require("mongoose");

const yoga300Content2Schema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    // Evolution Section - WITH DYNAMIC RIGHT IMAGE
    evolutionH2: String,
    evolutionParas: [String],
    evolutionRightImage: { type: String, default: "" },
    evolutionRightImageAlt: { type: String, default: "" },
    evolutionBadgeText: { type: String, default: "Yoga Alliance" },
    evolutionBadgeSubtext: { type: String, default: "RYT 500 Certified" },

    // Mark Distribution
    markDistH3: String,
    markDistSubText: String,
    markTotalLabel: String,
    markTotalText: String,
    markTheoryLabel: String,
    markTheoryText: String,
    markPracticalLabel: String,
    markPracticalText: String,
    markPracticalDetail: String,

    // Career
    careerH3: String,
    careerItems: [String],

    // Fee Cards
    feeCard1Title: String,
    feeCard1Items: [String],
    feeCard2Title: String,
    feeCard2Items: [String],

    // FAQ
    faqH2: String,
    faqItems: [
      {
        question: String,
        answer: String,
      },
    ],

    // Accommodation / Food
    accomH3: String,
    accomImages: [String],
    foodH3: String,
    foodImages: [String],

    // Luxury
    luxuryH2: String,
    luxuryFeatures: [String],
    luxuryImages: [String],
    yogaGardenImage: String,

    // Features & Schedule
    featuresH2: String,
    featuresList: [String],
    scheduleH3: String,
    scheduleItems: [
      {
        time: String,
        activity: String,
      },
    ],
    scheduleImages: [String],

    // Learning
    learningH2: String,
    learningItems: [String],
    
    // ===== NEW: Learning Outcomes Mosaic Images (3 images) =====
    learningImage1: { type: String, default: "" },
    learningImage1Alt: { type: String, default: "" },
    learningImage1Label: { type: String, default: "" },
    learningImage2: { type: String, default: "" },
    learningImage2Alt: { type: String, default: "" },
    learningImage2Label: { type: String, default: "" },
    learningImage3: { type: String, default: "" },
    learningImage3Alt: { type: String, default: "" },
    learningImage3Label: { type: String, default: "" },

    // Eligibility
    eligibilityH2: String,
    eligibilityTag: String,
    eligibilityParas: [String],
    
    // ===== NEW: Eligibility Section Image =====
    eligibilityImage: { type: String, default: "" },
    eligibilityImageAlt: { type: String, default: "" },

    // Evaluation
    evaluationH2: String,
    evaluationParas: [String],
    
    // ===== NEW: Evaluation Section Images (2 images) =====
    evaluationMainImage: { type: String, default: "" },
    evaluationMainImageAlt: { type: String, default: "" },
    evaluationSmallImage: { type: String, default: "" },
    evaluationSmallImageAlt: { type: String, default: "" },
    evaluationBadgeLine1: { type: String, default: "" },
    evaluationBadgeLine2: { type: String, default: "" },

    // Ethics
    ethicsH2: String,
    ethicsParas: [String],
    ethicsQuote: String,
    ethicsNaturalisticPara: String,
    ethicsRules: [String],
    diplomaImage: String,

    // Misconceptions
    misconH2: String,
    misconParas: [String],
    misconItems: [String],

    // Reviews
    reviewsH2: String,
    reviewsSubtext: String,
    reviews: [
      {
        name: String,
        role: String,
        rating: Number,
        text: String,
      },
    ],

    
    // Yoga Ethics Section - Dynamic Images
    ethicsImage1: { type: String, default: "" },
    ethicsImage1Alt: { type: String, default: "" },
    ethicsImage1Label: { type: String, default: "" },
    ethicsImage2: { type: String, default: "" },
    ethicsImage2Alt: { type: String, default: "" },
    ethicsImage2Label: { type: String, default: "" },
    diplomaBadgeLine1: { type: String, default: "" },
    diplomaBadgeLine2: { type: String, default: "" },

    // YouTube
    youtubeVideos: [
      {
        id: String,
        title: String,
        type: { type: String, enum: ["url", "file"] },
        videoId: String,
        videoFile: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Yoga300Content2", yoga300Content2Schema);