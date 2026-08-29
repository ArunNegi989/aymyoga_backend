const express = require("express");
const router = express.Router();
const {
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  incrementBookedSeat,
} = require("../controllers/soundHealingSeatsController");

/* GET /api/sound-healing-seats/get-all-batches */
router.get("/get-all-batches", getAllBatches);

/* GET /api/sound-healing-seats/get-batch/:id */
router.get("/get-batch/:id", getBatchById);

/* POST /api/sound-healing-seats/create-batch */
router.post("/create-batch", createBatch);

/* PUT /api/sound-healing-seats/update-batch/:id */
router.put("/update-batch/:id", updateBatch);

/* DELETE /api/sound-healing-seats/delete-batch/:id */
router.delete("/delete-batch/:id", deleteBatch);

/* PATCH /api/sound-healing-seats/book-seat/:id — bump bookedSeats by 1 (used by registration flow) */
router.patch("/book-seat/:id", incrementBookedSeat);

module.exports = router;