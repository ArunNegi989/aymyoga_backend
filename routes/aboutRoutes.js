const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // the multer config you shared
const {
  getAbout,
  getAboutById,
  createAbout,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");

/**
 * upload.any() is used (instead of upload.fields([...])) because the admin
 * form sends dynamically-named file fields whose count varies:
 *   - timelineImage_0..timelineImage_n
 * alongside the fixed single fields heroImage / schoolGalleryImage / visionImage / missionImage.
 * The controller groups req.files by fieldname.
 */

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