const express = require("express");
const router = express.Router();
const controller = require("../controllers/coursecontrollers/100hrContentController");
const upload = require("../middleware/upload");

/* MULTIPLE IMAGE UPLOAD */
const multiUpload = upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "scheduleImage", maxCount: 1 },
  { name: "soulShineImage", maxCount: 1 },
]);

/* =========================
   ROUTES
========================= */
router.post("/create", multiUpload, controller.create);
router.get("/get", controller.get);
router.get("/get/:id", controller.getById);

router.put("/update", multiUpload, controller.update);

router.delete("/delete", controller.delete);
router.delete("/reset", controller.reset); // optional

module.exports = router;