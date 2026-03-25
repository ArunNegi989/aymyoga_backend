const mongoose = require("mongoose");

const worldwideSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    pageTitleH1: String,
    heroImgAlt: String,
    heroImage: String,

    // Top paragraphs
    topParagraphs: [String],

    // Stats
    statsTitle: String,
    stats: [
      {
        val: String,
        label: String,
      },
    ],

    // Curriculum
    curriculumTitle: String,
    curriculumSubHeading: String,
    curriculumIntro: String,
    curriculumParagraphs: [String],
    curriculumItems: [String],
    curriculumRightImage: String,
    curriculumRightImageAlt: String,

    // Teacher
    teacherTeamTitle: String,
    teacherTeamSubtitle: String,
    teacherTeamDescription: String,
    teacherTeamLeftImage: String,
    teacherTeamLeftImageAlt: String,
    teacherTeamBadgeValue: String,
    teacherTeamBadgeLabel: String,

    // Benefits
    benefitsHeading: String,
    benefitsTitle: String,
    benefitsSubtext: String,
    benefits: [
      {
        num: String,
        text: String,
      },
    ],

    // Wellness
    wellnessTitle: String,
    wellnessDescription: String,

    // Community
    communityTitle: String,
    communitySubtext: String,
    communityDescription: String,

    // Locations
    locationsTitle: String,
    locationsSubtext: String,
    locations: [
      {
        name: String,
        flag: String,
        href: String,
        region: String,
      },
    ],

    // Footer
    footerTitle: String,
    footerSubtext: String,
    footerMetaText: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worldwide", worldwideSchema);