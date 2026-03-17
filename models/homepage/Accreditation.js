const mongoose = require("mongoose");

/* =========================
   SUB SCHEMAS
========================= */

const certSchema = new mongoose.Schema({
  label: { type: String, required: true },
  tag: { type: String, required: true },
  alt: { type: String },
  image: { type: String }, // uploaded file path
});

const badgeSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  text: { type: String, required: true },
});

/* =========================
   MAIN SCHEMA
========================= */

const accreditationSchema = new mongoose.Schema(
  {

    singleton: {
      type: String,
      default: "ONLY_ONE",
      unique: true,
    },
    
    sectionTitle: { type: String, required: true },

    authPara1: { type: String, required: true },
    authPara2: { type: String, required: true },
    authPara3: { type: String, required: true },
    authPara4: { type: String, required: true },

    imageCaption: String,
    mainImage: String,

    pullQuote: { type: String, required: true },

    videoSrc: { type: String, required: true },

    immerseTitle: { type: String, required: true },
    immersePara1: { type: String, required: true },
    immersePara2: String,

    immerseCtaText: { type: String, required: true },
    immerseCtaLink: { type: String, required: true },

    recognitionTitle: { type: String, required: true },
    recognitionPara1: { type: String, required: true },
    recognitionPara2: String,

    certs: [certSchema],
    badges: [badgeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accreditation", accreditationSchema);