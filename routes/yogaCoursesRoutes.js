const express = require("express");
const router  = express.Router();

const {
  createYogaCourses,
  getYogaCourses,
  updateYogaCourses,
  deleteYogaCourses,
  updateSection,
} = require("../controllers/homepage/yogaCoursesController");

// Multer middleware — handles all image fields for this page
const uploadYogaImages = require("../middleware/yogaCoursesUpload");

/* =========================
   YOGA COURSES PAGE API
========================= */

// CREATE  — POST /api/yoga-courses/create
router.post("/create", uploadYogaImages, createYogaCourses);

// READ    — GET /api/yoga-courses/get
router.get("/get", getYogaCourses);

// UPDATE (FULL) — PUT /api/yoga-courses/update
router.put("/update", uploadYogaImages, updateYogaCourses);

// PATCH (TAB-WISE) — PATCH /api/yoga-courses/update-section/:section
router.patch("/update-section/:section", uploadYogaImages, updateSection);

// DELETE  — DELETE /api/yoga-courses/delete
router.delete("/delete", deleteYogaCourses);

module.exports = router;