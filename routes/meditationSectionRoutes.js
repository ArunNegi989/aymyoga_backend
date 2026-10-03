
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


const MAX_METHOD_CARDS = 10; 

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