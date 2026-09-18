const express = require("express");
const router = express.Router();

const {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/howToReachController");

/* ===========================
   HOW TO REACH SECTION ROUTES
=========================== */
router.get("/", getSections);
router.get("/:id", getSectionById);
router.post("/", createSection);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);

module.exports = router;