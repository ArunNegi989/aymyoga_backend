const mongoose = require("mongoose");

/* =========================
   SUB SCHEMAS
========================= */
const ParagraphSchema = { type: [String], default: [] };

const SylModuleSchema = new mongoose.Schema({
  title: String,
  desc: String,
});

const ScheduleItemSchema = new mongoose.Schema({
  time: String,
  label: String,
});

/* =========================
   MAIN SCHEMA
========================= */
const ContentSchema = new mongoose.Schema(
  {
    bannerImage: String,

    heroTitle: String,
    heroParagraphs: ParagraphSchema,

    transformTitle: String,
    transformParagraphs: ParagraphSchema,

    whatIsTitle: String,
    whatIsParagraphs: ParagraphSchema,

    whyChooseTitle: String,
    whyChooseParagraphs: ParagraphSchema,

    suitableTitle: String,
    suitableItems: [String],

    syllabusTitle: String,
    syllabusParagraphs: ParagraphSchema,
    syllabusLeft: [SylModuleSchema],
    syllabusRight: [SylModuleSchema],

    scheduleImage: String,
    scheduleItems: [ScheduleItemSchema],

    soulShineText: String,
    soulShineImage: String,

    enrollTitle: String,
    enrollParagraphs: ParagraphSchema,
    enrollItems: [String],

    comprehensiveTitle: String,
    comprehensiveParagraphs: ParagraphSchema,

    certTitle: String,
    certParagraphs: ParagraphSchema,

    registrationTitle: String,
    registrationParagraphs: ParagraphSchema,

    includedItems: [String],
    notIncludedItems: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("100hrContent", ContentSchema);