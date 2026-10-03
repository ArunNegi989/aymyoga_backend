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

    pageTitle: { type: String, default: "" },
    brownBarLabel: { type: String, default: "" },
    categories: { type: [CategorySchema], default: [] },
    agreementTitle: { type: String, default: "" },
    agreementParagraphs: { type: [String], default: [] },
    footerText: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Rules || mongoose.model("Rules", RulesSchema);