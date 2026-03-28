const mongoose = require("mongoose");

/* =========================
   SUB SCHEMAS
========================= */
const heroGridImageSchema = new mongoose.Schema({
  url: String,
  alt: String,
});

const scheduleSchema = new mongoose.Schema({
  time: String,
  activity: String,
});

const curriculumSchema = new mongoose.Schema({
  title: String,
  hours: String,
});

const hoursSummarySchema = new mongoose.Schema({
  label: String,
  value: String,
});

/* =========================
   MAIN SCHEMA
========================= */
const prenatalPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    /* HERO */
    pageTitleH1: String,
    heroImage: String,
    heroImgAlt: String,

    /* INTRO */
    introSectionTitle: String,
    introPara1: String,
    introPara2: String,
    introPara3: String,
    introExtraParagraphs: [String],

    /* HERO GRID */
    heroGridImages: [heroGridImageSchema],

    /* FEATURES */
    featuresSectionTitle: String,
    featuresSuperLabel: String,
    featuresPara1: String,
    featuresPara2: String,
    featuresExtraParagraphs: [String],

    /* LOCATION */
    locationSubTitle: String,
    locationPara: String,
    locationImage: String,
    schedule: [scheduleSchema],

    /* BATCH */
    batchSectionTitle: String,
    joinBtnText: String,
    joinBtnUrl: String,

    /* COST */
    costsSectionTitle: String,
    costsPara: String,
    costsExtraParagraphs: [String],

    /* ONLINE */
    onlineSectionTitle: String,
    onlinePara: String,
    onlineExtraParagraphs: [String],

    curriculum: [curriculumSchema],
    hoursSummary: [hoursSummarySchema],

    /* SEO */
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrenatalPage", prenatalPageSchema);