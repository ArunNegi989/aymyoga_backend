const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const controller = require("../controllers/coursecontrollers/ashtangaVinyasaTTCController");

/* =========================
   CREATE (ONLY FIRST TIME)
========================= */
router.post(
  "/create",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "promoImage", maxCount: 1 },
  ]),
  controller.create
);

/* =========================
   GET SINGLE
========================= */
router.get("/", controller.getSingle);

/* =========================
   UPDATE
========================= */
router.put(
  "/update",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "promoImage", maxCount: 1 },
  ]),
  controller.update
);

/* =========================
   DELETE
========================= */
router.delete("/", controller.delete);

module.exports = router;