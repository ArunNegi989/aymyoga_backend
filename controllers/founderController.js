const Founder = require("../models/founderModel");
const fs = require("fs");
const path = require("path");

/* =========================
   HELPER: DELETE FILE
========================= */
const deleteFile = (filePath) => {
  if (!filePath) return;

  const fileName = filePath.replace("/uploads/", "");
  const fullPath = path.join(__dirname, "../../uploads", fileName);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

/* =========================
   CREATE (ONLY ONE)
========================= */
exports.create = async (req, res) => {
  try {
    const exists = await Founder.findOne();
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Founder already exists",
      });
    }

    const body = req.body;

    // BIO ARRAY FIX
    let bio = [];
    if (body.bio) {
      if (Array.isArray(body.bio)) bio = body.bio;
      else bio = Object.values(body.bio);
    }

    const founder = await Founder.create({
      name: body.name,
      subtitle: body.subtitle,
      sectionLabel: body.sectionLabel,
      estYear: body.estYear,
      ctaText: body.ctaText,
      bio,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json({
      success: true,
      data: founder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET (ONLY ONE)
========================= */
exports.getFounder = async (req, res) => {
  try {
    const founder = await Founder.findOne();

    res.status(200).json({
      success: true,
      data: founder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    const founder = await Founder.findById(req.params.id);

    if (!founder) {
      return res.status(404).json({
        success: false,
        message: "Founder not found",
      });
    }

    const body = req.body;

    // BIO FIX
    let bio = [];
    if (body.bio) {
      if (Array.isArray(body.bio)) bio = body.bio;
      else bio = Object.values(body.bio);
    }

    // IMAGE UPDATE
    if (req.file) {
      deleteFile(founder.image);
      founder.image = `/uploads/${req.file.filename}`;
    }

    founder.name = body.name || founder.name;
    founder.subtitle = body.subtitle || founder.subtitle;
    founder.sectionLabel = body.sectionLabel || founder.sectionLabel;
    founder.estYear = body.estYear || founder.estYear;
    founder.ctaText = body.ctaText || founder.ctaText;
    founder.bio = bio.length ? bio : founder.bio;

    await founder.save();

    res.status(200).json({
      success: true,
      data: founder,
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
    const founder = await Founder.findOne();

    if (!founder) {
      return res.status(404).json({
        success: false,
        message: "Founder not found",
      });
    }

    deleteFile(founder.image);

    await founder.deleteOne();

    res.status(200).json({
      success: true,
      message: "Founder deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};