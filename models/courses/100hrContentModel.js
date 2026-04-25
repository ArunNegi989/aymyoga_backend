const mongoose = require("mongoose");

/* =========================
   SUB SCHEMAS
========================= */
const SylModuleSchema = new mongoose.Schema({
  title: String,
  desc:  String,
});

const ScheduleItemSchema = new mongoose.Schema({
  time:  String,
  label: String,
});

const WhyChooseCardSchema = new mongoose.Schema({
  icon:  { type: String, default: "star" },
  label: { type: String, default: "" },
  desc:  { type: String, default: "" },
});

/* =========================
   MAIN SCHEMA
========================= */
const ContentSchema = new mongoose.Schema(
  {
    /* ── BANNER ── */
    bannerImage: { type: String, default: "" },

    /* ── HERO ── */
    heroTitle:      { type: String, default: "" },
    heroParagraphs: { type: [String], default: [] },

    /* ══════════════════════════════════════
       VIDEOS — Each section stores ONE field.
       Value is either:
         • YouTube/Instagram URL  → stored as-is
         • Uploaded MP4 path      → "/uploads/filename.mp4"
    ══════════════════════════════════════ */

    /* Main page video (shared: What Is, Schedule, Video Reviews) */
    videoUrl:  { type: String, default: "" },  // URL link
    videoFile: { type: String, default: "" },  // Uploaded path

    /* Syllabus section video */
    syllabusVideo: { type: String, default: "" },

    /* Schedule section video */
    scheduleVideo: { type: String, default: "" },

    /* Comprehensive section video */
    comprehensiveVideo: { type: String, default: "" },

    /* ── TRANSFORM ── */
    transformTitle:      { type: String, default: "" },
    transformParagraphs: { type: [String], default: [] },
    transformImage:      { type: String, default: "" },

    /* ── WHAT IS (uses main videoUrl/videoFile) ── */
    whatIsTitle:      { type: String, default: "" },
    whatIsParagraphs: { type: [String], default: [] },

    /* ── WHY CHOOSE ── */
    whyChooseTitle:      { type: String, default: "" },
    whyChooseParagraphs: { type: [String], default: [] },
    whyChooseCards: {
      type: [WhyChooseCardSchema],
      default: [],
    },

    /* ── SUITABLE FOR ── */
    suitableTitle:  { type: String, default: "" },
    suitableItems:  { type: [String], default: [] },
    suitableImage1: { type: String, default: "" },
    suitableImage2: { type: String, default: "" },
    suitableImage3: { type: String, default: "" },

    /* ── SYLLABUS ── */
    syllabusTitle:      { type: String, default: "" },
    syllabusParagraphs: { type: [String], default: [] },
    syllabusLeft:       { type: [SylModuleSchema], default: [] },
    syllabusRight:      { type: [SylModuleSchema], default: [] },
    syllabusImage1:     { type: String, default: "" },
    syllabusImage2:     { type: String, default: "" },
    // syllabusVideo defined above

    /* ── SCHEDULE ── */
    scheduleImage: { type: String, default: "" },
    scheduleItems: { type: [ScheduleItemSchema], default: [] },
    // scheduleVideo defined above

    /* ── SOUL SHINE BANNER ── */
    soulShineText:  { type: String, default: "Let Your Soul Shine" },
    soulShineImage: { type: String, default: "" },

    /* ── ENROL ── */
    enrollTitle:      { type: String, default: "" },
    enrollParagraphs: { type: [String], default: [] },
    enrollItems:      { type: [String], default: [] },
    enrollImage:      { type: String, default: "" },

    /* ── COMPREHENSIVE ── */
    comprehensiveTitle:      { type: String, default: "" },
    comprehensiveParagraphs: { type: [String], default: [] },
    // comprehensiveVideo defined above

    /* ── CERTIFICATION ── */
    certTitle:      { type: String, default: "" },
    certParagraphs: { type: [String], default: [] },
    certImage:      { type: String, default: "" },

    /* ── REGISTRATION ── */
    registrationTitle:      { type: String, default: "" },
    registrationParagraphs: { type: [String], default: [] },
    registrationImage:      { type: String, default: "" },

    /* ── FEE LISTS ── */
    includedItems:    { type: [String], default: [] },
    notIncludedItems: { type: [String], default: [] },

    /* ── COURSE INFO CARD ── */
    courseDuration:       { type: String,  default: "13 Days" },
    courseLevel:          { type: String,  default: "Beginner" },
    courseCertification:  { type: String,  default: "100 Hour" },
    courseYogaStyle:      { type: String,  default: "Multistyle" },
    courseYogaStyleSub:   { type: String,  default: "Ashtanga, Vinyasa & Hatha" },
    courseLanguage:       { type: String,  default: "English & Hindi" },
    courseDateInfo:       { type: String,  default: "1st to 13th of every month" },
    courseStartingFeeUSD: { type: Number,  default: 0 },
    courseOriginalFeeUSD: { type: Number,  default: 0 },
    bookNowLink:          { type: String,  default: "#dates-fees" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("100hrContent", ContentSchema);