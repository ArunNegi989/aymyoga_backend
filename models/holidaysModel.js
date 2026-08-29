const mongoose = require("mongoose");

/* ── Sub-schemas ── */
const TimeSlotSchema = new mongoose.Schema(
  {
    time: { type: String, required: true, trim: true },
    activity: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const PricingCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true },
    detail: { type: String, default: "" },
    includes: { type: [String], default: [] },
  },
  { _id: false }
);

/* ── Main schema (singleton document) ── */
const HolidaysSchema = new mongoose.Schema(
  {
    // Hero
    heroImage: { type: String, default: "" },
    heroImageAlt: { type: String, default: "" },

    // Section 1 — intro
    mainTitle: { type: String, default: "" },
    bodyParagraphs: { type: [String], default: [] },
    mediaImage: { type: String, default: "" },
    mediaImageAlt: { type: String, default: "" },
    imageOverlayCaption: { type: String, default: "" },
    videoEmbedUrl: { type: String, default: "" },

    // Ayurveda callout + Benefits + CTA
    ayurvedaCalloutParagraphs: { type: [String], default: [] },
    benefitsHeading: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    ctaText: { type: String, default: "" },
    ctaButtonText: { type: String, default: "" },
    ctaButtonLink: { type: String, default: "" },

    // Section 2 — Shivir header + description + camp image
    shivirTitle: { type: String, default: "" },
    shivirSubtitle: { type: String, default: "" },
    descriptionParagraphs: { type: [String], default: [] },
    campImage: { type: String, default: "" },
    campImageAlt: { type: String, default: "" },
    campImageCaption: { type: String, default: "" },

    // Dates & Duration
    datesHighlight: { type: String, default: "" },
    durationRange: { type: String, default: "" },
    dateNote: { type: String, default: "" },
    datePeriods: { type: [String], default: [] },

    // Timetable
    timetableTitle: { type: String, default: "" },
    timetableSubtitle: { type: String, default: "" },
    timetableRows: { type: [TimeSlotSchema], default: [] },

    // Pricing
    pricingCards: { type: [PricingCardSchema], default: [] },

    // Enrollment
    enrollTitle: { type: String, default: "" },
    enrollSteps: { type: [String], default: [] },
    seatsNote: { type: String, default: "" },

    // Eligibility
    eligibilityTitle: { type: String, default: "" },
    eligibilityText: { type: String, default: "" },

    // Guidelines
    guidelinesTitle: { type: String, default: "" },
    guidelines: { type: [String], default: [] },

    // More Info + Dress Code
    moreInfoTitle: { type: String, default: "" },
    moreInfoParagraphs: { type: [String], default: [] },
    dressCodeTitle: { type: String, default: "" },
    dressCodeMen: { type: String, default: "" },
    dressCodeWomen: { type: String, default: "" },
    dressCodeNote: { type: String, default: "" },

    // How to Reach
    reachTitle: { type: String, default: "" },
    reachText: { type: String, default: "" },
  },
  { timestamps: true }
);

// Safety guard against "Cannot overwrite model once compiled" if this file
// ever gets required more than once under the same model name.
module.exports = mongoose.models.Holidays || mongoose.model("Holidays", HolidaysSchema);