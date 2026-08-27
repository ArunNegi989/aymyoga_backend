const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getYogaAshramSection,
  getYogaAshramSectionById,
  createYogaAshramSection,
  updateYogaAshramSection,
  deleteYogaAshramSection,
} = require("../controllers/yogaAshramController");

// Accepts up to 3 images in one multipart request: heroImage, featureImage, ashramPhoto
const ashramUpload = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "featureImage", maxCount: 1 },
  { name: "ashramPhoto", maxCount: 1 },
]);

/* GET /api/yoga-ashram-section          → singleton (latest doc) */
router.get("/", getYogaAshramSection);

/* GET /api/yoga-ashram-section/:id      → single doc by id */
router.get("/:id", getYogaAshramSectionById);

/* POST /api/yoga-ashram-section         → create (only if none exists) */
router.post("/", ashramUpload, createYogaAshramSection);

/* PUT /api/yoga-ashram-section/:id      → update */
router.put("/:id", ashramUpload, updateYogaAshramSection);

/* DELETE /api/yoga-ashram-section/:id   → delete */
router.delete("/:id", deleteYogaAshramSection);

module.exports = router;