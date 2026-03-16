const mongoose = require("mongoose");

const StatSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true }
});

const HomeAboutSchema = new mongoose.Schema(
{
  superTitle: { type: String, required: true },

  mainTitle: { type: String, required: true },

  stats: [StatSchema],

  paraOne: { type: String, required: true },

  paraTwo: { type: String, required: true },

  paraThree: { type: String, required: true },

  accreditations: [String],

  quoteText: { type: String, required: true },

  paraRight: { type: String, required: true },

  yogaStyles: [String],

  paraSmall: String,

  ctaText: { type: String, required: true },

  ctaLink: { type: String, required: true }

},
{ timestamps: true }
);

module.exports = mongoose.model("HomeAbout", HomeAboutSchema);