const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  num: Number,
  label: String,
  title: String,
  content: String,
  subTitle: String,
  listItems: [String],
  twoCol: Boolean,
});

const overviewSchema = new mongoose.Schema({
  label: String,
  value: String,
  multiline: Boolean,
});

const yoga300Content1Schema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    status: { type: String, default: "Active" },

    pageMainH1: String,
    heroImage: String,
    heroImgAlt: String,

    introParagraphs: [String],
    topSectionH2: String,
    topParagraphs: [String],

    overviewH2: String,
    overviewFields: [overviewSchema],

    upcomingDatesH3: String,
    upcomingDatesSubtext: String,

    feeIncludedTitle: String,
    includedFee: [String],

    feeNotIncludedTitle: String,
    notIncludedFee: [String],

    syllabusH2: String,
    syllabusIntro: String,

    modules: [moduleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Yoga300Content1",
  yoga300Content1Schema
);