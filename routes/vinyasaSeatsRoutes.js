const express = require("express");
const router = express.Router();

const {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  bookSeat,
} = require("../controllers/coursecontrollers/vinyasaSeatsController");

/* =========================
   Vinyasa Seats Routes
========================= */

// CREATE
router.post("/createBatch", createBatch);

// READ
router.get("/", getAllBatches);
router.get("/:id", getBatchById);

// UPDATE
router.put("/:id", updateBatch);

// DELETE
router.delete("/delete/:id", deleteBatch);

// BOOK SEAT
router.post("/book-seat/:id", bookSeat);

module.exports = router;