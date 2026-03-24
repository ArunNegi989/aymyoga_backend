const express = require("express");
const router = express.Router();

const controller = require("../controllers/coursecontrollers/threeHundredBatch.controller");

/* =========================
   CREATE
========================= */
router.post("/create", controller.createBatch);

/* =========================
   READ
========================= */
router.get("/all", controller.getAllBatches);
router.get("/single/:id", controller.getSingleBatch);

/* =========================
   UPDATE
========================= */
router.put("/update/:id", controller.updateBatch);

/* =========================
   DELETE
========================= */
router.delete("/delete/:id", controller.deleteBatch);

module.exports = router;