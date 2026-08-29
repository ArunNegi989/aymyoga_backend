const mongoose = require("mongoose");

/* ── Sub Schemas ── */
const StatSchema = new mongoose.Schema(
  {
    value: { type: String, default: "" },
    label: { type: String, default: "" },
  },
  { _id: false }
);

const InsightCardSchema = new mongoose.Schema(
  {
    number: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
  },
  { _id: false }
);

const ScheduleItemSchema = new mongoose.Schema(
  {
    time: { type: String, default: "" },
    activity: { type: String, default: "" },
  },
  { _id: false }
);

const GalleryImageSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    caption: { type: String, default: "" },
    subcaption: { type: String, default: "" },
  },
  { _id: false }
);

const TermSchema = new mongoose.Schema(
  {
    term: { type: String, default: "" },
    desc: { type: String, default: "" },
  },
  { _id: false }
);

/* ── Main Schema ── */
const InnerAwakeningSchema = new mongoose.Schema(
  {
    // Hero Banner
    heroImage: { type: String, default: "" },
    heroImageAlt: { type: String, default: "" },

    // Guru / Hero Title Section
    heroBadge: { type: String, default: "" },
    mainTitle: { type: String, default: "" },
    subTitle: { type: String, default: "" },
    whoTitle: { type: String, default: "" },
    maharishiIntro: { type: String, default: "" },
    maharishiImage: { type: String, default: "" },
    maharishiImageAlt: { type: String, default: "" },
    imageCaption: { type: String, default: "" },
    heroStats: { type: [StatSchema], default: [] },

    // What Is The Retreat Section
    whatBadge: { type: String, default: "" },
    whatTitle: { type: String, default: "" },
    quoteText: { type: String, default: "" },
    bodyText: { type: String, default: "" },
    insightCards: { type: [InsightCardSchema], default: [] },
    programNote: { type: String, default: "" },

    // Schedule Section
    scheduleBadge: { type: String, default: "" },
    scheduleTitle: { type: String, default: "" },
    weeksBadge: { type: String, default: "" },
    weeksText: { type: String, default: "" },
    card1Title: { type: String, default: "" },
    points: { type: [String], default: [] },
    cardFootnote: { type: String, default: "" },
    card2Title: { type: String, default: "" },
    morningLabel: { type: String, default: "" },
    morningItems: { type: [ScheduleItemSchema], default: [] },
    breakText: { type: String, default: "" },
    eveningLabel: { type: String, default: "" },
    eveningItems: { type: [ScheduleItemSchema], default: [] },

    // Gallery Section
    galleryBadge: { type: String, default: "" },
    galleryTitle: { type: String, default: "" },
    gallerySubtitle: { type: String, default: "" },
    galleryImages: { type: [GalleryImageSchema], default: [] },

    // Key Concepts + Who Can Participate
    definitionTitle: { type: String, default: "" },
    terms: { type: [TermSchema], default: [] },
    participantTitle: { type: String, default: "" },
    participantList: { type: [String], default: [] },

    // Fee Section
    feeBadge: { type: String, default: "" },
    feeTitle: { type: String, default: "" },
    includedItems: { type: [String], default: [] },
    pricingBadge: { type: String, default: "" },
    priceUSD: { type: String, default: "" },
    priceINR: { type: String, default: "" },
    pricingDesc: { type: String, default: "" },
    pricingNote: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InnerAwakeningSection", InnerAwakeningSchema);