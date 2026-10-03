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

const YogaBeginnersSectionSchema = new mongoose.Schema(
  {

    heroImage: { type: String, default: "" },
    heroImageAlt: { type: String, default: "Yoga Students Group" },
    mainTitle: { type: String, required: true, trim: true },
    questionText: { type: String, default: "" },
    bodyParagraphs: { type: [String], default: [] },
    infoRow: { type: [InfoRowItemSchema], default: [] },
    secondImage: { type: String, default: "" },
    secondImageAlt: { type: String, default: "" },
    benefitsFullTitle: { type: String, default: "" },
    understandingTitle: { type: String, default: "" },
    understandingIntro: { type: String, default: "" },
    pillars: { type: [PillarSchema], default: [] },

    benefitsLabel: { type: String, default: "" },
    benefits: { type: [BenefitSchema], default: [] },
    qaSectionTitle: { type: String, default: "" },
    qaItems: { type: [QAItemSchema], default: [] },
    moreInfoSectionTitle: { type: String, default: "" },
    infoCards: { type: [InfoCardSchema], default: [] },
    noteText: { type: String, default: "" },
    batchSectionTag: { type: String, default: "" },
    batchSectionTitle: { type: String, default: "" },
    batchSectionSub: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("YogaBeginnersSection", YogaBeginnersSectionSchema);