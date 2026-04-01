const mongoose = require("mongoose");

const courseLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href:  { type: String, required: true },
});

const courseSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true },
    imageAlt:     String,
    image:        String,

    duration:     { type: String, required: true },
    level:        { type: String, required: true },
    description:  { type: String, required: true },

    links:        [courseLinkSchema],

    enrollHref:   { type: String, required: true },
    exploreLabel: { type: String, required: true },
    exploreHref:  { type: String, required: true },

    priceINR:     { type: String, required: true },
    priceUSD:     { type: String, required: true },

    totalSeats:     { type: Number, required: true },
    availableSeats: { type: Number },

    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Fixed: use async style — no `next` callback needed in Mongoose 7+
courseSchema.pre("save", async function () {
  if (this.isNew && (this.availableSeats == null || this.availableSeats === 0)) {
    this.availableSeats = this.totalSeats;
  }
});

module.exports = mongoose.model("CourseSection", courseSchema);