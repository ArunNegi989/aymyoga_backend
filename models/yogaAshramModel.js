const mongoose = require("mongoose");

const { Schema } = mongoose;

/* ── Reusable sub-schemas (no separate _id needed for simple repeatable rows) ── */
const StatItemSchema = new Schema(
  {
    num: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const TimelineItemSchema = new Schema(
  {
    icon: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CoursePillSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const IconLabelSchema = new Schema(
  {
    icon: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const WhyCardSchema = new Schema(
  {
    num: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ActivityItemSchema = new Schema(
  {
    icon: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CourseLinkSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/* ── Main schema — one document per page (singleton, same pattern as Retreat) ── */
const YogaAshramSectionSchema = new Schema(
  {
    // Hero
    heroImage: { type: String, default: "" }, // stored relative path e.g. /uploads/xxx.jpg
    heroImageAlt: { type: String, required: true, trim: true },

    // Title
    mainTitle: { type: String, required: true, trim: true },

    // Feature image + quote
    featureImage: { type: String, default: "" },
    featureImageAlt: { type: String, required: true, trim: true },
    quoteText: { type: String, required: true, trim: true },

    // Welcome — stats + paragraphs
    welcomeStats: { type: [StatItemSchema], default: [] },
    welcomeParagraphs: { type: [String], default: [] },

    // Experience — timeline
    experienceTitle: { type: String, required: true, trim: true },
    experienceParagraphs: { type: [String], default: [] },
    timelineItems: { type: [TimelineItemSchema], default: [] },

    // Best section (About Rishikesh + Courses Offered)
    bestSectionLabel: { type: String, required: true, trim: true },
    bestSectionTitle: { type: String, required: true, trim: true },
    aboutCardTitle: { type: String, required: true, trim: true },
    aboutCardText: { type: String, required: true, trim: true },
    certBadges: { type: [String], default: [] },
    coursesCardTitle: { type: String, required: true, trim: true },
    coursesCardText: { type: String, required: true, trim: true },
    coursePills: { type: [CoursePillSchema], default: [] },

    // Bottom ashram photo
    ashramPhoto: { type: String, default: "" },
    ashramPhotoAlt: { type: String, required: true, trim: true },
    photoCaptionTitle: { type: String, required: true, trim: true },
    photoCaptionSub: { type: String, required: true, trim: true },

    // What is an Ashram
    whatSectionLabel: { type: String, required: true, trim: true },
    whatSectionTitle: { type: String, required: true, trim: true },
    whatIcons: { type: [IconLabelSchema], default: [] },
    whatParagraphs: { type: [String], default: [] },
    pullquote: { type: String, required: true, trim: true },
    whatExtraParagraph: { type: String, required: true, trim: true },

    // Why is AYM best
    whySectionLabel: { type: String, required: true, trim: true },
    whySectionTitle: { type: String, required: true, trim: true },
    whySectionLink: { type: String, required: true, trim: true },
    whyParagraphs: { type: [String], default: [] },
    whyCards: { type: [WhyCardSchema], default: [] },

    // Activities
    actSectionLabel: { type: String, required: true, trim: true },
    actSectionTitle: { type: String, required: true, trim: true },
    actIntroText: { type: String, required: true, trim: true },
    activities: { type: [ActivityItemSchema], default: [] },
    actBottomText: { type: String, required: true, trim: true },
    coursesHeading: { type: String, required: true, trim: true },
    coursesList: { type: [CourseLinkSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("YogaAshramSection", YogaAshramSectionSchema);