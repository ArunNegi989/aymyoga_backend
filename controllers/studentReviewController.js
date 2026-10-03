const Model = require("../models/studentReviewModel");

/* =========================
   CREATE
========================= */
exports.create = async (req, res) => {
  try {
    const data = req.body;

    if (data.date) {
      data.date = new Date(data.date);
    }

    const review = await Model.create(data);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ALL
========================= */
exports.getAll = async (req, res) => {
  try {
    const reviews = await Model.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.getOne = async (req, res) => {
  try {
    const review = await Model.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    const data = req.body;

    if (data.date) {
      data.date = new Date(data.date);
    }

    const review = await Model.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE
========================= */
exports.delete = async (req, res) => {
  try {
    const review = await Model.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
