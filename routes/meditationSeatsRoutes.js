const express = require("express");
const router = express.Router();
const {
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  incrementBookedSeat,
} = require("../controllers/meditationSeatscontroller");

router.get("/get-all-batches", getAllBatches);
router.get("/get-batch/:id", getBatchById);
router.post("/create-batch", createBatch);
router.put("/update-batch/:id", updateBatch);
router.delete("/delete-batch/:id", deleteBatch);

// internal use — call this when a registration form is submitted for this batch
router.patch("/book-seat/:id", incrementBookedSeat);

module.exports = router;