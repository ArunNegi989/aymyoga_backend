const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); 
const {
  getAbout,
  getAboutById,
  createAbout,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");



// GET /api/about-section        → singleton fetch
router.get("/", getAbout);

// GET /api/about-section/:id    → fetch by id (edit page)
router.get("/:id", getAboutById);

// POST /api/about-section       → create (first time only)
router.post("/", upload.any(), createAbout);

// PUT /api/about-section/:id    → update
router.put("/:id", upload.any(), updateAbout);

// DELETE /api/about-section/:id
router.delete("/:id", deleteAbout);

module.exports = router;