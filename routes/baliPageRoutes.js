const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const controller = require("../controllers/coursecontrollers/baliPageController");

/* =========================
   CREATE
========================= */
router.post(
  "/",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "groupImage", maxCount: 1 },
    { name: "templeImage", maxCount: 1 },
    { name: "riceImage", maxCount: 1 },
    { name: "practiceImage", maxCount: 1 },
    { name: "teacherImage", maxCount: 1 },
    { name: "gardenImage", maxCount: 1 },
    { name: "ubudImage", maxCount: 1 },
  ]),
  controller.createPage
);

/* =========================
   GET
========================= */
router.get("/", controller.getPage);

/* =========================
   UPDATE
========================= */
router.put(
  "/",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "groupImage", maxCount: 1 },
    { name: "templeImage", maxCount: 1 },
    { name: "riceImage", maxCount: 1 },
    { name: "practiceImage", maxCount: 1 },
    { name: "teacherImage", maxCount: 1 },
    { name: "gardenImage", maxCount: 1 },
    { name: "ubudImage", maxCount: 1 },
  ]),
  controller.updatePage
);

/* =========================
   DELETE
========================= */
router.delete("/", controller.deletePage);

module.exports = router;