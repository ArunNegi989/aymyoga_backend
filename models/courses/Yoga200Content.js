const mongoose = require("mongoose");

const Yoga200CombinedSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    status: { type: String, default: "Active" },

    /* ─── HERO ─── */
    pageMainH1: String,
    heroImgAlt: String,
    heroImage: String,

    /* ─── INTRO — dynamic paragraphs stored individually ─── */
    introPara1:  String,
    introPara2:  String,
    introPara3:  String,
    introPara4:  String,
    introPara5:  String,
    introPara6:  String,
    introPara7:  String,
    introPara8:  String,
    introPara9:  String,
    introPara10: String,
    introParaCount: Number,

    /* ─── COURSE CARD ─── */
    courseCardHeaderLabel:    String,
    courseCardItem1Label:     String,
    courseCardItem1Value:     String,
    courseCardItem2Label:     String,
    courseCardItem2Value:     String,
    courseCardItem3Label:     String,
    courseCardItem3Value:     String,
    courseCardItem4Label:     String,
    courseCardItem4Value:     String,
    courseCardItem4Sub:       String,
    courseCardItem5Label:     String,
    courseCardItem5Value:     String,
    courseCardItem6Label:     String,
    courseCardItem6Value:     String,
    courseCardFeeLabel:       String,
    courseCardFeeFrom:        String,
    courseCardOldPrice:       String,
    courseCardNewPrice:       String,
    courseCardPriceCurrency:  String,
    courseCardBookBtnText:    String,
    courseCardBookBtnUrl:     String,

    /* ─── VIDEO ─── */
    videoUrl:       String,
    videoFile:      String,
    videoBadgeText: String,

    /* ─── STATS ─── */
    stats: [
      {
        icon:  String,
        value: String,
        title: String,
        desc:  String,
      },
    ],

    /* ─── AIMS & OBJECTIVES ─── */
    aimsH3:          String,
    aimsKeyObjLabel: String,
    aimsIntro:       [String],
    aimsBullets:     [String],
    aimsOutro:       String,
    aimsImage:       String,

    /* ─── COURSE OVERVIEW ─── */
    overviewH2:          String,
    overviewSubPara:     String,
    overviewCertLabel:   String,
    overviewCertName:    String,
    overviewLevelLabel:  String,
    overviewLevel:       String,
    overviewEligLabel:   String,
    overviewEligibility: String,
    overviewAgeLabel:    String,
    overviewMinAge:      String,
    overviewCreditsLabel: String,
    overviewCredits:     String,
    overviewLangLabel:   String,
    overviewLanguage:    String,

    /* ─── UPCOMING DATES ─── */
    batchSectionTag:     String,
    upcomingDatesH2:     String,
    upcomingDatesSubtext: String,

    /* ─── FEE INCLUSIONS ─── */
    feeIncludedTitle:    String,
    feeNotIncludedTitle: String,
    includedFee:         [String],
    notIncludedFee:      [String],

    /* ─── SYLLABUS ─── */
    syllabusH3:    String,
    syllabusIntro: [String],

    /* ─── MODULES ─── */
    modules: [
      {
        title: String,
        intro: String,
        items: [String],
        body:  String,
      },
    ],

    /* ─── ASHTANGA VINYASA ─── */
    ashtangaH2:       String,
    ashtangaSubtitle: String,
    ashtangaImgAlt:   String,
    ashtangaDesc:     String,
    ashtangaImage:    String,
    ashtangaPill1:    String,
    ashtangaPill2:    String,
    ashtangaPill3:    String,

    /* ─── PRIMARY SERIES ─── */
    primarySeriesH3:      String,
    primarySeriesSubtext: String,
    primaryIntro:         String,
    foundationItems:      [String],
    weekGrid:             Array,
    primarySeriesImage:   String,

    /* ─── HATHA YOGA ─── */
    hathaH2:       String,
    hathaSubtitle: String,
    hathaImgAlt:   String,
    hathaDesc:     String,
    hathaImage:    String,
    hathaPill1:    String,
    hathaPill2:    String,
    hathaPill3:    String,
    hatha43:       Array,

    /* ─── ASANAS SECTION ─── */
    asanasH2:      String,
    asanasSubtext: String,

    /* ─── PROGRAMS ─── */
    newProgramsH2:      String,
    newProgramsSubtext: String,
    programs: [
      {
        title:    String,
        duration: String,
        start:    String,
        oldPrice: String,
        price:    String,
        desc:     String,
        image:    String,
      },
    ],

    /* ─── EVALUATION & CERTIFICATION ─── */
    evalH2:   String,
    evalDesc: String,

    /* ─── LUXURY FACILITIES ─── */
    luxuryH2:    String,
    luxFeatures: [String],
    luxImages:   [String],

    /* ─── INDIAN FEES ─── */
    indianFeeH2: String,
    indianFees:  Array,

    /* ─── DAILY SCHEDULE ─── */
    scheduleH2:  String,
    schedDesc:   String,
    schedRows:   Array,
    schedImages: [String],

    /* ─── MORE INFORMATION ─── */
    moreInfoH2:        String,
    instrLangs:        Array,
    spanishChineseNote: String,
    visaPassportTitle: String,
    visaPassportDesc:  String,

    /* ─── GLOBAL CERTIFICATION ─── */
    globalCertH2: String,
    globalCert1:  String,
    globalCert2:  String,

    /* ─── REQUIREMENTS FOR ENROLLMENT ─── */
    requirementsH2:    String,
    requirementsImgAlt: String,
    reqImage:          String,
    req1:              String,
    req2:              String,
    req3:              String,
    req4:              String,

    /* ─── WHAT YOU NEED TO KNOW ─── */
    whatYouNeedH2: String,
    knowQA:        Array,

    /* ─── WHY CHOOSE AYM ─── */
    best200HrH4: String,
    best200Hr:   String,

    /* ─── WHAT'S INCLUDED ─── */
    whatsIncludedH4: String,
    whatIncl:        [String],

    /* ─── BOOKING STEPS ─── */
    bookingH2:        String,
    step1Icon:        String,
    step1Title:       String,
    bookingStep1Desc: String,
    step2Icon:        String,
    step2Title:       String,
    bookingStep2Desc: String,
    step3Icon:        String,
    step3Title:       String,
    bookingStep3Desc: String,
    step4Icon:        String,
    step4Title:       String,
    bookingStep4Desc: String,

    /* ─── FAQ ─── */
    faqH2:    String,
    faqItems: Array,

    /* ─── CTA BANNER ─── */
    ctaTitle:       String,
    ctaSubtitle:    String,
    ctaApplyBtnText: String,
    ctaApplyUrl:    String,
    ctaPhone:       String,
    whatsappNumber: String,
    whatsappBtnText: String,

    /* ─── SEO ─── */
    metaTitle:    String,
    metaDesc:     String,
    metaKeywords: String,

    /* ─── ELIGIBILITY / VISA ─── */
    eligibilityInfoTitle: String,
    eligibilityInfoText:  String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Yoga200Combined", Yoga200CombinedSchema);