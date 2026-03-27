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
  ]),
  controller.create
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
  ]),
  controller.update
);

router.delete("/delete", controller.delete);
module.exports = router;