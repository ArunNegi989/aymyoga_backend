const mongoose = require("mongoose");

const DetoxRetreatSectionSchema = new mongoose.Schema(
  {
    // Hero Section
    heroImage: {
      type: String,
      default: "",
    },
    heroImageAlt: {
      type: String,
      default: "Yoga Students Group",
    },
    mainTitle: {
      type: String,
      required: true,
      default: "DETOXIFICATION RETREAT THROUGH HERBS, YOGA, AYURVEDA, AND NUTRITION",
    },

    // Section 1 — Intro
    s1Para1: {
      type: String,
      default: "",
    },
    s1HighlightText: {
      type: String,
      default: "",
    },
    s1Para2: {
      type: String,
      default: "",
    },
    s1Image: {
      type: String,
      default: "",
    },
    s1ImageBadge: {
      type: String,
      default: "Ayurveda Detox",
    },
    s1ConclusionQuote: {
      type: String,
      default: "",
    },

    // Section 2 — How to correct (Benefits)
    s2Label: {
      type: String,
      default: "Holistic Healing",
    },
    s2Title: {
      type: String,
      default: "HOW TO CORRECT THIS PROBLEM?",
    },
    s2Body: {
      type: String,
      default: "",
    },
    benefits: [
      {
        icon: { type: String, default: "✨" },
        title: { type: String, required: true },
        desc: { type: String, default: "" },
      },
    ],

    // Section 3 — Method
    s3Label: {
      type: String,
      default: "Our Method",
    },
    s3Title: {
      type: String,
      default: "COMPLETE METHOD TO DETOXIFICATION THROUGH YOGA, AYURVEDA, AND DIET",
    },
    s3Body: {
      type: String,
      default: "",
    },
    steps: [
      {
        title: { type: String, required: true },
        desc: { type: String, default: "" },
      },
    ],
    finalStepTitle: {
      type: String,
      default: "Complete Detox",
    },
    finalStepDesc: {
      type: String,
      default: "",
    },

    // Section 4 — Massage
    s4Label: {
      type: String,
      default: "Experience",
    },
    s4Title: {
      type: String,
      default: "AYURVEDA MASSAGE THERAPY",
    },
    badges: {
      type: [String],
      default: ["Abhyanga", "Shirodhara", "Nasya"],
    },
    massageImage: {
      type: String,
      default: "",
    },
    overlayQuote: {
      type: String,
      default: "Healing begins where toxins end.",
    },

    // Section 5 — Two systems
    s5Label: {
      type: String,
      default: "Our Approach",
    },
    s5Title: {
      type: String,
      default: "WE HAVE TWO SYSTEMS FOR DETOXIFICATION AT AYM DETOX SCHOOL IN RISHIKESH",
    },
    systems: [
      {
        description: { type: String, default: "" },
        providesLabel: { type: String, default: "what to expect:" },
        providesList: { type: [String], default: [] },
      },
    ],

    // Section 6 — Packages
    s6Label: {
      type: String,
      default: "Plans",
    },
    s6Title: {
      type: String,
      default: "PRICE AND PACKAGES",
    },
    packages: {
      type: [String],
      default: ["3 Days", "7 Days", "10 Days", "15 Days"],
    },
    priceNote: {
      type: String,
      default: "Price will let you know after consultation with our Ayurveda Doctor (by Email)",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DetoxRetreatSection", DetoxRetreatSectionSchema);