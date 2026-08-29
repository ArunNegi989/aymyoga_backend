const path = require("path");
const fs = require("fs");
const YogaRetreatSection = require("../models/YogaRetreatSection");

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

/**
 * Builds the full document payload from req.body + req.files.
 * `existing` (optional) is the current DB doc, used on update to
 * preserve images that weren't replaced, and to know which old
 * files to clean up when they ARE replaced.
 */
const buildPayload = (body, files, existing = null) => {
  const heroFile = files?.heroImage?.[0];
  const s1File = files?.s1Image?.[0];

  const heroImage = heroFile ? filePathOf(heroFile) : existing?.heroImage || "";
  const s1Image = s1File ? filePathOf(s1File) : existing?.s1Image || "";

  // Clean up replaced files
  if (heroFile && existing?.heroImage) deleteFileSafe(existing.heroImage);
  if (s1File && existing?.s1Image) deleteFileSafe(existing.s1Image);

  const photoStripRaw = safeParse(body.photoStrip, existing?.photoStrip || []);
  const photoStrip = photoStripRaw.map((item, i) => {
    const uploaded = files?.[`photoStripImage_${i}`]?.[0];
    const oldImage = existing?.photoStrip?.[i]?.image || "";
    if (uploaded && oldImage) deleteFileSafe(oldImage);
    return {
      label: item.label || "",
      image: uploaded ? filePathOf(uploaded) : item.image || oldImage || "",
    };
  });

  return {
    heroImage,
    heroImageAlt: body.heroImageAlt || "Yoga Students Group",
    pageTitle: body.pageTitle || "",

    s1Paragraphs: safeParse(body.s1Paragraphs, []),
    s1Stats: safeParse(body.s1Stats, []),
    s1Image,
    s1PanelTags: safeParse(body.s1PanelTags, []),
    s1Caption: body.s1Caption || "",

    s2Title: body.s2Title || "",
    s2Intro: body.s2Intro || "",
    packages: safeParse(body.packages, []),
    overview: safeParse(body.overview, []),

    applyButtonText: body.applyButtonText || "",
    applyButtonLink: body.applyButtonLink || "",

    photoStrip,
    s3Blocks: safeParse(body.s3Blocks, []),

    s4Blocks: safeParse(body.s4Blocks, []),
    infoBlocks: safeParse(body.infoBlocks, []),
    whyChooseText: body.whyChooseText || "",
    affordableTitle: body.affordableTitle || "",
    affordableParagraphs: safeParse(body.affordableParagraphs, []),
    affordableCardTitle: body.affordableCardTitle || "",
    affordableCardSub: body.affordableCardSub || "",
    affordableFeatures: safeParse(body.affordableFeatures, []),

    reachTitle: body.reachTitle || "",
    reachParagraphs: safeParse(body.reachParagraphs, []),
    routes: safeParse(body.routes, []),

    bookNowText: body.bookNowText || "",
    bookNowLink: body.bookNowLink || "",
    paypalText: body.paypalText || "",
    paypalLink: body.paypalLink || "",
  };
};

/* ── GET all (singleton — returns an array with at most one doc) ── */
exports.getAll = async (req, res) => {
  try {
    const docs = await YogaRetreatSection.find().sort({ createdAt: -1 }).limit(1);
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ── GET one by id ── */
exports.getById = async (req, res) => {
  try {
    const doc = await YogaRetreatSection.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Yoga Retreat section not found" });
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ── CREATE (singleton — if one already exists, update it instead) ── */
exports.create = async (req, res) => {
  try {
    const existing = await YogaRetreatSection.findOne();

    if (existing) {
      const payload = buildPayload(req.body, req.files, existing);
      Object.assign(existing, payload);
      await existing.save();
      return res.json({ success: true, message: "Yoga Retreat section updated", data: existing });
    }

    const payload = buildPayload(req.body, req.files, null);
    const doc = await YogaRetreatSection.create(payload);
    res.status(201).json({ success: true, message: "Yoga Retreat section created", data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ── UPDATE by id ── */
exports.update = async (req, res) => {
  try {
    const existing = await YogaRetreatSection.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Yoga Retreat section not found" });
    }

    const payload = buildPayload(req.body, req.files, existing);
    Object.assign(existing, payload);
    await existing.save();

    res.json({ success: true, message: "Yoga Retreat section updated", data: existing });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ── DELETE by id ── */
exports.remove = async (req, res) => {
  try {
    const doc = await YogaRetreatSection.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Yoga Retreat section not found" });
    }

    // Clean up uploaded files
    deleteFileSafe(doc.heroImage);
    deleteFileSafe(doc.s1Image);
    (doc.photoStrip || []).forEach((item) => deleteFileSafe(item.image));

    await doc.deleteOne();
    res.json({ success: true, message: "Yoga Retreat section deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};