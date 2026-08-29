const SoundHealingSeat = require("../models/soundHealingSeatsModel");

/* ── GET all batches (sorted by upcoming start date) ── */
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await SoundHealingSeat.find().sort({ startDate: 1 });
    return res.status(200).json({ success: true, data: batches });
  } catch (error) {
    console.error("getAllBatches error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch batches" });
  }
};

/* ── GET single batch by id ── */
exports.getBatchById = async (req, res) => {
  try {
    const batch = await SoundHealingSeat.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
    return res.status(200).json({ success: true, data: batch });
  } catch (error) {
    console.error("getBatchById error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch batch" });
  }
};

/* ── POST — create batch ── */
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

    const created = await SoundHealingSeat.create({
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

    return res.status(201).json({ success: true, message: "Batch created", data: created });
  } catch (error) {
    console.error("createBatch error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create batch" });
  }
};

/* ── PUT — update batch ── */
exports.updateBatch = async (req, res) => {
  try {
    const existing = await SoundHealingSeat.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Batch not found" });

    const updated = await SoundHealingSeat.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: "Batch updated", data: updated });
  } catch (error) {
    console.error("updateBatch error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update batch" });
  }
};

/* ── DELETE batch ── */
exports.deleteBatch = async (req, res) => {
  try {
    const existing = await SoundHealingSeat.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Batch not found" });

    await SoundHealingSeat.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: "Batch deleted" });
  } catch (error) {
    console.error("deleteBatch error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete batch" });
  }
};

/* ── (Optional helper for registration flow) increment bookedSeats by 1, guarding against overbooking ── */
exports.incrementBookedSeat = async (req, res) => {
  try {
    const batch = await SoundHealingSeat.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

    if (batch.bookedSeats >= batch.totalSeats) {
      return res.status(400).json({ success: false, message: "This batch is fully booked" });
    }

    batch.bookedSeats += 1;
    await batch.save();

    return res.status(200).json({ success: true, message: "Seat booked", data: batch });
  } catch (error) {
    console.error("incrementBookedSeat error:", error);
    return res.status(500).json({ success: false, message: "Failed to book seat" });
  }
};