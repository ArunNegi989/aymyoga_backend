const express = require("express");
const router = express.Router();
const {
  createSection,
  getAllSections,
  getSectionById,
  getActiveSection,
  updateSection,
  deleteSection,
} = require("../controllers/detoxRetreatController");
const upload = require("../middleware/upload");

const uploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "s1Image", maxCount: 1 },
  { name: "massageImage", maxCount: 1 },
]);

router.get("/active", getActiveSection);
router.get("/", getAllSections);
router.get("/:id", getSectionById);
router.post("/", uploadFields, createSection);
router.put("/:id", uploadFields, updateSection);
router.delete("/:id", deleteSection);

module.exports = router;
