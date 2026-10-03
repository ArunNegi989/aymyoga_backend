const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const controller = require("../controllers/coursecontrollers/kundaliniTTCController");

/* =========================
   CREATE
========================= */
router.post(
  "/create",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "classImage", maxCount: 1 },
    { name: "schedImg1", maxCount: 1 },
    { name: "schedImg2", maxCount: 1 },
    { name: "whatIsImage", maxCount: 1 },
    { name: "activateImage", maxCount: 1 },
    { name: "curriculumImage", maxCount: 1 },
    { name: "sylHeaderBgImage", maxCount: 1 },
    { name: "eligibilityImage", maxCount: 1 },
    { name: "locationBannerImage", maxCount: 1 },
    { name: "locationStackTopImage", maxCount: 1 },
    { name: "locationStackBottomImage", maxCount: 1 },
    { name: "facilitiesVideoPoster", maxCount: 1 },
    { name: "whyRishikeshBannerImage", maxCount: 1 },
  ]),
  controller.create,
);

/* =========================
   GET
========================= */
router.get("/get", controller.get);

/* =========================
   UPDATE
========================= */
router.put(
  "/update",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "classImage", maxCount: 1 },
    { name: "schedImg1", maxCount: 1 },
    { name: "schedImg2", maxCount: 1 },
    { name: "whatIsImage", maxCount: 1 },
    { name: "activateImage", maxCount: 1 },
    { name: "curriculumImage", maxCount: 1 },
    { name: "sylHeaderBgImage", maxCount: 1 },
    { name: "eligibilityImage", maxCount: 1 },
    { name: "locationBannerImage", maxCount: 1 },
    { name: "locationStackTopImage", maxCount: 1 },
    { name: "locationStackBottomImage", maxCount: 1 },
    { name: "facilitiesVideoPoster", maxCount: 1 },
    { name: "whyRishikeshBannerImage", maxCount: 1 },
  ]),
  controller.update,
);

/* =========================
   DELETE
========================= */
router.delete("/delete", controller.delete);

module.exports = router;
