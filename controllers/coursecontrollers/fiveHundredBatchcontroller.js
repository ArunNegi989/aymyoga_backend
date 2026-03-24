const FiveHundredBatch = require("../../models/courses/500hrSeats.model");

/* =========================
   CREATE
========================= */
exports.createBatch = async (req, res) => {
  try {
    const batch = await FiveHundredBatch.create(req.body);

    res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL
========================= */
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await FiveHundredBatch.find().sort({ startDate: 1 });

    res.json({
      success: true,
      data: batches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.getSingleBatch = async (req, res) => {
  try {
    const batch = await FiveHundredBatch.findById(req.params.id);

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
      message: error.message,
    });
  }
};

/* =========================
   UPDATE
========================= */
exports.updateBatch = async (req, res) => {
  try {
    const batch = await FiveHundredBatch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.json({
      success: true,
      message: "Batch updated",
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE
========================= */
exports.deleteBatch = async (req, res) => {
  try {
    const batch = await FiveHundredBatch.findByIdAndDelete(req.params.id);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};