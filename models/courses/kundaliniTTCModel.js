const mongoose = require("mongoose");

const kundaliniSchema = new mongoose.Schema(
  {
    status: { type: String, default: "Active" },

    // Titles
    whatIsTitle: String,
    activateTitle: String,
    benefitsTitle: String,
    benefitsIntro1: String,
    benefitsIntro2: String,
    highlightsTitle: String,
    highlightsIntro: String,

    syllabusBigTitle: String,
    syllabusSchool: String,
    courseOverviewTitle: String,

    readingBoxTitle: String,
    noteBoxTitle: String,
    noteBoxPara: String,

    eligibilityTitle: String,
    locationTitle: String,

    facilitiesTitle: String,
    facilitiesIntro: String,

    scheduleSectionTitle: String,
    whyAYMTitle: String,

    whyRishikeshTitle: String,
    spiritualTitle: String,
    naturalTitle: String,

    typesTitle: String,
    topSchoolsTitle: String,
    topSchoolsPara: String,

    refundTitle: String,

    // Rich Text
    courseOverviewPara: String,
    readingBoxNote: String,
    facilitiesIntroRich: String,
    spiritualPara: String,
    naturalPara: String,

    // Arrays
    whatIsParagraphs: [String],
    activateParagraphs: [String],
    eligibilityParagraphs: [String],
    locationParagraphs: [String],

    syllabusModules: Array,
    benefitItems: [String],
    highlightCards: Array,
    readingItems: [String],
    facilityItems: [String],
    scheduleItems: Array,
    whyCards: Array,
    typesItems: [String],
    refundItems: [String],

    // Images
    heroImage: String,
    classImage: String,
    schedImg1: String,
    schedImg2: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("KundaliniTTC", kundaliniSchema);