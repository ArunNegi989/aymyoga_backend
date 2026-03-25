const mongoose = require("mongoose");

const AyurvedaCourseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    pageTitleH1: String,
    heroImgAlt: String,
    heroImage: String,

    introSuperLabel: String,
    introTitle: String,
    introText1: String,
    introText2: String,
    introList: String,
    introRightImage: String,
    introParagraphs: [String],

    spaWelcomeText: String,
    spaBoxText: String,

    doshasSuperLabel: String,
    doshasTitle: String,
    doshasDescription: String,
    doshas: Array,

    coursesSuperLabel: String,
    coursesSectionTitle: String,
    ayurvedaCourses: Array,
    panchaKarmaCourses: Array,

    ayurvedaCoursesInIndiaTitle: String,
    panchakarmaHeading: String,
    pkPara1: String,
    pkPara2: String,
    pkPara3: String,
    pkParagraphs: [String],
    therapies: Array,

    spicesStripTitle: String,
    spicesStripImage: String,

    ayurvedaMassageCoursesHeading: String,
    massagePara1: String,
    massagePara2: String,
    massageParagraphs: [String],
    massageTypes: Array,

    yogaMassageTrainingHeading: String,
    yogaMassageDuration: String,
    yogaMassageCost: String,
    yogaMassageDates: String,
    trainingDesc: String,
    trainingParagraphs: [String],

    registrationAdvanceFee: String,
    registrationPaymentLink: String,
    registrationBoxText: String,

    spiritualEnvironmentSuperLabel: String,
    spiritualEnvironmentTitle: String,
    spiritualCenterPara: String,
    spiritualBottomPara: String,
    spiritualParagraphs: [String],
    sunsetImage: String,

    pricingSuperLabel: String,
    pricingSectionTitle: String,
    yogaPricing: Array,

    applySuperLabel: String,
    applyTitle: String,
    applyText: String,
    applyNowHref: String,
    applyNowEmail: String,
    browseCoursesHref: String,

    footerTitle: String,
    footerLoc: String,
    footerMail: String,
    footerTag: String,

    syllabus: [String],
    included: [String],
    dailySchedule: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AyurvedaCourse", AyurvedaCourseSchema);