const mongoose = require("mongoose");

const IconTextSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "" },
    title: { type: String, default: "" },
    desc: { type: String, default: "" },
  },
  { _id: false }
);

const CourseCardSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    duration: { type: String, default: "" },
    style: { type: String, default: "" },
    sessions: { type: String, default: "" },
    cert: { type: String, default: "" },
    fee: { type: String, default: "" },
    benefits: [{ type: String }],
    applyBtnText: { type: String, default: "Apply Now" },
    bookBtnText: { type: String, default: "Book Now" },
  },
  { _id: false }
);

const FaqSchema = new mongoose.Schema(
  {
    q: { type: String, default: "" },
    a: { type: String, default: "" },
  },
  { _id: false }
);

const CurriculumAreaSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    symbol: { type: String, default: "" },
    color: { type: String, default: "#F15505" },
    lines: [{ type: String }],
    image: { type: String, default: null },
  },
  { _id: false }
);

const RecordedCourseSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    price: { type: String, default: "" },
    features: [{ type: String }],
    applyBtnText: { type: String, default: "Apply Now" },
  },
  { _id: false }
);

const InfoBlockSchema = new mongoose.Schema(
  {
    heading: { type: String, default: "" },
    paragraphs: [{ type: String }],
  },
  { _id: false }
);

const OtherCourseSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    hours: { type: String, default: "" },
    price: { type: String, default: "" },
    enquireBtnText: { type: String, default: "Enquire Now" },
    image: { type: String, default: null },
  },
  { _id: false }
);

const OnlineCourseSectionSchema = new mongoose.Schema(
  {
    // Hero
    heroImage: { type: String, default: null },
    heroImageAlt: { type: String, default: "" },

    // Intro
    introEyebrow: { type: String, default: "" },
    introTitle: { type: String, default: "" },
    introParagraphs: [{ type: String }],

    // Why Choose
    whyEyebrow: { type: String, default: "" },
    whyTitle: { type: String, default: "" },
    whyReasons: [IconTextSchema],
    whyImage: { type: String, default: null },
    whyImageAlt: { type: String, default: "" },
    whyImageBadgeText: { type: String, default: "" },
    whyVideoEmbedUrl: { type: String, default: "" },
    whyVideoBadgeText: { type: String, default: "" },

    // Key Benefits
    benefitsEyebrow: { type: String, default: "" },
    benefitsTitle: { type: String, default: "" },
    keyBenefits: [IconTextSchema],

    // Live Courses
    coursesEyebrow: { type: String, default: "" },
    coursesTitle: { type: String, default: "" },
    liveCourses: [CourseCardSchema],

    // Seat Booking header
    seatBookingEyebrow: { type: String, default: "" },
    seatBookingTitle: { type: String, default: "" },
    seatBookingSubtitle: { type: String, default: "" },

    // Note + FAQs
    noteBoxText: { type: String, default: "" },
    faqEyebrow: { type: String, default: "" },
    faqTitle: { type: String, default: "" },
    faqs: [FaqSchema],

    // Curriculum
    curriculumEyebrow: { type: String, default: "" },
    curriculumTitle: { type: String, default: "" },
    curriculumAreas: [CurriculumAreaSchema],

    // Recorded courses + Info blocks
    recordedEyebrow: { type: String, default: "" },
    recordedTitle: { type: String, default: "" },
    recordedCourses: [RecordedCourseSchema],
    infoBlocks: [InfoBlockSchema],

    // Other courses
    otherEyebrow: { type: String, default: "" },
    otherTitle: { type: String, default: "" },
    otherCourses: [OtherCourseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("OnlineCourseSection", OnlineCourseSectionSchema);