// FILE: controllers/yogaBeginnerSeatController.js
const YogaBeginnerSeat = require("../models/YogaBeginnerSeat");

/* ══════════════════════════════
   CREATE BATCH
══════════════════════════════ */
exports.createBatch = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      usdFee,
      inrFee,
      dormPrice,
      inrDormPrice,
      twinPrice,
      inrTwinPrice,
      privatePrice,
      inrPrivatePrice,
      totalSeats,
      bookedSeats,
      note,
    } = req.body;

    if (
      !startDate ||
      !endDate ||
      !usdFee ||
      !inrFee ||
      dormPrice === undefined ||
      inrDormPrice === undefined ||
      twinPrice === undefined ||
      inrTwinPrice === undefined ||
      privatePrice === undefined ||
      inrPrivatePrice === undefined ||
      !totalSeats
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const batch = await YogaBeginnerSeat.create({
      startDate,
      endDate,
      usdFee,
      inrFee,
      dormPrice: Number(dormPrice),
      inrDormPrice: Number(inrDormPrice),
      twinPrice: Number(twinPrice),
      inrTwinPrice: Number(inrTwinPrice),
      privatePrice: Number(privatePrice),
      inrPrivatePrice: Number(inrPrivatePrice),
      totalSeats: Number(totalSeats),
      bookedSeats: Number(bookedSeats) || 0,
      note: note || "",
    });

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to create batch",
    });
  }
};

/* ══════════════════════════════
   GET ALL BATCHES
══════════════════════════════ */
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await YogaBeginnerSeat.find().sort({ startDate: 1 });
    return res.status(200).json({
      success: true,
      data: batches,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
    });
  }
};

/* ══════════════════════════════
   GET SINGLE BATCH (edit page)
══════════════════════════════ */
exports.getBatchById = async (req, res) => {
  try {
    const batch = await YogaBeginnerSeat.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid batch id",
    });
  }
};

/* ══════════════════════════════
   UPDATE BATCH
══════════════════════════════ */
exports.updateBatch = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      usdFee,
      inrFee,
      dormPrice,
      inrDormPrice,
      twinPrice,
      inrTwinPrice,
      privatePrice,
      inrPrivatePrice,
      totalSeats,
      bookedSeats,
      note,
    } = req.body;

    const batch = await YogaBeginnerSeat.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    if (startDate !== undefined) batch.startDate = startDate;
    if (endDate !== undefined) batch.endDate = endDate;
    if (usdFee !== undefined) batch.usdFee = usdFee;
    if (inrFee !== undefined) batch.inrFee = inrFee;
    if (dormPrice !== undefined) batch.dormPrice = Number(dormPrice);
    if (inrDormPrice !== undefined) batch.inrDormPrice = Number(inrDormPrice);
    if (twinPrice !== undefined) batch.twinPrice = Number(twinPrice);
    if (inrTwinPrice !== undefined) batch.inrTwinPrice = Number(inrTwinPrice);
    if (privatePrice !== undefined) batch.privatePrice = Number(privatePrice);
    if (inrPrivatePrice !== undefined) batch.inrPrivatePrice = Number(inrPrivatePrice);
    if (totalSeats !== undefined) batch.totalSeats = Number(totalSeats);
    if (bookedSeats !== undefined) batch.bookedSeats = Number(bookedSeats);
    if (note !== undefined) batch.note = note;

    await batch.save();

    return res.status(200).json({
      success: true,
      message: "Batch updated successfully",
      data: batch,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to update batch",
    });
  }
};

/* ══════════════════════════════
   DELETE BATCH
══════════════════════════════ */
exports.deleteBatch = async (req, res) => {
  try {
    const batch = await YogaBeginnerSeat.findByIdAndDelete(req.params.id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid batch id",
    });
  }
};

/* ══════════════════════════════
   INCREMENT BOOKED SEATS
   (registration form submit hone par call karo)
══════════════════════════════ */
exports.incrementBookedSeat = async (req, res) => {
  try {
    const batch = await YogaBeginnerSeat.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    if (batch.bookedSeats >= batch.totalSeats) {
      return res.status(400).json({
        success: false,
        message: "This batch is fully booked",
      });
    }

    batch.bookedSeats += 1;
    await batch.save();

    return res.status(200).json({
      success: true,
      message: "Seat booked successfully",
      data: batch,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Failed to book seat",
    });
  }
};