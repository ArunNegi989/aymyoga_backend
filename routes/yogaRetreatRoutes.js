const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const yogaRetreatController = require("../controllers/yogaRetreatController");

// Accepts hero image, section-1 side image, and up to 4 photo-strip images
const uploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "s1Image", maxCount: 1 },
  { name: "photoStripImage_0", maxCount: 1 },
  { name: "photoStripImage_1", maxCount: 1 },
  { name: "photoStripImage_2", maxCount: 1 },
  { name: "photoStripImage_3", maxCount: 1 },
]);

/* =========================
   YOGA RETREAT SECTION ROUTES (singleton)
========================= */
router.get("/", yogaRetreatController.getAll);
router.get("/:id", yogaRetreatController.getById);
router.post("/", uploadFields, yogaRetreatController.create);
router.put("/:id", uploadFields, yogaRetreatController.update);
router.delete("/:id", yogaRetreatController.remove);

module.exports = router;