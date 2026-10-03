const path = require("path");
const fs = require("fs");
const YogaBeginnersSection = require("../models/YogaBeginnersSection");

/* ── Helpers ── */
const safeParse = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const filePathOf = (file) => (file ? `/uploads/${file.filename}` : "");

const deleteFileSafe = (relativePath) => {
  if (!relativePath) return;
  try {
    const abs = path.join(process.cwd(), relativePath.replace(/^\//, ""));
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (err) {
    console.error("Failed to delete file:", relativePath, err.message);
  }
};

const buildPayload = (body, files, existing = null) => {
  const heroFile = files?.heroImage?.[0];
  const secondFile = files?.secondImage?.[0];

  const heroImage = heroFile ? filePathOf(heroFile) : existing?.heroImage || "";
  const secondImage = secondFile
    ? filePathOf(secondFile)
    : existing?.secondImage || "";

  if (heroFile && existing?.heroImage) deleteFileSafe(existing.heroImage);
  if (secondFile && existing?.secondImage) deleteFileSafe(existing.secondImage);

  return {
    heroImage,
    heroImageAlt: body.heroImageAlt || "Yoga Students Group",

    mainTitle: body.mainTitle || "",
    questionText: body.questionText || "",
    bodyParagraphs: safeParse(body.bodyParagraphs, []),
    infoRow: safeParse(body.infoRow, []),

    secondImage,
    secondImageAlt: body.secondImageAlt || "",

    benefitsFullTitle: body.benefitsFullTitle || "",
    understandingTitle: body.understandingTitle || "",
    understandingIntro: body.understandingIntro || "",
    pillars: safeParse(body.pillars, []),

    benefitsLabel: body.benefitsLabel || "",
    benefits: safeParse(body.benefits, []),

    qaSectionTitle: body.qaSectionTitle || "",
    qaItems: safeParse(body.qaItems, []),

    moreInfoSectionTitle: body.moreInfoSectionTitle || "",
    infoCards: safeParse(body.infoCards, []),
    noteText: body.noteText || "",

    batchSectionTag: body.batchSectionTag || "",
    batchSectionTitle: body.batchSectionTitle || "",
    batchSectionSub: body.batchSectionSub || "",
  };
};

exports.getAll = async (req, res) => {
  try {
    const docs = await YogaBeginnersSection.find()
      .sort({ createdAt: -1 })
      .limit(1);
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ── GET one by id ── */
exports.getById = async (req, res) => {
  try {
    const doc = await YogaBeginnersSection.findById(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Yoga Beginners section not found" });
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const existing = await YogaBeginnersSection.findOne();

    if (existing) {
      const payload = buildPayload(req.body, req.files, existing);
      Object.assign(existing, payload);
      await existing.save();
      return res.json({
        success: true,
        message: "Yoga Beginners section updated",
        data: existing,
      });
    }

    const payload = buildPayload(req.body, req.files, null);
    const doc = await YogaBeginnersSection.create(payload);
    res
      .status(201)
      .json({
        success: true,
        message: "Yoga Beginners section created",
        data: doc,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ── UPDATE by id ── */
exports.update = async (req, res) => {
  try {
    const existing = await YogaBeginnersSection.findById(req.params.id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Yoga Beginners section not found" });
    }

    const payload = buildPayload(req.body, req.files, existing);
    Object.assign(existing, payload);
    await existing.save();

    res.json({
      success: true,
      message: "Yoga Beginners section updated",
      data: existing,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ── DELETE by id ── */
exports.remove = async (req, res) => {
  try {
    const doc = await YogaBeginnersSection.findById(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Yoga Beginners section not found" });
    }

    // Clean up uploaded files
    deleteFileSafe(doc.heroImage);
    deleteFileSafe(doc.secondImage);

    await doc.deleteOne();
    res.json({ success: true, message: "Yoga Beginners section deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
