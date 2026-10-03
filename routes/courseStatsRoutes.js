const express = require("express");
const router = express.Router();

// Import all your course models
const HundredHourCourse = require("../models/courses/100hrContentModel");
const TwoHundredHourCourse = require("../models/courses/Yoga200Content");
const ThreeHundredHourCourse = require("../models/courses/yoga300Content1model");
const vinyasa = require("../models/courses/ashtangaVinyasaTTCModel");
const kundalini = require("../models/courses/kundaliniTTCModel");
const fiveHundred = require("../models/courses/yoga500ContentModel");
const prenatal = require("../models/courses/prenatalPageModel");
const yogarishikes = require("../models/courses/bestYogaSchoolModelrishikesh");
const yogaIndia = require("../models/courses/100hrContentModel");
const hathayoga = require("../models/courses/HathaYogaBatchModel");
const yogagoa = require("../models/courses/GoaYogaPageModel");
const bali = require("../models/courses/baliPageModel");
const ayurveda = require("../models/courses/ayurvedaCoursemodel");
const worldwide = require("../models/courses/worldwidemodel");

router.get("/count", async (req, res) => {
  try {
    const counts = await Promise.all([
      HundredHourCourse.countDocuments(),
      TwoHundredHourCourse.countDocuments(),
      ThreeHundredHourCourse.countDocuments(),
      vinyasa.countDocuments(),
      kundalini.countDocuments(),
      fiveHundred.countDocuments(),
      prenatal.countDocuments(),
      yogarishikes.countDocuments(),
      yogaIndia.countDocuments(),
      hathayoga.countDocuments(),
      yogagoa.countDocuments(),
      bali.countDocuments(),
      ayurveda.countDocuments(),
      worldwide.countDocuments(),
    ]);

    const total = counts.reduce((sum, c) => sum + c, 0);

    res.json({ success: true, total });
  } catch (err) {
    console.error("Course count error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
