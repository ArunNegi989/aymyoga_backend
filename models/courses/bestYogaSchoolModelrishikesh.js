const mongoose = require("mongoose");

const BestYogaSchoolSchema = new mongoose.Schema(
  {
    status: { type: String, default: "Active" },

    heroTitle: String,
    heroImage: String,

    accrSectionTitle: String,
    coursesSectionTitle: String,
    specialtySectionTitle: String,

    bodyParagraphs1: [String],
    bodyParagraphs2: [String],

    accredBadges: Array,
    courseCards: Array,
    specialtyCourses: Array,

    inlineLinks: Array,
    inlineLinks2: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("BestYogaSchool", BestYogaSchoolSchema);