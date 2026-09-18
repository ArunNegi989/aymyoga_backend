const mongoose = require("mongoose");

/* ── Schedule row (one row of a travel option's timing table) ── */
const ScheduleRowSchema = new mongoose.Schema(
  {
    col1: { type: String, required: true, trim: true },
    col2: { type: String, required: true, trim: true },
    col3: { type: String, required: true, trim: true },
    col4: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/* ── One travel option card (By Air / By Train / By Bus / …) ── */
const TravelCardSchema = new mongoose.Schema(
  {
    iconType: {
      type: String,
      enum: ["plane", "train", "bus", "car"],
      required: true,
      default: "car",
    },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    desc: { type: String, required: true }, // rich text (HTML from Jodit)

    headerCol1: { type: String, required: true, trim: true },
    headerCol2: { type: String, required: true, trim: true },
    headerCol3: { type: String, required: true, trim: true },
    headerCol4: { type: String, required: true, trim: true },

    rows: {
      type: [ScheduleRowSchema],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one schedule row is required",
      },
    },

    btnText: { type: String, required: true, trim: true },
    btnHref: { type: String, required: true, trim: true },
    linkText: { type: String, required: true, trim: true },
    linkHref: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/* ── Top level singleton section ── */
const HowToReachSectionSchema = new mongoose.Schema(
  {
    // Header
    badgeText: { type: String, trim: true, default: "✦ Travel Guide" },
    mainTitle: { type: String, required: true, trim: true },
    subTitle: { type: String, required: true, trim: true },

    // WhatsApp config
    whatsappNumber: { type: String, required: true, trim: true },
    whatsappMessage: { type: String, required: true, trim: true },

    // Travel options
    travelCards: {
      type: [TravelCardSchema],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one travel option is required",
      },
    },

    // Pickup & Drop card
    pickupTitle: { type: String, required: true, trim: true },
    pickupSubtitle: { type: String, trim: true },
    pickupDesc: { type: String, required: true },
    pickupHighlights: { type: [String], default: [] },
    pickupBookBtnText: { type: String, trim: true, default: "Book Pickup / Drop" },
    pickupWhatsappBtnText: { type: String, trim: true, default: "WhatsApp" },

    // Map
    mapLabel: { type: String, required: true, trim: true },
    mapEmbedSrc: { type: String, required: true, trim: true },
    mapDirectionsText: { type: String, trim: true, default: "↗ Get Directions" },
    mapDirectionsUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HowToReachSection", HowToReachSectionSchema);