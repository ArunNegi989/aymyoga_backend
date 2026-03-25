const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const controller = require("../controllers/coursecontrollers/yoga300Content2controller");

/* =========================
   ROUTES
========================= */

// Create (only one record allowed)
router.post("/create", upload.any(), controller.create);

// Full update (multipart/form-data)
router.put("/update", upload.any(), controller.update);

// Status-only toggle — avoids overwriting all arrays
router.patch("/status", controller.updateStatus);

// Get single record
router.get("/", controller.getSingle);

// Delete record
router.delete("/delete", controller.remove);

module.exports = router;