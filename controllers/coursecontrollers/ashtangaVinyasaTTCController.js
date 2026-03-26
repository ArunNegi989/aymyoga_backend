const Model = require("../../models/courses/ashtangaVinyasaTTCModel");

/* =========================
   HELPERS
========================= */

// ✅ JSON parser — handles both JSON string arrays AND plain strings
const parseJSON = (val) => {
  try {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return typeof val === "string" ? JSON.parse(val) : val;
  } catch {
    return [];
  }
};

// ✅ File handler
const getFile = (files, key) => {
  if (!files || !files[key]) return null;
  return "/uploads/" + files[key][0].filename;
};

/* =========================
   CREATE (ONLY ONE RECORD)
========================= */
exports.create = async (req, res) => {
  try {
    const existing = await Model.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Record already exists. Please edit instead.",
      });
    }

    const body = req.body;

    const newData = new Model({
      ...body,

      learnItems: parseJSON(body.learnItems),
      whoItems: parseJSON(body.whoItems),
      testimonials: parseJSON(body.testimonials),

      // ✅ FIX: Frontend now sends these as JSON strings, not bracket notation
      certTeachersParagraphs: parseJSON(body.certTeachersParagraphs),
      communityParagraphs: parseJSON(body.communityParagraphs),
      accommodationParagraphs: parseJSON(body.accommodationParagraphs),

      heroImage: getFile(req.files, "heroImage"),
      promoImage: getFile(req.files, "promoImage"),
    });

    await newData.save();

    res.json({
      success: true,
      message: "Created successfully",
      data: newData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.getSingle = async (req, res) => {
  try {
    const data = await Model.findOne();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
        message: "No record found. Please create first.",
      });
    }

    const body = req.body;

    const updateData = {
      ...body,

      learnItems: parseJSON(body.learnItems),
      whoItems: parseJSON(body.whoItems),
      testimonials: parseJSON(body.testimonials),

      // ✅ FIX: Frontend now sends these as JSON strings, not bracket notation
      certTeachersParagraphs: parseJSON(body.certTeachersParagraphs),
      communityParagraphs: parseJSON(body.communityParagraphs),
      accommodationParagraphs: parseJSON(body.accommodationParagraphs),
    };

    if (req.files?.heroImage) {
      updateData.heroImage = getFile(req.files, "heroImage");
    }

    if (req.files?.promoImage) {
      updateData.promoImage = getFile(req.files, "promoImage");
    }

    const updated = await Model.findByIdAndUpdate(
      existing._id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE
========================= */
exports.delete = async (req, res) => {
  try {
    const existing = await Model.findOne();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No record to delete",
      });
    }

    await Model.findByIdAndDelete(existing._id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};