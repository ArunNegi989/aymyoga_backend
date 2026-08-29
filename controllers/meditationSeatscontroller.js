const MeditationSeats = require("../models/meditationSeatsModel");

/* ═══════════════════════════════
   GET ALL BATCHES
   GET /meditation-seats/get-all-batches
═══════════════════════════════ */
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await MeditationSeats.find().sort({ startDate: 1 });
    return res.status(200).json({
      success: true,
      data: batches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
      error: error.message,
    });
  }
};

/* ═══════════════════════════════
   GET SINGLE BATCH
   GET /meditation-seats/get-batch/:id
═══════════════════════════════ */
exports.getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await MeditationSeats.findById(id);

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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch batch",
      error: error.message,
    });
  }
};

/* ═══════════════════════════════
   CREATE BATCH
   POST /meditation-seats/create-batch
═══════════════════════════════ */
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
        message: "Missing required fields",
      });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const newBatch = await MeditationSeats.create({
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
      bookedSeats: bookedSeats ?? 0,
      note: note ?? "",
    });

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: newBatch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create batch",
      error: error.message,
    });
  }
};

/* ═══════════════════════════════
   UPDATE BATCH
   PUT /meditation-seats/update-batch/:id
═══════════════════════════════ */
exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
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

    const batch = await MeditationSeats.findById(id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    if (
      startDate &&
      endDate &&
      new Date(endDate) <= new Date(startDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    if (startDate !== undefined) batch.startDate = startDate;
    if (endDate !== undefined) batch.endDate = endDate;
    if (usdFee !== undefined) batch.usdFee = usdFee;
    if (inrFee !== undefined) batch.inrFee = inrFee;
    if (dormPrice !== undefined) batch.dormPrice = dormPrice;
    if (inrDormPrice !== undefined) batch.inrDormPrice = inrDormPrice;
    if (twinPrice !== undefined) batch.twinPrice = twinPrice;
    if (inrTwinPrice !== undefined) batch.inrTwinPrice = inrTwinPrice;
    if (privatePrice !== undefined) batch.privatePrice = privatePrice;
    if (inrPrivatePrice !== undefined) batch.inrPrivatePrice = inrPrivatePrice;
    if (totalSeats !== undefined) batch.totalSeats = totalSeats;
    if (bookedSeats !== undefined) batch.bookedSeats = bookedSeats;
    if (note !== undefined) batch.note = note;

    await batch.save();

    return res.status(200).json({
      success: true,
      message: "Batch updated successfully",
      data: batch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update batch",
      error: error.message,
    });
  }
};

/* ═══════════════════════════════
   DELETE BATCH
   DELETE /meditation-seats/delete-batch/:id
═══════════════════════════════ */
exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await MeditationSeats.findByIdAndDelete(id);

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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete batch",
      error: error.message,
    });
  }
};

/* ═══════════════════════════════
   INCREMENT BOOKED SEATS
   (call this internally from your registration/booking controller
   when a student submits the meditation registration form)
═══════════════════════════════ */
exports.incrementBookedSeat = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await MeditationSeats.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    if (batch.bookedSeats >= batch.totalSeats) {
      return res.status(400).json({
        success: false,
        message: "Batch is fully booked",
      });
    }

    batch.bookedSeats += 1;
    await batch.save();

    return res.status(200).json({
      success: true,
      message: "Seat booked successfully",
      data: batch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to book seat",
      error: error.message,
    });
  }
};