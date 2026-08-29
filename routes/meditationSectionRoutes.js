// FILE: routes/meditationSectionRoutes.js
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  createSection,
  getSection,
  getSectionById,
  updateSection,
  deleteSection,
} = require("../controllers/meditationSectionController");

// Agar admin routes protect karne hain to apna auth middleware laga do
// const { verifyAdmin } = require("../middleware/authMiddleware");

const MAX_METHOD_CARDS = 10; // apni actual max method-card limit ke hisaab se adjust kar lena

const methodImageFields = Array.from({ length: MAX_METHOD_CARDS }, (_, i) => ({
  name: `methodImage${i}`,
  maxCount: 1,
}));

const meditationUploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "elevateImage", maxCount: 1 },
  { name: "ctaImage", maxCount: 1 },
  ...methodImageFields,
]);

router.post("/", /* verifyAdmin, */ meditationUploadFields, createSection);
router.get("/", getSection);
router.get("/:id", getSectionById);
router.put("/:id", /* verifyAdmin, */ meditationUploadFields, updateSection);
router.delete("/:id", /* verifyAdmin, */ deleteSection);

module.exports = router;