const Model = require("../../models/courses/kundaliniSeatsModel");

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
        message: "Start and End date required",
      });
    }

    const data = await Model.create({
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
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL BATCHES
========================= */
exports.getAll = async (req, res) => {
  try {
    const data = await Model.find().sort({ startDate: 1 });

    res.json({
      success: true,
      data,
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
exports.getOne = async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.json({ success: true, data });
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
exports.update = async (req, res) => {
  try {
    const data = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated successfully",
      data,
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
exports.remove = async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};