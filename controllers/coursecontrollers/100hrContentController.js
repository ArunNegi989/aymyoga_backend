const Content = require("../../models/courses/100hrContentModel");

/* =========================
   HELPER: PARSE BODY
========================= */
const parseBody = (req) => {
  let body = req.body;
  if (typeof body.data === "string") {
    body = JSON.parse(body.data);
  }
  return body;
};

/* =========================
   CREATE (ONLY ONE ALLOWED)
========================= */
exports.create = async (req, res) => {
  try {
    let body = parseBody(req);

    const existing = await Content.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Content already exists",
      });
    }

    /* IMAGE HANDLING */
    if (req.files?.bannerImage) {
      body.bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
    } else if (req.body.bannerImageUrl) {
      body.bannerImage = req.body.bannerImageUrl;
    }

    if (req.files?.scheduleImage) {
      body.scheduleImage = `/uploads/${req.files.scheduleImage[0].filename}`;
    } else if (req.body.scheduleImageUrl) {
      body.scheduleImage = req.body.scheduleImageUrl;
    }

    if (req.files?.soulShineImage) {
      body.soulShineImage = `/uploads/${req.files.soulShineImage[0].filename}`;
    } else if (req.body.soulShineImageUrl) {
      body.soulShineImage = req.body.soulShineImageUrl;
    }

    const content = await Content.create(body);

    res.status(201).json({
      success: true,
      message: "Content created successfully",
      data: content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Create failed",
    });
  }
};

/* =========================
   GET (SINGLE)
========================= */
exports.get = async (req, res) => {
  try {
    const content = await Content.findOne();

    res.json({
      success: true,
      data: content,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetch failed",
    });
  }
};

/* =========================
   GET BY ID (OPTIONAL)
========================= */
exports.getById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetch by ID failed",
    });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    let body = parseBody(req);

    const content = await Content.findOne();
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    /* IMAGE UPDATE */
    if (req.files?.bannerImage) {
      body.bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
    }

    if (req.files?.scheduleImage) {
      body.scheduleImage = `/uploads/${req.files.scheduleImage[0].filename}`;
    }

    if (req.files?.soulShineImage) {
      body.soulShineImage = `/uploads/${req.files.soulShineImage[0].filename}`;
    }

    const updated = await Content.findByIdAndUpdate(
      content._id,
      body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Content updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/* =========================
   DELETE (⚠ ONLY ONE RECORD)
========================= */
exports.delete = async (req, res) => {
  try {
    const content = await Content.findOne();

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    await Content.findByIdAndDelete(content._id);

    res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

/* =========================
   RESET (DELETE + CLEAN START)
========================= */
exports.reset = async (req, res) => {
  try {
    await Content.deleteMany();

    res.json({
      success: true,
      message: "All content reset successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Reset failed",
    });
  }
};