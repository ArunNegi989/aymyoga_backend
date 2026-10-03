// backend/routes/yoga300Content2Routes.js
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const controller = require("../controllers/coursecontrollers/yoga300Content2controller");

router.post("/create", upload.any(), controller.create);

router.put("/update", upload.any(), controller.update);

router.patch("/status", controller.updateStatus);

router.get("/", controller.getSingle);

router.delete("/delete", controller.remove);

module.exports = router;