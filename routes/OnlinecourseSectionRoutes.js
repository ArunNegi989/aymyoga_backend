const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); 

const {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection,
} = require("../controllers/coursecontrollers/onlineCourseSectionController");


router.post("/", upload.any(), createSection);
router.get("/", getAllSections);          // index route
router.get("/:id", getSectionById);
router.put("/:id", upload.any(), updateSection);
router.delete("/:id", deleteSection);

module.exports = router;