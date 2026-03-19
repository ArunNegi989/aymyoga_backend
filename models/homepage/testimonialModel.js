const mongoose = require("mongoose");

/* =========================
   TRUST ITEM SCHEMA
========================= */
const trustItemSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

/* =========================
   SECTION META SCHEMA
========================= */
const sectionMetaSchema = new mongoose.Schema(
  {
    superTitle: { type: String },
    mainTitle: { type: String },
    subtitle: { type: String },
    trustItems: [trustItemSchema],
  },
  { _id: false }
);

/* =========================
   MAIN TESTIMONIAL SCHEMA
========================= */
const testimonialSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["video", "text"],
      required: true,
    },

    /* ===== VIDEO FIELDS ===== */
    name: String,
    country: String,
    flag: String,
    youtubeUrl: String,
    youtubeId: String,
    course: String,

    /* ===== TEXT FIELDS ===== */
    role: String,
    avatarSrc: String,

    /* ===== COMMON ===== */
    quote: String,
    rating: { type: Number, default: 5 },

    /* ===== SECTION ===== */
    sectionMeta: sectionMetaSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);