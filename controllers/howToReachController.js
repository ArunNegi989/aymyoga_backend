const HowToReachSection = require("../models/HowToReachSection");

/* Fields the admin form actually submits — everything else on req.body is ignored */
const ALLOWED_FIELDS = [
  "badgeText",
  "mainTitle",
  "subTitle",
  "whatsappNumber",
  "whatsappMessage",
  "travelCards",
  "pickupTitle",
  "pickupSubtitle",
  "pickupDesc",
  "pickupHighlights",
  "pickupBookBtnText",
  "pickupWhatsappBtnText",
  "mapLabel",
  "mapEmbedSrc",
  "mapDirectionsText",
  "mapDirectionsUrl",
];

function pickAllowed(body) {
  const payload = {};
  ALLOWED_FIELDS.forEach((key) => {
    if (body[key] !== undefined) payload[key] = body[key];
  });
  return payload;
}

/* ===========================
   GET /how-to-reach-section
   (singleton — list page expects an array or a single object;
    we return the one document that should exist)
=========================== */
exports.getSections = async (req, res) => {
  try {
    const sections = await HowToReachSection.find().sort({ createdAt: -1 });
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   GET /how-to-reach-section/:id
=========================== */
exports.getSectionById = async (req, res) => {
  try {
    const section = await HowToReachSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "How To Reach section not found" });
    }
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   POST /how-to-reach-section
   (singleton — refuse a second document; edit the existing one instead)
=========================== */
exports.createSection = async (req, res) => {
  try {
    const existing = await HowToReachSection.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A How To Reach section already exists. Please edit the existing one instead.",
      });
    }

    const payload = pickAllowed(req.body);
    const section = await HowToReachSection.create(payload);
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   PUT /how-to-reach-section/:id
=========================== */
exports.updateSection = async (req, res) => {
  try {
    const payload = pickAllowed(req.body);

    const section = await HowToReachSection.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true, context: "query" }
    );

    if (!section) {
      return res.status(404).json({ success: false, message: "How To Reach section not found" });
    }

    res.json({ success: true, data: section });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE /how-to-reach-section/:id
=========================== */
exports.deleteSection = async (req, res) => {
  try {
    const section = await HowToReachSection.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "How To Reach section not found" });
    }
    res.json({ success: true, message: "How To Reach section deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};