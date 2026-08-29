const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // the multer config you shared
const {
  getAffiliation,
  getAffiliationById,
  createAffiliation,
  updateAffiliation,
  deleteAffiliation,
} = require("../controllers/affiliationController");

/**
 * upload.any() is used (instead of upload.fields([...])) because the admin
 * form sends dynamically-named file fields whose count varies:
 *   - galleryImages        (repeated, 0..10)
 *   - rysImage_0..rysImage_3
 *   - certImage_0..certImage_n
 * alongside the fixed single fields heroImage / boardCertificateImage / iyfLogoImage.
 * The controller groups req.files by fieldname.
 */

// GET /api/affiliation        → singleton fetch
router.get("/", getAffiliation);

// GET /api/affiliation/:id    → fetch by id (edit page)
router.get("/:id", getAffiliationById);

// POST /api/affiliation       → create (first time only)
router.post("/", upload.any(), createAffiliation);

// PUT /api/affiliation/:id    → update
router.put("/:id", upload.any(), updateAffiliation);

// DELETE /api/affiliation/:id
router.delete("/:id", deleteAffiliation);

module.exports = router;