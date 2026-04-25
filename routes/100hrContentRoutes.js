const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/coursecontrollers/100hrContentController");
const upload     = require("../middleware/upload");

/* ══════════════════════════════════════════
   All uploadable fields (images + videos)
   Each video section has its OWN file field
══════════════════════════════════════════ */
const multiUpload = upload.fields([
  /* ── Images ── */
  { name: "bannerImage",         maxCount: 1 },
  { name: "transformImage",      maxCount: 1 },
  { name: "scheduleImage",       maxCount: 1 },
  { name: "soulShineImage",      maxCount: 1 },
  { name: "suitableImage1",      maxCount: 1 },
  { name: "suitableImage2",      maxCount: 1 },
  { name: "suitableImage3",      maxCount: 1 },
  { name: "syllabusImage1",      maxCount: 1 },
  { name: "syllabusImage2",      maxCount: 1 },
  { name: "enrollImage",         maxCount: 1 },
  { name: "certImage",           maxCount: 1 },
  { name: "registrationImage",   maxCount: 1 },

  /* ── Videos — ONE field per section ── */
  { name: "videoFile",              maxCount: 1 },  // Main page video (MP4)
  { name: "syllabusVideoFile",      maxCount: 1 },  // Syllabus section video (MP4)
  { name: "scheduleVideoFile",      maxCount: 1 },  // Schedule section video (MP4)
  { name: "comprehensiveVideoFile", maxCount: 1 },  // Comprehensive section video (MP4)
]);

router.post(  "/create", multiUpload, controller.create);
router.get(   "/get",                 controller.get);
router.get(   "/get/:id",             controller.getById);
router.put(   "/update", multiUpload, controller.update);
router.delete("/delete",              controller.delete);
router.delete("/reset",               controller.reset);

module.exports = router;