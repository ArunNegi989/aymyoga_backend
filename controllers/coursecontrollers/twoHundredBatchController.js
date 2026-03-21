const TwoHundredBatch = require("../../models/courses/TwoHundredBatchModel");

/* =========================
   CREATE BATCH
========================= */
exports.createBatch = async (req, res) => {
  try {
    const data = req.body;

    const batch = await TwoHundredBatch.create({
      ...data,
      bookedSeats: 0, // always start from 0
    });

    res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET ALL BATCHES
========================= */
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await TwoHundredBatch.find().sort({ startDate: 1 });

    res.json({
      success: true,
      count: batches.length,
      data: batches,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET SINGLE BATCH
========================= */
exports.getBatchById = async (req, res) => {
  try {
    const batch = await TwoHundredBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.json({
      success: true,
      data: batch,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   UPDATE BATCH
========================= */
exports.updateBatch = async (req, res) => {
  try {
    const batch = await TwoHundredBatch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.json({
      success: true,
      message: "Batch updated successfully",
      data: batch,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   DELETE BATCH
========================= */
exports.deleteBatch = async (req, res) => {
  try {
    const batch = await TwoHundredBatch.findByIdAndDelete(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   BOOK SEAT (IMPORTANT 🔥)
========================= */
exports.bookSeat = async (req, res) => {
  try {
    const batch = await TwoHundredBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    if (batch.bookedSeats >= batch.totalSeats) {
      return res.status(400).json({
        success: false,
        message: "No seats available",
      });
    }

    batch.bookedSeats += 1;
    await batch.save();

    res.json({
      success: true,
      message: "Seat booked successfully",
      data: batch,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};