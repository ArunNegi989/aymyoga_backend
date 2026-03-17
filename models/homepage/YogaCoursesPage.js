const mongoose = require("mongoose");

/* =========================
   COURSE ITEM
========================= */
const courseItemSchema = new mongoose.Schema({
  hours: { type: String, required: true },
  days: { type: String, required: true },
  name: { type: String, required: true },
  style: { type: String, required: true },
  duration: { type: String, required: true },
  certificate: { type: String, required: true },
  feeShared: { type: String, required: true },
  feePrivate: { type: String, required: true },
  color: { type: String, required: true },
  imgUrl: { type: String, required: true },
  detailsLink: { type: String, required: true },
  bookLink: { type: String, required: true },
});

/* =========================
   TEACHER ITEM
========================= */
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  imgUrl: { type: String },
});

/* =========================
   MAIN SCHEMA
========================= */
const yogaCoursesSchema = new mongoose.Schema(
  {
    /* 1️⃣ Courses Section */
    sectionHeader: {
      eyebrow: { type: String, required: true },
      sectionTitle: { type: String, required: true },
      sectionDesc: { type: String, required: true },
    },
    courses: [courseItemSchema],

    /* 2️⃣ Who Section */
    who: {
      eyebrow: { type: String, required: true },
      sectionTitle: { type: String, required: true },
      para1: { type: String, required: true },
      para2: { type: String, required: true },
      para3: { type: String, required: true },
      para4: { type: String, required: true },
      para5: { type: String, required: true },
      chips: [{ type: String, required: true }],
      quoteText: { type: String, required: true },
      quoteAttrib: { type: String, required: true },
    },

    /* 3️⃣ Teachers Header */
    teachersHeader: {
      eyebrow: { type: String, required: true },
      sectionTitle: { type: String, required: true },
      introPara1: { type: String, required: true },
      introPara1Highlight: { type: String, required: true },
      introPara2: { type: String, required: true },
      introPara2Highlight: { type: String, required: true },
      ctaBtnText: { type: String, required: true },
      ctaBtnLink: { type: String, required: true },
    },

    /* 4️⃣ Founder */
    founder: {
      eyebrow: { type: String, required: true },
      name: { type: String, required: true },
      imgUrl: { type: String },
      imgAlt: { type: String, required: true },
      para1: { type: String, required: true },
      para2: { type: String, required: true },
      para3: { type: String, required: true },
      para3Highlight: { type: String, required: true },
      detailsBtnText: { type: String, required: true },
      detailsBtnLink: { type: String, required: true },
      bookBtnText: { type: String, required: true },
      bookBtnLink: { type: String, required: true },
    },

    /* 5️⃣ Teachers */
    teachers: [teacherSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("YogaCoursesPage", yogaCoursesSchema);