const ThreeHundredBatch = require("../../models/courses/threeHundredBatch.model");

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

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start and End dates are required",
      });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const batch = await ThreeHundredBatch.create({
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
      message: "Batch created successfully",
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
    const batches = await ThreeHundredBatch.find().sort({
      startDate: 1,
    });

    res.json({
      success: true,
      count: batches.length,
      data: batches,
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
exports.getSingleBatch = async (req, res) => {
  try {
    const batch = await ThreeHundredBatch.findById(req.params.id);

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
    const batch = await ThreeHundredBatch.findByIdAndUpdate(
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
      message: "Batch updated successfully",
      data: batch,
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
    const batch = await ThreeHundredBatch.findByIdAndDelete(
      req.params.id
    );

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
      message: "Error deleting batch",
    });
  }
};