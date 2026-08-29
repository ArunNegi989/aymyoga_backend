const mongoose = require("mongoose");

/* ── Sub-schemas ── */
const StatSchema = new mongoose.Schema(
  {
    num: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const PackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const OverviewItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const PhotoStripItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const ContentBlockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    paragraphs: { type: [String], default: [] },
    priceFrom: { type: String, required: true, trim: true },
    priceNote: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const InfoBlockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    paragraphs: { type: [String], default: [] },
  },
  { _id: false }
);

const RouteSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    badge: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/* ── Main schema (singleton — only one document is expected) ── */
const YogaRetreatSectionSchema = new mongoose.Schema(
  {
    // Hero
    heroImage: { type: String, default: "" },
    heroImageAlt: { type: String, default: "Yoga Students Group" },

    // Page
    pageTitle: { type: String, required: true, trim: true },

    // Section 1 — Intro
    s1Paragraphs: { type: [String], default: [] },
    s1Stats: { type: [StatSchema], default: [] },
    s1Image: { type: String, default: "" },
    s1PanelTags: { type: [String], default: [] },
    s1Caption: { type: String, default: "" },

    // Section 2 — Schedule & pricing
    s2Title: { type: String, default: "" },
    s2Intro: { type: String, default: "" },
    packages: { type: [PackageSchema], default: [] },
    overview: { type: [OverviewItemSchema], default: [] },

    // Apply Now CTA (schedule section)
    applyButtonText: { type: String, default: "" },
    applyButtonLink: { type: String, default: "" },

    // Section 3 — Photo strip + short-stay blocks
    photoStrip: { type: [PhotoStripItemSchema], default: [] },
    s3Blocks: { type: [ContentBlockSchema], default: [] },

    // Section 4 — Long-stay blocks + info blocks + why choose + affordable
    s4Blocks: { type: [ContentBlockSchema], default: [] },
    infoBlocks: { type: [InfoBlockSchema], default: [] },
    whyChooseText: { type: String, default: "" },
    affordableTitle: { type: String, default: "" },
    affordableParagraphs: { type: [String], default: [] },
    affordableCardTitle: { type: String, default: "" },
    affordableCardSub: { type: String, default: "" },
    affordableFeatures: { type: [String], default: [] },

    // Reach
    reachTitle: { type: String, default: "" },
    reachParagraphs: { type: [String], default: [] },
    routes: { type: [RouteSchema], default: [] },

    // Reach CTA buttons
    bookNowText: { type: String, default: "" },
    bookNowLink: { type: String, default: "" },
    paypalText: { type: String, default: "" },
    paypalLink: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("YogaRetreatSection", YogaRetreatSectionSchema);