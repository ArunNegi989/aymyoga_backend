const mongoose = require("mongoose");

const BaliPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    /* HERO */
    pageTitleH1: String,
    heroImgAlt: String,
    heroCaption: String,
    heroImage: String,

    /* INTRO */
    introBannerTitle: String,
    introBannerText: String,
    introText: String,
    introParagraphs: [String],

    /* UNIQUE */
    introSuperLabel: String,
    introTitle: String,
    introParaCenter: String,
    uniquePointsSectionTitle: String,
    uniquePointsSuperLabel: String,
    uniquePointsCenterPara: String,
    uniquePoints: Array,
    uniquePointsParagraphs: [String],

    /* DEST */
    destSuperLabel: String,
    destTitle: String,
    destPara1: String,
    destPara2: String,
    destHighlights: [String],

    groupImage: String,
    templeImage: String,
    riceImage: String,

    /* COURSES */
    coursesSuperLabel: String,
    coursesSectionTitle: String,
    coursesCenterPara: String,
    courses: Array,

    /* HIGHLIGHTS */
    highlightsSuperLabel: String,
    highlightsSectionTitle: String,
    highlightsPara1: String,
    highlightsPara2: String,
    highlights: [String],

    practiceImage: String,
    teacherImage: String,

    /* AYM */
    aymSpecialSuperLabel: String,
    aymSpecialSectionTitle: String,
    aymSpecial: Array,
    aymSpecialParagraphs: [String],

    /* CHAKRAS */
    chakras: Array,

    /* FOOTER */
    gardenImage: String,
    ubudImage: String,
    pullQuoteText: String,
    teacherCaptionText: String,

    footerTitle: String,
    footerLoc: String,
    footerMail: String,
    footerTag: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("BaliPage", BaliPageSchema);