const mongoose = require("mongoose");

/* ── Sub-schemas ── */
const InfoRowItemSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const PillarSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    subLabel: { type: String, default: "" },
    desc: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const BenefitSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const QAItemSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answers: { type: [String], default: [] },
  },
  { _id: false }
);

const InfoCardSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/* ── Main schema (singleton — only one document is expected) ── */
const YogaBeginnersSectionSchema = new mongoose.Schema(
  {
    // Hero
    heroImage: { type: String, default: "" },
    heroImageAlt: { type: String, default: "Yoga Students Group" },

    // Main heading section
    mainTitle: { type: String, required: true, trim: true },
    questionText: { type: String, default: "" },
    bodyParagraphs: { type: [String], default: [] },
    infoRow: { type: [InfoRowItemSchema], default: [] },

    // Second hero image
    secondImage: { type: String, default: "" },
    secondImageAlt: { type: String, default: "" },

    // Benefits & Understanding section
    benefitsFullTitle: { type: String, default: "" },
    understandingTitle: { type: String, default: "" },
    understandingIntro: { type: String, default: "" },
    pillars: { type: [PillarSchema], default: [] },

    benefitsLabel: { type: String, default: "" },
    benefits: { type: [BenefitSchema], default: [] },

    // Q&A section
    qaSectionTitle: { type: String, default: "" },
    qaItems: { type: [QAItemSchema], default: [] },

    // More information section
    moreInfoSectionTitle: { type: String, default: "" },
    infoCards: { type: [InfoCardSchema], default: [] },
    noteText: { type: String, default: "" },

    // Batch section intro (heading only — NOT the seat grid/booking UI,
    // which lives in a separate seats API/collection)
    batchSectionTag: { type: String, default: "" },
    batchSectionTitle: { type: String, default: "" },
    batchSectionSub: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("YogaBeginnersSection", YogaBeginnersSectionSchema);