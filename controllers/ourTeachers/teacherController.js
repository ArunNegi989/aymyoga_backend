const Teacher = require("../../models/ourTeachers/teacherModel");

/* =========================
   CREATE
========================= */
exports.create = async (req, res) => {
  try {
    const body = req.body;

    // Image
    if (req.file) {
      body.image = `/uploads/${req.file.filename}`;
    }

    // Convert arrays
   body.bio = req.body.bio ? Object.values(req.body.bio) : [];
body.education = req.body.education ? Object.values(req.body.education) : [];
body.expertise = req.body.expertise ? Object.values(req.body.expertise) : [];

    const teacher = await Teacher.create(body);

    res.status(201).json({
      success: true,
      data: teacher,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET ALL
========================= */
exports.getAll = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ order: 1 });

    res.json({
      success: true,
      data: teachers,
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
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({
      success: true,
      data: teacher,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    const body = { ...req.body };

    /* =========================
       IMAGE HANDLING (FIX)
    ========================= */
    if (req.file) {
      body.image = `/uploads/${req.file.filename}`;
    } else if (req.body.existingImage) {
      body.image = req.body.existingImage;
    }

    /* =========================
       ARRAY HANDLING (SAFE)
    ========================= */
    if (req.body.bio) {
      body.bio = Object.values(req.body.bio);
    }

    if (req.body.education) {
      body.education = Object.values(req.body.education);
    }

    if (req.body.expertise) {
      body.expertise = Object.values(req.body.expertise);
    }

    /* =========================
       UPDATE
    ========================= */
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      body,
      {
        new: true,
        runValidators: true,   // 🔥 important
      }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.json({
      success: true,
      data: teacher,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
/* =========================
   DELETE
========================= */
exports.remove = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};