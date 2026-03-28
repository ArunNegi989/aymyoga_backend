const PrenatalSeats = require("../../models/courses/prenatalSeatsModel");

/* =========================
   CREATE
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

    /* ✅ VALIDATION */
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start & End date required" });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    if (!usdFee || !inrFee) {
      return res.status(400).json({
        message: "Fees are required",
      });
    }

    if (!dormPrice || !twinPrice || !privatePrice) {
      return res.status(400).json({
        message: "Room prices required",
      });
    }

    if (!totalSeats || totalSeats < 1) {
      return res.status(400).json({
        message: "Total seats must be at least 1",
      });
    }

    /* ✅ DUPLICATE CHECK */
    const existing = await PrenatalSeats.findOne({
      startDate,
      endDate,
    });

    if (existing) {
      return res.status(400).json({
        message: "Batch already exists for these dates",
      });
    }

    /* ✅ CREATE */
    const newBatch = await PrenatalSeats.create({
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
      data: newBatch,
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
   GET ALL
========================= */
exports.getAll = async (req, res) => {
  try {
    const batches = await PrenatalSeats.find().sort({ startDate: 1 });

    /* ✅ ADD AVAILABLE SEATS */
    const updated = batches.map((b) => ({
      ...b._doc,
      availableSeats: b.totalSeats - b.bookedSeats,
    }));

    res.json({
      success: true,
      count: updated.length,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching batches",
    });
  }
};

/* =========================
   GET ONE
========================= */
exports.getOne = async (req, res) => {
  try {
    const batch = await PrenatalSeats.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.json({
      success: true,
      data: {
        ...batch._doc,
        availableSeats: batch.totalSeats - batch.bookedSeats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching batch",
    });
  }
};

/* =========================
   UPDATE
========================= */
exports.updateBatch = async (req, res) => {
  try {
    const updated = await PrenatalSeats.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.json({
      success: true,
      message: "Batch updated successfully",
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
   DELETE
========================= */
exports.deleteBatch = async (req, res) => {
  try {
    const deleted = await PrenatalSeats.findByIdAndDelete(req.params.id);

    if (!deleted) {
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

/* =========================
   BOOK SEAT (🔥 IMPORTANT)
========================= */
exports.bookSeat = async (req, res) => {
  try {
    const { batchId } = req.body;

    const batch = await PrenatalSeats.findById(batchId);

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    /* ❌ OVERBOOKING STOP */
    if (batch.bookedSeats >= batch.totalSeats) {
      return res.status(400).json({
        message: "All seats are booked",
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
      message: error.message,
    });
  }
};