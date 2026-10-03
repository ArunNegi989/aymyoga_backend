const mongoose = require("mongoose");

/* ── Sub-schemas ── */
const TimeSlotSchema = new mongoose.Schema(
  {
    time: { type: String, required: true, trim: true },
    activity: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const PricingCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true },
    detail: { type: String, default: "" },
    includes: { type: [String], default: [] },
  },
  { _id: false },
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
    ayurvedaCalloutParagraphs: { type: [String], default: [] },
    benefitsHeading: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    ctaText: { type: String, default: "" },
    ctaButtonText: { type: String, default: "" },
    ctaButtonLink: { type: String, default: "" },
    shivirTitle: { type: String, default: "" },
    shivirSubtitle: { type: String, default: "" },
    descriptionParagraphs: { type: [String], default: [] },
    campImage: { type: String, default: "" },
    campImageAlt: { type: String, default: "" },
    campImageCaption: { type: String, default: "" },
    datesHighlight: { type: String, default: "" },
    durationRange: { type: String, default: "" },
    dateNote: { type: String, default: "" },
    datePeriods: { type: [String], default: [] },
    timetableTitle: { type: String, default: "" },
    timetableSubtitle: { type: String, default: "" },
    timetableRows: { type: [TimeSlotSchema], default: [] },
    pricingCards: { type: [PricingCardSchema], default: [] },
    enrollTitle: { type: String, default: "" },
    enrollSteps: { type: [String], default: [] },
    seatsNote: { type: String, default: "" },
    eligibilityTitle: { type: String, default: "" },
    eligibilityText: { type: String, default: "" },
    guidelinesTitle: { type: String, default: "" },
    guidelines: { type: [String], default: [] },
    moreInfoTitle: { type: String, default: "" },
    moreInfoParagraphs: { type: [String], default: [] },
    dressCodeTitle: { type: String, default: "" },
    dressCodeMen: { type: String, default: "" },
    dressCodeWomen: { type: String, default: "" },
    dressCodeNote: { type: String, default: "" },
    reachTitle: { type: String, default: "" },
    reachText: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Holidays || mongoose.model("Holidays", HolidaysSchema);
