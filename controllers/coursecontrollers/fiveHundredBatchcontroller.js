const FiveHundredBatch = require("../../models/courses/500hrSeats.model");

/* =========================
   CREATE
========================= */
exports.createBatch = async (req, res) => {
  try {
    const data = req.body;

    const batch = await FiveHundredBatch.create({
      startDate: data.startDate,
      endDate: data.endDate,
      usdFee: data.usdFee,
      inrFee: data.inrFee || "",
      dormPrice: data.dormPrice,
      inrDormPrice: data.inrDormPrice || 0,
      twinPrice: data.twinPrice,
      inrTwinPrice: data.inrTwinPrice || 0,
      privatePrice: data.privatePrice,
      inrPrivatePrice: data.inrPrivatePrice || 0,
      totalSeats: data.totalSeats || 50,
      bookedSeats: 0,
      note: data.note || "",
    });

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

/* =========================
   BOOK SEAT
========================= */
exports.bookSeat = async (req, res) => {
  try {
    const batch = await FiveHundredBatch.findById(req.params.id);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};