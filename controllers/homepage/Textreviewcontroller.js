const Testimonial = require("../../models/homepage/testimonialModel");

/* =========================
   CREATE TEXT REVIEW
========================= */
exports.create = async (req, res) => {
  try {
    /* avatarSrc: file upload takes priority, else URL from body */
    let avatarSrc = req.body.avatarSrc ?? "";
    if (req.file) {
      avatarSrc = `/uploads/${req.file.filename}`;
    }

    const testimonial = await Testimonial.create({
      type:       "text",
      name:       req.body.name,
      role:       req.body.role,
      avatarSrc,
      quote:      req.body.quote,
      rating:     Number(req.body.rating) || 5,
      sectionMeta: req.body.sectionMeta
        ? (typeof req.body.sectionMeta === "string"
            ? JSON.parse(req.body.sectionMeta)
            : req.body.sectionMeta)
        : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Text review created successfully",
      data: testimonial,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET ALL TEXT REVIEWS
========================= */
exports.getAll = async (req, res) => {
  try {
    const data = await Testimonial.find({ type: "text" }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET SINGLE TEXT REVIEW
========================= */
exports.getOne = async (req, res) => {
  try {
    const data = await Testimonial.findOne({ _id: req.params.id, type: "text" });
    if (!data) return res.status(404).json({ success: false, message: "Text review not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE TEXT REVIEW
========================= */
exports.update = async (req, res) => {
  try {
    const existing = await Testimonial.findOne({ _id: req.params.id, type: "text" });
    if (!existing) return res.status(404).json({ success: false, message: "Text review not found" });

    /* avatarSrc: new file > URL from body > keep existing */
    let avatarSrc = existing.avatarSrc;
    if (req.file) {
      avatarSrc = `/uploads/${req.file.filename}`;
    } else if (req.body.avatarSrc !== undefined) {
      avatarSrc = req.body.avatarSrc;
    }

    const sectionMeta = req.body.sectionMeta
      ? (typeof req.body.sectionMeta === "string"
          ? JSON.parse(req.body.sectionMeta)
          : req.body.sectionMeta)
      : existing.sectionMeta;

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          type:       "text",
          name:       req.body.name   ?? existing.name,
          role:       req.body.role   ?? existing.role,
          avatarSrc,
          quote:      req.body.quote  ?? existing.quote,
          rating:     req.body.rating !== undefined ? Number(req.body.rating) : existing.rating,
          status:     req.body.status ?? existing.status,
          order:      req.body.order  ?? existing.order,
          sectionMeta,
        },
      },
      { new: true, runValidators: false }
    );

    res.json({ success: true, message: "Updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   DELETE TEXT REVIEW
========================= */
exports.remove = async (req, res) => {
  try {
    const deleted = await Testimonial.findOneAndDelete({ _id: req.params.id, type: "text" });
    if (!deleted) return res.status(404).json({ success: false, message: "Text review not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};