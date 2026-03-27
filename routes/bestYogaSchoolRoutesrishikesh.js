const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const controller = require("../controllers/coursecontrollers/bestYogaSchoolControllerrishikesh");

/* =========================
   CREATE
========================= */
router.post("/create", upload.any(), controller.create);

/* =========================
   GET
========================= */
router.get("/get", controller.get);

/* =========================
   UPDATE
========================= */
router.put("/update", upload.any(), controller.update);

router.delete("/delete", controller.remove);

module.exports = router;
