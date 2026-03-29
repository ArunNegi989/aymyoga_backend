const GoaTwoHundredBatch = require("../../models/courses/Goa200BatchModel");

/* =========================
   CREATE
========================= */
exports.createBatch = async (req, res) => {
  try {
    const batch = await GoaTwoHundredBatch.create({
      ...req.body,
      bookedSeats: 0,
    });

    res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET ALL
========================= */
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await GoaTwoHundredBatch.find().sort({ startDate: 1 });

    res.json({
      success: true,
      count: batches.length,
      data: batches,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.getBatchById = async (req, res) => {
  try {
    const batch = await GoaTwoHundredBatch.findById(req.params.id);

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
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.updateBatch = async (req, res) => {
  try {
    const batch = await GoaTwoHundredBatch.findByIdAndUpdate(
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
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   DELETE
========================= */
exports.deleteBatch = async (req, res) => {
  try {
    const batch = await GoaTwoHundredBatch.findByIdAndDelete(req.params.id);

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
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   BOOK SEAT
========================= */
exports.bookSeat = async (req, res) => {
  try {
    const batch = await GoaTwoHundredBatch.findById(req.params.id);

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
    res.status(500).json({ success: false, message: err.message });
  }
};