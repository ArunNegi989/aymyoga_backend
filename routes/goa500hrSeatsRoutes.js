const express = require("express");
const router = express.Router();

const {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  bookSeat,
} = require("../controllers/coursecontrollers/goaFiveHundredBatchController");

/* =========================
   GOA 500HR ROUTES
========================= */

router.post("/createBatch", createBatch);

router.get("/getAllBatches", getAllBatches);
router.get("/getBatch/:id", getBatchById);

router.put("/updateBatch/:id", updateBatch);

router.delete("/deleteBatch/:id", deleteBatch);

router.patch("/bookSeat/:id", bookSeat);

module.exports = router;