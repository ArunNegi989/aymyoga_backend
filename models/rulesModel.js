const mongoose = require("mongoose");

/* ── Sub-schemas ── */
const RuleItemSchema = new mongoose.Schema(
  {
    num: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const CategorySchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    rules: { type: [RuleItemSchema], default: [] },
  },
  { _id: false }
);

/* ── Main schema (singleton document) ── */
const RulesSchema = new mongoose.Schema(
  {
    // Hero
    heroImage: { type: String, default: "" },
    heroImageAlt: { type: String, default: "" },

    // Page header
    pageTitle: { type: String, default: "" },
    brownBarLabel: { type: String, default: "" },

    // Rule categories (each with its own list of numbered rules)
    categories: { type: [CategorySchema], default: [] },

    // Agreement section
    agreementTitle: { type: String, default: "" },
    agreementParagraphs: { type: [String], default: [] },

    // Footer
    footerText: { type: String, default: "" },
  },
  { timestamps: true }
);

// Safety guard against "Cannot overwrite model once compiled" if this file
// ever gets required more than once under the same model name.
module.exports = mongoose.models.Rules || mongoose.model("Rules", RulesSchema);