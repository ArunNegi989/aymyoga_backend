const mongoose = require("mongoose");

/* ── Sub-schemas ── */
const IconItemSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const TimelineItemSchema = new mongoose.Schema(
  {
    year: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    paragraphs: { type: [String], default: [] },
    image: { type: String, default: "" },
  },
  { _id: false }
);

/* ── Main schema (singleton document) ── */
const AboutSchema = new mongoose.Schema(
  {
    // Hero
    heroImage: { type: String, default: "" },
    heroImageAlt: { type: String, default: "" },

    // Logo badge
    logoAbbr: { type: String, default: "" },
    logoFullText: { type: String, default: "" },
    logoIndiaText: { type: String, default: "" },

    // Block 1 — School section
    schoolBlockTitle: { type: String, default: "" },
    schoolParagraphs: { type: [String], default: [] },
    schoolGalleryImage: { type: String, default: "" },
    schoolGalleryLabel: { type: String, default: "" },

    // Highlights grid
    highlights: { type: [IconItemSchema], default: [] },

    // Block 2 — Vision & Mission
    visionMissionBlockTitle: { type: String, default: "" },
    visionTitle: { type: String, default: "" },
    visionParagraphs: { type: [String], default: [] },
    visionImage: { type: String, default: "" },
    missionTitle: { type: String, default: "" },
    missionParagraphs: { type: [String], default: [] },
    missionImage: { type: String, default: "" },
    visionMissionProseParagraphs: { type: [String], default: [] },

    // Block 3 — Aims and Objectives
    objectivesBlockTitle: { type: String, default: "" },
    objectivesIntroParagraphs: { type: [String], default: [] },
    objectives: { type: [String], default: [] },

    // Block 4 — History of AYM
    historyBlockTitle: { type: String, default: "" },
    timelineItems: { type: [TimelineItemSchema], default: [] },

    // Block 5 — Activities
    activitiesBlockTitle: { type: String, default: "" },
    activitiesIntroParagraphs: { type: [String], default: [] },
    activities: { type: [IconItemSchema], default: [] },
  },
  { timestamps: true }
);

// Safety guard against "Cannot overwrite model once compiled" if this file
// ever gets required more than once under the same model name.
module.exports = mongoose.models.About || mongoose.model("About", AboutSchema);