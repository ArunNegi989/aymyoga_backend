const mongoose = require("mongoose");

/* ── Sub-schemas ── */
const CardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    color: { type: String, default: "#F15505" },
  },
  { _id: false }
);

const RysImageSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const CertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
  },
  { _id: false }
);

/* ── Main schema (singleton document) ── */
const AffiliationSchema = new mongoose.Schema(
  {
    // Hero
    heroImage: { type: String, default: "" },
    heroImageAlt: { type: String, default: "" },

    // "Why Choose AYM?" cards
    accreditationCards: { type: [CardSchema], default: [] },

    // Gallery carousel
    galleryImages: { type: [String], default: [] },

    // Main intro
    mainTitle: { type: String, default: "" },
    introCardTitle: { type: String, default: "" },
    introParagraphs: { type: [String], default: [] },

    // RYS registration logos (RPYS, RYS 200/300/500 etc.)
    rysImages: { type: [RysImageSchema], default: [] },

    // Highlight box
    highlightTitle: { type: String, default: "" },
    highlightParagraphs: { type: [String], default: [] },
    yogaAllianceUrl: { type: String, default: "" },

    // Yoga Alliance certs section
    certsSectionTitle: { type: String, default: "" },
    certsSectionSubtitle: { type: String, default: "" },
    certs: { type: [CertSchema], default: [] },

    // Ministry of AYUSH / Yoga Certification Board
    boardSectionTitle: { type: String, default: "" },
    boardSectionSubtitle: { type: String, default: "" },
    boardCertificateImage: { type: String, default: "" },
    boardInfoTitle: { type: String, default: "" },
    boardInfoText: { type: String, default: "" },

    // International Yoga Federation
    iyfSectionTitle: { type: String, default: "" },
    iyfTitle: { type: String, default: "" },
    iyfParagraphs: { type: [String], default: [] },
    iyfFooterNotes: { type: [String], default: [] },
    iyfLogoImage: { type: String, default: "" },
  },
  { timestamps: true }
);

// Safety guard: if this file ever gets required more than once under the
// same model name (e.g. via two different paths, or a leftover duplicate
// file), reuse the already-compiled model instead of re-registering it —
// this is what throws "Cannot overwrite `X` model once compiled".
module.exports = mongoose.models.Affiliation || mongoose.model("Affiliation", AffiliationSchema);