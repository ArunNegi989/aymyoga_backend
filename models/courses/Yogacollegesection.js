const mongoose = require("mongoose");

/* ─────────────────────── Sub-schemas ─────────────────────── */
const TextItemSchema = new mongoose.Schema({ text: String }, { _id: false });
const LabelTextItemSchema = new mongoose.Schema({ label: String, text: String }, { _id: false });
const LabelValItemSchema = new mongoose.Schema({ label: String, val: String }, { _id: false });

const RegularCourseTabSchema = new mongoose.Schema(
  {
    label: String,
    hours: String,
    introText: String,
    extraText: String,
    affiliationText: String,
    aimObjectiveContent: String,
    aimObjectiveBullets: [String],
    durationContent: String,
    eligibilityItems: [LabelTextItemSchema],
    evaluationContent: String,
    evaluationExtra: String,
    syllabusTheory: [String],
    syllabusPractical: [String],
  },
  { _id: false }
);

const YogaMasterTabSchema = new mongoose.Schema(
  {
    label: String,
    hours: String,
    title: String,
    details: [LabelTextItemSchema],
    eligibility: [String],
    extraDetails: [LabelTextItemSchema],
    contact: String,
    syllabusTheory: [String],
    syllabusPractical: [String],
  },
  { _id: false }
);

const CertCardSchema = new mongoose.Schema(
  { title: String, exam: String, fee: String, icon: String },
  { _id: false }
);

const InPersonCourseSchema = new mongoose.Schema(
  {
    title: String,
    startDate: String,
    endDate: String,
    duration: String,
    cert: String,
    accreditation: String,
    fees: String,
    included: String,
    badge: String,
    color: String,
    imageAlt: String,
    image: String, // stored file path/url
  },
  { _id: false }
);

/* ─────────────────────── Main schema ─────────────────────── */
const YogaCollegeSectionSchema = new mongoose.Schema(
  {
    // Hero
    heroImage: String,
    heroImageAlt: String,
    heroTitle: String,
    heroSubtitle: String,

    // Shared aim images
    aimImage1: String,
    aimImage1Alt: String,
    aimImage2: String,
    aimImage2Alt: String,
    aimImage3: String,
    aimImage3Alt: String,

    // Intro & Highlight images
    introImage: String,
    introImageAlt: String,
    highlightImage: String,
    highlightImageAlt: String,

    // 3 regular course tabs
    protocolTab: RegularCourseTabSchema,
    wellnessTab: RegularCourseTabSchema,
    teacherTab: RegularCourseTabSchema,

    // Yoga master tab
    masterTab: YogaMasterTabSchema,

    // Highlight section text
    highlightBadge: String,
    highlightTitle: String,
    highlightSubtitle: String,

    // Certification section
    certSectionLabel: String,
    certSectionTitle: String,
    certCards: [CertCardSchema],

    // In-person courses section
    coursesSectionLabel: String,
    coursesSectionTitle: String,
    coursesSectionSub: String,
    inPersonCourses: [InPersonCourseSchema],

    // College section
    collegeSectionLabel: String,
    collegeHeading: String,
    collegeParagraph: String,
    collegeHighlights: [String],
    collegeImage: String,
    collegeImageAlt: String,
    collegeImageBadge: String,

    collegeCoursesHeading: String,
    collegeCourses: [String],

    maObjectivesHeading: String,
    maObjectives: [String],
    maObjectivesImage: String,
    maObjectivesImageAlt: String,
    maObjectivesImageBadge: String,

    // MA Eligibility section
    admissionsSectionLabel: String,
    maEligibilityHeading: String,
    maEligibilityParagraph: String,
    maDetailsGrid: [LabelValItemSchema],
    howToApplyHeading: String,
    howToApplyParagraph: String,

    // Career section
    careerSectionLabel: String,
    careerHeading: String,
    careerParagraphs: [String],
    careerOptions: [String],
    careerImage: String,
    careerImageAlt: String,
    careerImageBadge: String,

    // CTA Links
    applyNowLink: String,
    bookNowLink: String,
    moreDetailsLink: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("YogaCollegeSection", YogaCollegeSectionSchema);