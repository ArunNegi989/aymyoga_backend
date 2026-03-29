const express = require("express");
const router = express.Router();

const {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  bookSeat,
} = require("../controllers/coursecontrollers/goaTwoHundredBatchController");

/* =========================
   GOA 200HR ROUTES
========================= */

// CREATE
router.post("/createBatch", createBatch);

// READ
router.get("/getAllBatches", getAllBatches);
router.get("/getBatch/:id", getBatchById);

// UPDATE
router.put("/updateBatch/:id", updateBatch);

// DELETE
router.delete("/deleteBatch/:id", deleteBatch);

// BOOK
router.patch("/bookSeat/:id", bookSeat);

module.exports = router;