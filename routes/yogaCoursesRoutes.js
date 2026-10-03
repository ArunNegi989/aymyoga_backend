const express = require("express");
const router  = express.Router();

const {
  createYogaCourses,
  getYogaCourses,
  updateYogaCourses,
  deleteYogaCourses,
  updateSection,
} = require("../controllers/homepage/yogaCoursesController");

const uploadYogaImages = require("../middleware/yogaCoursesUpload");


router.post("/create", uploadYogaImages, createYogaCourses);

router.get("/get", getYogaCourses);

router.put("/update", uploadYogaImages, updateYogaCourses);

router.patch("/update-section/:section", uploadYogaImages, updateSection);

router.delete("/delete", deleteYogaCourses);

module.exports = router;