const Model = require("../models/studentVideoReviewModel");

/* =========================
   CREATE
========================= */
exports.create = async (req, res) => {
  try {
    const data = req.body;

 
    if (req.files) {
      if (req.files.thumbnail) {
        data.thumbnail = "/uploads/" + req.files.thumbnail[0].filename;
      }
      if (req.files.videoFile) {
        data.videoFile = "/uploads/" + req.files.videoFile[0].filename;
      }
    }

    const review = await Model.create(data);

    res.status(201).json({
      success: true,
      message: "Video review created",
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
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ONE
========================= */
exports.getOne = async (req, res) => {
  try {
    const review = await Model.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ success: true, data: review });
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

    if (req.files) {
      if (req.files.thumbnail) {
        data.thumbnail = "/uploads/" + req.files.thumbnail[0].filename;
      }
      if (req.files.videoFile) {
        data.videoFile = "/uploads/" + req.files.videoFile[0].filename;
      }
    }

    const updated = await Model.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
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
    await Model.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};