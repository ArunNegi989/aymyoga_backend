const mongoose = require("mongoose");

const yoga200Content2Schema = new mongoose.Schema(
  {
    /* ── 21. Evaluation ── */
    evalH2:   String,
    evalDesc: String,

    /* ── 22. Accommodation ── */
    accommodationH2: String,
    accomImages:     [String],

    /* ── 23. Food ── */
    foodH2:     String,
    foodImages: [String],

    /* ── 24. Luxury ── */
    luxuryH2:    String,
    luxFeatures: [String],
    luxImages:   [String],

    /* ── 25. Indian Fees ── */
    indianFeeH2: String,
    indianFees:  Array,

    /* ── 26. Schedule ── */
    scheduleH2:  String,
    schedDesc:   String,
    schedRows:   Array,
    schedImages: [String],

    /* ── 27. More Information ── */
    moreInfoH2:           String,
    instrLangs:           Array,
    spanishChineseNote:   String,
    eligibilityInfoTitle: String,
    eligibilityInfoText:  String,
    visaPassportTitle:    String,
    visaPassportDesc:     String,

    /* ── 28. CTA Banner ── */
    ctaTitle:        String,
    ctaSubtitle:     String,
    ctaPhone:        String,
    ctaApplyBtnText: String,

    /* ── 29. New Programs ── */
    newProgramsH2:      String,
    newProgramsSubtext: String,
    programs:           Array,

    /* ── 30. Globally Certified ── */
    globalCertH2: String,
    globalCert1:  String,
    globalCert2:  String,

    /* ── 31. Requirements ── */
    requirementsH2:      String,
    reqImage:            String,
    requirementsImgAlt:  String,
    req1: String,
    req2: String,
    req3: String,
    req4: String,

    /* ── 32. What You Need to Know ── */
    whatYouNeedH2: String,
    knowQA:        Array,

    /* ── 33. Best 200hr ── */
    best200HrH4: String,
    best200Hr:   String,

    /* ── 34. What's Included in Fee ── */
    whatsIncludedH4: String,
    inclFee:         [String],
    notInclFee:      [String],
    whatIncl:        [String],

    /* ── 35. Reviews ── */
    reviewsH2:      String,
    reviewsSubtext: String,
    reviews:        Array,

    /* ── 36. Video Testimonials ── */
    videosH2:    String,
    video1Label: String,
    video1Url:   String,
    video1Thumb: String,
    video2Label: String,
    video2Url:   String,
    video2Thumb: String,
    video3Label: String,
    video3Url:   String,
    video3Thumb: String,

    /* ── 37. Booking Steps ── */
    bookingH2:         String,
    step1Icon:         String,
    step1Title:        String,
    bookingStep1Desc:  String,
    step2Icon:         String,
    step2Title:        String,
    bookingStep2Desc:  String,
    step3Icon:         String,
    step3Title:        String,
    bookingStep3Desc:  String,
    step4Icon:         String,
    step4Title:        String,
    bookingStep4Desc:  String,

    /* ── 38. FAQ ── */
    faqH2:    String,
    faqItems: Array,

    /* ── 39. SEO & Meta ── */
    metaTitle:    String,
    metaDesc:     String,
    slug:         String,
    metaKeywords: String,
    status: {
      type:    String,
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Yoga200Content2", yoga200Content2Schema);