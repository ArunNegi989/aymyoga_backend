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
    whatIsImage: String,
    whatIsImageAlt: { type: String, default: "Kundalini Yoga meditation practice" },
    activateImage: String,
    activateImageAlt: { type: String, default: "Kundalini Yoga practice" },
    curriculumImage: String,
    curriculumImageAlt: { type: String, default: "Kundalini Yoga teacher training class" },
    sylHeaderBgImage: String,
    sylHeaderBgImageAlt: { type: String, default: "Kundalini Yoga syllabus header background" },
    sylBadges: [String],
    courseOverviewBadgeText: { type: String, default: "Learn · Practice · Teach" },

    // NEW - Eligibility Section Images
    eligibilityImage: String,
    eligibilityImageAlt: { type: String, default: "Yoga students practicing" },
    eligibilityBadgeTitle: { type: String, default: "Open to All" },
    eligibilityBadgeSub: { type: String, default: "No prerequisites required" },
    eligibilityChip1Num: { type: String, default: "0" },
    eligibilityChip1Label: { type: String, default: "Age Limit" },
    eligibilityChip2Num: { type: String, default: "All" },
    eligibilityChip2Label: { type: String, default: "Backgrounds" },
    eligibilityPills: Array,

    // NEW - Location Section Images
    locationBannerImage: String,
    locationBannerImageAlt: { type: String, default: "Rishikesh mountains" },
    locationStackTopImage: String,
    locationStackTopImageAlt: { type: String, default: "Yoga class" },
    locationStackTopLabel: { type: String, default: "Practice Hall" },
    locationStackBottomImage: String,
    locationStackBottomImageAlt: { type: String, default: "Ashram view" },
    locationStackBottomLabel: { type: String, default: "Himalayan Setting" },
    locationStats: Array,

    // NEW - Facilities Section Images
    facilitiesVideoUrl: { type: String, default: "" },
    facilitiesVideoPoster: String,
    facilitiesVideoTag: { type: String, default: "LIVE · BREATHE · GROW" },
    facilitiesVideoText: { type: String, default: "Everything you need for a transformative 24-day residential experience" },
    facilityIconCards: Array,

    // Course Info Card Fields
    courseInfoCardTitle: { type: String, default: "COURSE DETAILS" },
    courseInfoFeeLabel: { type: String, default: "COURSE FEE" },
    courseInfoFeeFromText: { type: String, default: "starting from" },
    courseInfoBookBtnText: { type: String, default: "BOOK NOW" },
    courseInfoUsdPrice: { type: Number, default: 999 },
    courseInfoInrPrice: { type: Number, default: 82000 },
    courseInfoOriginalUsdPrice: { type: Number, default: 1799 },
    courseInfoOriginalInrPrice: { type: Number, default: 148000 },
    courseInfoDetails: { type: Array, default: [
      { label: "DURATION", value: "24 Days", sub: "" },
      { label: "LEVEL", value: "Beginner to Advanced", sub: "" },
      { label: "CERTIFICATION", value: "200 Hour", sub: "" },
      { label: "YOGA STYLE", value: "Kundalini Yoga", sub: "As taught by Yogi Bhajan" },
      { label: "LANGUAGE", value: "English & Hindi", sub: "" },
      { label: "DATE", value: "Check batches below", sub: "" },
    ] },
  
    scheduleTagLine: { type: String, default: "24-DAY RESIDENTIAL PROGRAM" },
    scheduleHeaderSub: { type: String, default: "A carefully structured day balancing intense practice with rest, study &amp; spiritual integration." },
    schedulePhaseLabels: { type: Array, default: [
      { label: "🌅 Morning Practice", color: "#e8720c" },
      { label: "☀️ Midday Session", color: "#c8890a" },
      { label: "🌙 Evening Practice", color: "#7a3a9a" }
    ] },
    scheduleNoteIcon: { type: String, default: "📌" },
    scheduleNoteText: { type: String, default: "Schedule may vary slightly by week. Self-study & personal practice time is built into each day." },
    
    // Schedule Stats
    scheduleStats: { type: Array, default: [
      { icon: "⏰", num: "14+", label: "Hrs Practice" },
      { icon: "🧘", num: "3", label: "Sessions Daily" },
      { icon: "🌿", num: "3", label: "Meals Daily" },
      { icon: "📖", num: "4+", label: "Theory Hrs" }
    ] },
    
    // Schedule Quote
    scheduleQuoteText: { type: String, default: "Sadhana is the foundation. When you practice every day with discipline and devotion, transformation becomes inevitable." },
    scheduleQuoteAuthor: { type: String, default: "— Yogi Bhajan" },
    
    // Schedule Image Tags
    scheduleImg1Tag: { type: String, default: "Morning Practice" },
    scheduleImg2Tag: { type: String, default: "Evening Sadhana" },

    // Section 9 - Why Rishikesh Banner
    whyRishikeshBannerImage: String,
    whyRishikeshBannerImageAlt: { type: String, default: "Rishikesh Himalayan landscape" },
    whyRishikeshBannerTag: { type: String, default: "Sacred City · Yoga Capital of the World" },
    whyRishikeshBannerStats: { type: Array, default: [
      { num: "5000+", label: "Years of yoga heritage" },
      { num: "200+", label: "Ashrams & schools" },
      { num: "3", label: "Sacred rivers" },
      { num: "∞", label: "Himalayan serenity" }
    ] },
    
    // Section 9 - Spiritual & Natural Pillars
    spiritualIcon: { type: String, default: "🕉️" },
    naturalIcon: { type: String, default: "🌿" },
    
    // Section 9 - Types Section Icon
    typesIcon: { type: String, default: "📋" },
    topSchoolsIcon: { type: String, default: "🏆" },
    
    // Section 9 - AYM Pill Text
    aymPillText: { type: String, default: "AYM Yoga School — Ranked among Rishikesh's finest" },
    
    // Section 9 - Refund Section
    refundTagLine: { type: String, default: "TRANSPARENCY & TRUST" },
    refundHeaderSub: { type: String, default: "We believe in clear, fair policies. Here's everything you need to know about our cancellation terms." },
    refundIcons: { type: Array, default: ["💰", "❌", "📧", "⚠️"] },
    refundColors: { type: Array, default: [
      { color: "#3d6000", bg: "rgba(61,96,0,0.07)", border: "rgba(61,96,0,0.2)" },
      { color: "#8a2c00", bg: "rgba(138,44,0,0.07)", border: "rgba(138,44,0,0.2)" },
      { color: "#1a6fa8", bg: "rgba(26,111,168,0.07)", border: "rgba(26,111,168,0.2)" },
      { color: "#c8890a", bg: "rgba(200,137,10,0.07)", border: "rgba(200,137,10,0.2)" }
    ] },
    

    kundaliniIntroHeading: { type: String, default: "The Science of Kundalini Yoga" },
    kundaliniIntroParagraph: { type: String, default: "<p>Kundalini Yoga is the ancient science of awakening the dormant energy within every human being. It combines breath, movement, meditation, and mantra to help you connect with your highest self and unlock your full potential.</p>" },
    // Section 9 - Refund Trust Strip
    refundTrustItems: { type: Array, default: [
      { icon: "📩", text: "All cancellations must be made via email" },
      { icon: "🔒", text: "Your deposit secures your seat" },
      { icon: "🔄", text: "Flexible rebooking to future batches" }
    ] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KundaliniTTC", kundaliniSchema);