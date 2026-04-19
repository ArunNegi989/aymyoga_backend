const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const controller = require("../controllers/coursecontrollers/yoga500ContentController");

/* =========================
   CREATE
========================= */
router.post(
  "/create",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "shivaImage", maxCount: 1 },
    { name: "evalImage", maxCount: 1 },
    { name: "accomImage", maxCount: 20 },
    { name: "foodImage", maxCount: 20 },
    { name: "introMedia", maxCount: 20 }, // Now accepts both images and videos
  ]),
  controller.createContent
);

/* =========================
   GET
========================= */
router.get("/", controller.getContent);

/* =========================
   UPDATE
========================= */
router.put(
  "/update/:id",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "shivaImage", maxCount: 1 },
    { name: "evalImage", maxCount: 1 },
    { name: "accomImage", maxCount: 20 },
    { name: "foodImage", maxCount: 20 },
    { name: "introMedia", maxCount: 20 }, // Now accepts both images and videos
  ]),
  controller.updateContent
);

/* =========================
   DELETE
========================= */
router.delete("/:id", controller.deleteContent);

module.exports = router;