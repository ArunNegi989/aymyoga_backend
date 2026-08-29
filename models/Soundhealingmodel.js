const mongoose = require("mongoose");

/* ── Sub Schemas ── */
const LevelSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    items: { type: [String], default: [] },
  },
  { _id: false }
);

const BenCardSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
  },
  { _id: false }
);

const ExpectCardSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "" },
    label: { type: String, default: "" },
    text: { type: String, default: "" },
  },
  { _id: false }
);

const WhyCardSchema = new mongoose.Schema(
  {
    n: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
  },
  { _id: false }
);

/* ── Main Schema ── */
const SoundHealingSchema = new mongoose.Schema(
  {
    // Hero
    heroImage: { type: String, default: "" },
    heroImageAlt: { type: String, default: "" },

    // Intro section
    introTitle: { type: String, default: "" },
    introParagraphs: { type: [String], default: [] },
    introSignatureText: { type: String, default: "" },
    introImage: { type: String, default: "" },
    introImageAlt: { type: String, default: "" },
    introImageBadge: { type: String, default: "" },

    // What is Sound Healing section
    whatIsTitle: { type: String, default: "" },
    whatIsIntro: { type: String, default: "" },
    levels: { type: [LevelSchema], default: [] },
    bowl1Image: { type: String, default: "" },
    bowl1Alt: { type: String, default: "" },
    bowl2Image: { type: String, default: "" },
    bowl2Alt: { type: String, default: "" },
    bowl3Image: { type: String, default: "" },
    bowl3Alt: { type: String, default: "" },

    // Aim section
    aimEyebrow: { type: String, default: "" },
    aimTitle: { type: String, default: "" },
    aimParagraphs: { type: [String], default: [] },
    pillsLabel: { type: String, default: "" },
    pills: { type: [String], default: [] },
    aimImage: { type: String, default: "" },
    aimImageAlt: { type: String, default: "" },
    aimImageBadge: { type: String, default: "" },
    aimQuoteText: { type: String, default: "" },
    aimQuoteAttribution: { type: String, default: "" },

    // Benefits section
    benefitsTitle: { type: String, default: "" },
    benefitsIntro: { type: String, default: "" },
    benCards: { type: [BenCardSchema], default: [] },
    benefitsImage: { type: String, default: "" },
    benefitsImageAlt: { type: String, default: "" },

    // Expect section
    expectTitle: { type: String, default: "" },
    expectIntro: { type: String, default: "" },
    expectCards: { type: [ExpectCardSchema], default: [] },
    instrLabel: { type: String, default: "" },
    instruments: { type: [String], default: [] },

    // Why join + cert banner
    whyJoinTitle: { type: String, default: "" },
    whyCards: { type: [WhyCardSchema], default: [] },
    certBannerIcon: { type: String, default: "" },
    certBannerText: { type: String, default: "" },

    // Batch section intro (heading only — seat grid stays API-driven elsewhere)
    batchSectionTag: { type: String, default: "" },
    batchSectionTitle: { type: String, default: "" },
    batchSectionSub: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SoundHealingSection", SoundHealingSchema);