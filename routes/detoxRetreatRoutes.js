// routes/detoxRetreatRoutes.js
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

// Configure multer for multiple file uploads
const uploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "s1Image", maxCount: 1 },
  { name: "massageImage", maxCount: 1 },
]);

// ============================================
// ALL ROUTES - No authentication required
// ============================================

// Get routes
router.get("/active", getActiveSection);
router.get("/", getAllSections);
router.get("/:id", getSectionById);

// Create/Update/Delete routes
router.post("/", uploadFields, createSection);
router.put("/:id", uploadFields, updateSection);
router.delete("/:id", deleteSection);

module.exports = router;