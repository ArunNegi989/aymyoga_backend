const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/coursecontrollers/hathaYogaController");

/* =========================
   MULTI FILE FIELDS
========================= */
const uploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "introSideImage", maxCount: 1 },
  { name: "benefitsSideImage", maxCount: 1 },
  { name: "ashramImage", maxCount: 1 },

  // dynamic cert images
  { name: "certCardImage_0", maxCount: 1 },
  { name: "certCardImage_1", maxCount: 1 },
  { name: "certCardImage_2", maxCount: 1 },
  { name: "certCardImage_3", maxCount: 1 },
  { name: "certCardImage_4", maxCount: 1 },
]);

/* =========================
   ROUTES
========================= */

// CREATE / UPDATE (single)
router.post("/create", uploadFields, controller.saveHathaYoga);
router.put("/update", uploadFields, controller.saveHathaYoga);

// GET
router.get("/", controller.getHathaYoga);

// DELETE
router.delete("/", controller.deleteHathaYoga);

module.exports = router;