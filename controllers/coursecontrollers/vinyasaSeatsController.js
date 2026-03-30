const VinyasaSeats = require("../../models/courses/vinyasaSeatsModel");

/* =========================
   CREATE BATCH
========================= */
exports.createBatch = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      usdFee,
      inrFee,
      dormPrice,
      twinPrice,
      privatePrice,
      totalSeats,
      note,
    } = req.body;

    // optional: prevent duplicate batch (same dates)
    const existing = await VinyasaSeats.findOne({ startDate, endDate });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Batch already exists for these dates ⚠️",
      });
    }

    const batch = await VinyasaSeats.create({
      startDate,
      endDate,
      usdFee,
      inrFee,
      dormPrice,
      twinPrice,
      privatePrice,
      totalSeats,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Batch created successfully ✅",
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating batch",
      error: error.message,
    });
  }
};

/* =========================
   GET ALL BATCHES
========================= */
exports.getAllBatches = async (req, res) => {
  try {
    const data = await VinyasaSeats.find().sort({ startDate: 1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching batches",
    });
  }
};

/* =========================
   GET SINGLE BATCH
========================= */
exports.getBatchById = async (req, res) => {
  try {
    const batch = await VinyasaSeats.findById(req.params.id);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching batch",
    });
  }
};

/* =========================
   UPDATE BATCH
========================= */
exports.updateBatch = async (req, res) => {
  try {
    const updated = await VinyasaSeats.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Batch updated successfully ✅",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating batch",
    });
  }
};

/* =========================
   DELETE BATCH
========================= */
exports.deleteBatch = async (req, res) => {
  try {
    await VinyasaSeats.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Batch deleted successfully 🗑️",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting batch",
    });
  }
};

/* =========================
   BOOK SEAT
========================= */
exports.bookSeat = async (req, res) => {
  try {
    const batch = await VinyasaSeats.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    if (batch.bookedSeats >= batch.totalSeats) {
      return res.status(400).json({
        message: "No seats available",
      });
    }

    batch.bookedSeats += 1;
    await batch.save();

    res.json({
      success: true,
      message: "Seat booked successfully 🎉",
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error booking seat",
    });
  }
};