const express = require("express");
const router = express.Router();

const controller = require("../controllers/coursecontrollers/fiveHundredBatchcontroller");

/* =========================
   CREATE
========================= */
router.post("/create", controller.createBatch);

/* =========================
   READ
========================= */
router.get("/", controller.getAllBatches);
router.get("/:id", controller.getSingleBatch);

/* =========================
   UPDATE
========================= */
router.put("/:id", controller.updateBatch);

/* =========================
   DELETE
========================= */
router.delete("/:id", controller.deleteBatch);

module.exports = router;