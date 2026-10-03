
const express = require("express");
const router = express.Router();

const {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  incrementBookedSeat,
} = require("../controllers/yogaBeginnerSeatController");


router.post("/create-batch", /* verifyAdmin, */ createBatch);
router.get("/get-all-batches", getAllBatches);
router.get("/get-batch/:id", getBatchById);
router.put("/update-batch/:id", /* verifyAdmin, */ updateBatch);
router.delete("/delete-batch/:id", /* verifyAdmin, */ deleteBatch);

// Registration form submit hone par is route ko call karo
router.patch("/bookSeat/:id", incrementBookedSeat);

module.exports = router;