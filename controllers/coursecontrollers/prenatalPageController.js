const PrenatalPage = require("../../models/courses/prenatalPageModel");

/* =========================
   HELPER
========================= */
const parseJSON = (field) => {
  try {
    return JSON.parse(field || "[]");
  } catch {
    return [];
  }
};

/* =========================
   BUILD DATA
========================= */
const buildData = (body, files) => {
  const data = {
    ...body,

    introExtraParagraphs: parseJSON(body.introExtraParagraphs),
    featuresExtraParagraphs: parseJSON(body.featuresExtraParagraphs),
    costsExtraParagraphs: parseJSON(body.costsExtraParagraphs),
    onlineExtraParagraphs: parseJSON(body.onlineExtraParagraphs),

    schedule: parseJSON(body.schedule),
    curriculum: parseJSON(body.curriculum),
    hoursSummary: parseJSON(body.hoursSummary),
  };

  /* IMAGES */
  if (files?.heroImage) {
    data.heroImage = "/uploads/" + files.heroImage[0].filename;
  }

  if (files?.locationImage) {
    data.locationImage = "/uploads/" + files.locationImage[0].filename;
  }

  /* HERO GRID */
  const heroGridAlts = parseJSON(body.heroGridAlts);
  const gridImages = [];

  for (let i = 0; i < 3; i++) {
    if (files[`heroGridImage${i}`]) {
      gridImages.push({
        url: "/uploads/" + files[`heroGridImage${i}`][0].filename,
        alt: heroGridAlts[i] || "",
      });
    }
  }

  if (gridImages.length) {
    data.heroGridImages = gridImages;
  }

  return data;
};

/* =========================
   CREATE
========================= */
exports.createPage = async (req, res) => {
  try {
    const existing = await PrenatalPage.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Page already exists. Use update instead.",
      });
    }

    const data = buildData(req.body, req.files);

    const created = await PrenatalPage.create(data);

    res.json({
      success: true,
      message: "Created successfully",
      data: created,
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
exports.updatePage = async (req, res) => {
  try {
    const existing = await PrenatalPage.findOne();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No page found to update",
      });
    }

    const data = buildData(req.body, req.files);

    const updated = await PrenatalPage.findByIdAndUpdate(
      existing._id,
      data,
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET
========================= */
exports.getPage = async (req, res) => {
  try {
    const page = await PrenatalPage.findOne();

    res.json({
      success: true,
      data: page,
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
exports.deletePage = async (req, res) => {
  try {
    const page = await PrenatalPage.findOne();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "No record found",
      });
    }

    await PrenatalPage.findByIdAndDelete(page._id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};