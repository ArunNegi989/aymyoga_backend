const Model = require("../../models/courses/kundaliniTTCModel");

/* =========================
   HELPERS
========================= */

// JSON parse safe + clean
const parseJSON = (val) => {
  try {
    const parsed = val ? JSON.parse(val) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

// ✅ IMAGE PATH FIX (IMPORTANT)
const getFilePath = (files, key) => {
  if (!files || !files[key]) return "";
  return `/uploads/${files[key][0].filename}`;
};

/* =========================
   CREATE (ONLY ONE RECORD)
========================= */
exports.create = async (req, res) => {
  try {
    const exists = await Model.findOne();

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Only one record allowed. Use update.",
      });
    }

    const body = req.body;

    const data = {
      ...body,

      // arrays
      whatIsParagraphs: parseJSON(body.whatIsParagraphs),
      activateParagraphs: parseJSON(body.activateParagraphs),
      eligibilityParagraphs: parseJSON(body.eligibilityParagraphs),
      locationParagraphs: parseJSON(body.locationParagraphs),

      syllabusModules: parseJSON(body.syllabusModules),
      benefitItems: parseJSON(body.benefitItems),
      highlightCards: parseJSON(body.highlightCards),
      readingItems: parseJSON(body.readingItems),
      facilityItems: parseJSON(body.facilityItems),
      scheduleItems: parseJSON(body.scheduleItems),
      whyCards: parseJSON(body.whyCards),
      typesItems: parseJSON(body.typesItems),
      refundItems: parseJSON(body.refundItems),

      // ✅ images FIXED
      heroImage: getFilePath(req.files, "heroImage"),
      classImage: getFilePath(req.files, "classImage"),
      schedImg1: getFilePath(req.files, "schedImg1"),
      schedImg2: getFilePath(req.files, "schedImg2"),
    };

    const newData = await Model.create(data);

    res.json({
      success: true,
      message: "Created successfully",
      data: newData,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.get = async (req, res) => {
  try {
    const data = await Model.findOne();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    const existing = await Model.findOne();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No record found",
      });
    }

    const body = req.body;

    const updatedData = {
      ...body,

      // arrays
      whatIsParagraphs: parseJSON(body.whatIsParagraphs),
      activateParagraphs: parseJSON(body.activateParagraphs),
      eligibilityParagraphs: parseJSON(body.eligibilityParagraphs),
      locationParagraphs: parseJSON(body.locationParagraphs),

      syllabusModules: parseJSON(body.syllabusModules),
      benefitItems: parseJSON(body.benefitItems),
      highlightCards: parseJSON(body.highlightCards),
      readingItems: parseJSON(body.readingItems),
      facilityItems: parseJSON(body.facilityItems),
      scheduleItems: parseJSON(body.scheduleItems),
      whyCards: parseJSON(body.whyCards),
      typesItems: parseJSON(body.typesItems),
      refundItems: parseJSON(body.refundItems),
    };

    // ✅ IMAGE UPDATE FIX
    if (req.files?.heroImage) {
      updatedData.heroImage = getFilePath(req.files, "heroImage");
    }

    if (req.files?.classImage) {
      updatedData.classImage = getFilePath(req.files, "classImage");
    }

    if (req.files?.schedImg1) {
      updatedData.schedImg1 = getFilePath(req.files, "schedImg1");
    }

    if (req.files?.schedImg2) {
      updatedData.schedImg2 = getFilePath(req.files, "schedImg2");
    }

    const updated = await Model.findByIdAndUpdate(
      existing._id,
      updatedData,
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
   DELETE (SINGLE RECORD)
========================= */
exports.delete = async (req, res) => {
  try {
    const existing = await Model.findOne();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No record found",
      });
    }

    await Model.findByIdAndDelete(existing._id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};