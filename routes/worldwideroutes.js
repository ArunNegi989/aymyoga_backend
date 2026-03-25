const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // your multer file

const controller = require("../controllers/coursecontrollers/worldwidecontroller");

/* =========================
   CREATE
========================= */
router.post(
  "/create",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "curriculumRightImage", maxCount: 1 },
    { name: "teacherTeamLeftImage", maxCount: 1 },
  ]),
  controller.createContent,
);

/* =========================
   GET
========================= */
router.get("/", controller.getContent);

/* =========================
   UPDATE
========================= */
router.put(
  "/update",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "curriculumRightImage", maxCount: 1 },
    { name: "teacherTeamLeftImage", maxCount: 1 },
  ]),
  controller.updateContent,
);

/* =========================
   DELETE
========================= */
router.delete("/delete", controller.deleteContent);

module.exports = router;
