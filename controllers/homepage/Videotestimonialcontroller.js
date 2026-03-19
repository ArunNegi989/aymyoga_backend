const Testimonial = require("../../models/homepage/testimonialModel");

/* ── MAX 3 VIDEO TESTIMONIALS ── */
const VIDEO_LIMIT = 3;

/* =========================
   CREATE VIDEO
========================= */
exports.create = async (req, res) => {
  try {
    const videoCount = await Testimonial.countDocuments({ type: "video" });
    if (videoCount >= VIDEO_LIMIT) {
      return res.status(400).json({
        success: false,
        message: `Only ${VIDEO_LIMIT} video testimonials allowed. Delete one to add a new video.`,
      });
    }

    const testimonial = await Testimonial.create({
      type: "video",
      name:       req.body.name,
      country:    req.body.country,
      flag:       req.body.flag,
      youtubeUrl: req.body.youtubeUrl,
      youtubeId:  req.body.youtubeId,
      course:     req.body.course,
      quote:      req.body.quote,
      rating:     Number(req.body.rating) || 5,
      sectionMeta: req.body.sectionMeta,
    });

    res.status(201).json({
      success: true,
      message: "Video testimonial created successfully",
      data: testimonial,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET ALL VIDEOS
========================= */
exports.getAll = async (req, res) => {
  try {
    const data = await Testimonial.find({ type: "video" }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET SINGLE VIDEO
========================= */
exports.getOne = async (req, res) => {
  try {
    const data = await Testimonial.findOne({ _id: req.params.id, type: "video" });
    if (!data) return res.status(404).json({ success: false, message: "Video testimonial not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE VIDEO
========================= */
exports.update = async (req, res) => {
  try {
    const existing = await Testimonial.findOne({ _id: req.params.id, type: "video" });
    if (!existing) return res.status(404).json({ success: false, message: "Video testimonial not found" });

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          type:       "video",
          name:       req.body.name       ?? existing.name,
          country:    req.body.country    ?? existing.country,
          flag:       req.body.flag       ?? existing.flag,
          youtubeUrl: req.body.youtubeUrl ?? existing.youtubeUrl,
          youtubeId:  req.body.youtubeId  ?? existing.youtubeId,
          course:     req.body.course     ?? existing.course,
          quote:      req.body.quote      ?? existing.quote,
          rating:     req.body.rating !== undefined ? Number(req.body.rating) : existing.rating,
          status:     req.body.status     ?? existing.status,
          order:      req.body.order      ?? existing.order,
          sectionMeta: req.body.sectionMeta ?? existing.sectionMeta,
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
   DELETE VIDEO
========================= */
exports.remove = async (req, res) => {
  try {
    const deleted = await Testimonial.findOneAndDelete({ _id: req.params.id, type: "video" });
    if (!deleted) return res.status(404).json({ success: false, message: "Video testimonial not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};