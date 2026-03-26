const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  name: String,
  from: String,
  initials: String,
  quote: String,
});

const ashtangaSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    // Images
    heroImage: String,
    promoImage: String,
    heroImgAlt: String,

    // Intro
    pageH1Title: String,
    introMainPara: String,

    // Course Details
    courseDetailsTitle: String,
    courseDetailsIntro1: String,
    courseDetailsIntro2: String,
    learnItems: { type: [String], default: [] },

    // Who can apply
    whoCanApplyTitle: String,
    whoCanApplyPara1: String,
    whoCanApplyPara2: String,
    whoItems: { type: [String], default: [] },

    // Promo
    promoSchoolLabel: String,
    promoHeading: String,
    promoLocation: String,
    promoFeeLabel: String,
    promoFeeAmount: String,
    promoBtnLabel: String,
    promoBtnHref: String,

    // Teachers
    certTeachersTitle: String,
    certTeachersPara: String,
    certTeachersPara2: String,
    certTeachersParagraphs: { type: [String], default: [] },

    // Community
    communityTitle: String,
    communityPara: String,
    communityParagraphs: { type: [String], default: [] },

    // Accommodation
    accommodationTitle: String,
    accommodationPara1: String,
    accommodationParagraphs: { type: [String], default: [] },

    // Certification
    certCardTitle: String,
    certCardPara: String,
    certDeepTitle: String,
    certDeepPara: String,

    // Schedule
    schedBookLabel: String,
    schedRegisterText: String,
    schedPayText: String,
    schedDepositAmount: String,
    schedPayBtnLabel: String,
    schedPayBtnHref: String,

    // Testimonials
    testimSectionTitle: String,
    testimIntroText: String,
    testimonials: { type: [testimonialSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AshtangaVinyasaTTC", ashtangaSchema);