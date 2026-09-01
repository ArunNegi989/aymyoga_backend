// FILE: src/controllers/coursecontrollers/onlineSeatsController.js

const Seats = require("../../models/courses/Onlineseatsmode");

/* =========================
   CREATE
========================= */
exports.create = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      usd200,
      inr200,
      usd300,
      inr300,
      totalSeats,
      note,
    } = req.body;

    const newBatch = await Seats.create({
      startDate,
      endDate,
      usd200,
      inr200,
      usd300,
      inr300,
      totalSeats,
      bookedSeats: 0,
      note: note || "",
    });

    res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: newBatch,
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
   (sirf future + aaj ke batches)
========================= */
exports.getAll = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await Seats.find({
      endDate: { $gte: today },
    }).sort({ startDate: 1 });

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
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
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
    const {
      startDate,
      endDate,
      usd200,
      inr200,
      usd300,
      inr300,
      totalSeats,
      bookedSeats,
      note,
    } = req.body;

    const updated = await Seats.findByIdAndUpdate(
      req.params.id,
      {
        startDate,
        endDate,
        usd200,
        inr200,
        usd300,
        inr300,
        totalSeats,
        bookedSeats,
        note,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

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
    const deleted = await Seats.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   BOOK SEAT
   (registration form submit hone par call hoga)
========================= */
exports.bookSeat = async (req, res) => {
  try {
    const { id } = req.params;

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
        message: "No seats available in this batch",
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
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};