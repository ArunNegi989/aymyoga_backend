// FILE: models/MeditationSection.js
const mongoose = require("mongoose");

const textItemSchema = new mongoose.Schema({ text: String }, { _id: false });

const methodCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true },
    imageAlt: { type: String, default: "" },
    image: { type: String, default: "" }, // stored path
  },
  { _id: false }
);

const whyCardSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const highlightCardSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const meditationSectionSchema = new mongoose.Schema(
  {
    // Hero
    heroImage: { type: String, default: "" },
    heroImageAlt: { type: String, required: true },
    heroTitle: { type: String, required: true },

    // What is Meditation
    whatIsTitle: { type: String, required: true },
    whatIsParagraphs: { type: [String], default: [] },
    videoUrl: { type: String, required: true },

    // Meditation methods
    methodsSectionTitle: { type: String, required: true },
    methodCards: { type: [methodCardSchema], default: [] },
    methodsClosingText: { type: String, default: "" },

    // Elevate section
    elevateTitle: { type: String, required: true },
    elevateParagraph: { type: String, required: true },
    elevateImage: { type: String, default: "" },
    elevateImageAlt: { type: String, default: "" },

    // Why choose
    whyChooseTitle: { type: String, required: true },
    whyCards: { type: [whyCardSchema], default: [] },

    // Schedule + highlights
    scheduleTitle: { type: String, required: true },
    highlightsLabel: { type: String, required: true },
    highlightCards: { type: [highlightCardSchema], default: [] },

    // Batch section intro
    batchSectionTag: { type: String, default: "" },
    batchSectionTitle: { type: String, default: "" },
    batchSectionSub: { type: String, default: "" },
    batchSectionDuration: { type: String, default: "" },

    // CTA section
    ctaBadgeText: { type: String, default: "" },
    ctaTitle: { type: String, required: true },
    ctaPara1: { type: String, default: "" },
    ctaSubTitle: { type: String, default: "" },
    ctaPara2: { type: String, default: "" },
    ctaEnrollLink: { type: String, default: "/yoga-registration" },
    ctaLearnMoreLink: { type: String, default: "/contact" },
    ctaImage: { type: String, default: "" },
    ctaImageAlt: { type: String, default: "" },
    ctaImageOverlayText: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MeditationSection", meditationSectionSchema);