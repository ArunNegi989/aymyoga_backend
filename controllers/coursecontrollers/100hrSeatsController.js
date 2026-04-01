const Seats = require("../../models/courses/100hrSeatsModel");

/* =========================
   CREATE
========================= */
exports.create = async (req, res) => {
  try {
    const data = req.body;

    const newSeat = await Seats.create({
      startDate: data.startDate,
      endDate: data.endDate,
      usdFee: data.usdFee,
      inrFee: data.inrFee,
      dormPrice: data.dormPrice,
      twinPrice: data.twinPrice,
      privatePrice: data.privatePrice,
      totalSeats: data.totalSeats,
      bookedSeats: data.bookedSeats || 0,
      note: data.note,
    });

    res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: newSeat,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET ALL
========================= */
exports.getAll = async (req, res) => {
  try {
    const data = await Seats.find().sort({ startDate: 1 });

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET ONE
========================= */
exports.getOne = async (req, res) => {
  try {
    const item = await Seats.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    const updated = await Seats.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   DELETE
========================= */
exports.remove = async (req, res) => {
  try {
    await Seats.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



/* =========================
   BOOK SEAT (🔥 NEW)
========================= */
exports.bookSeat = async (req, res) => {
  try {
    const { id } = req.params; // ✅ from URL: /book-seat/:id

    const batch = await Seats.findById(id);

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
      message: "Seat booked successfully ✅",
      data: batch,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};