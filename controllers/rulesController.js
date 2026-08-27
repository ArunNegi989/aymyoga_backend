const fs = require("fs");
const path = require("path");
const Rules = require("../models/rulesModel");

/* ── Helpers ── */

const parseJSON = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const toDiskPath = (storedPath) => {
  if (!storedPath) return null;
  const relative = storedPath.startsWith("/") ? storedPath.slice(1) : storedPath;
  return path.join(process.cwd(), relative);
};

const deleteFileIfExists = (storedPath) => {
  const diskPath = toDiskPath(storedPath);
  if (!diskPath) return;
  fs.unlink(diskPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to delete file:", diskPath, err.message);
    }
  });
};

const findFile = (files, fieldname) => (files || []).find((f) => f.fieldname === fieldname);
const toPublicPath = (file) => (file ? `/uploads/${file.filename}` : "");

/**
 * Builds the full Rules payload from req.body + req.files.
 * Used by both create and update. `existingDoc` supplies previous values so
 * unspecified fields are preserved.
 */
const buildRulesPayload = (req, existingDoc = null) => {
  const body = req.body;
  const files = req.files || [];

  const payload = {
    heroImageAlt: body.heroImageAlt ?? existingDoc?.heroImageAlt ?? "",
    pageTitle: body.pageTitle ?? existingDoc?.pageTitle ?? "",
    brownBarLabel: body.brownBarLabel ?? existingDoc?.brownBarLabel ?? "",
    agreementTitle: body.agreementTitle ?? existingDoc?.agreementTitle ?? "",
    footerText: body.footerText ?? existingDoc?.footerText ?? "",
  };

  // ── Nested categories → rules ──
  payload.categories = parseJSON(body.categories, existingDoc?.categories ?? []);

  // ── Dynamic paragraph array ──
  payload.agreementParagraphs = parseJSON(body.agreementParagraphs, existingDoc?.agreementParagraphs ?? []);

  // ── Single hero image ──
  const heroFile = findFile(files, "heroImage");
  payload.heroImage = heroFile ? toPublicPath(heroFile) : existingDoc?.heroImage ?? "";
  if (heroFile && existingDoc?.heroImage) deleteFileIfExists(existingDoc.heroImage);

  return payload;
};

/* ── Controllers ── */

// GET /rules-section — singleton fetch (returns the one doc, or null)
exports.getRules = async (req, res) => {
  try {
    const doc = await Rules.findOne().sort({ createdAt: -1 });
    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /rules-section/:id
exports.getRulesById = async (req, res) => {
  try {
    const doc = await Rules.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /rules-section — create (singleton: refuses if one already exists)
exports.createRules = async (req, res) => {
  try {
    const already = await Rules.findOne();
    if (already) {
      return res.status(409).json({
        success: false,
        message: "Rules section already exists. Use update instead.",
        data: already,
      });
    }
    const payload = buildRulesPayload(req, null);
    const doc = await Rules.create(payload);
    return res.status(201).json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /rules-section/:id
exports.updateRules = async (req, res) => {
  try {
    const existingDoc = await Rules.findById(req.params.id);
    if (!existingDoc) return res.status(404).json({ success: false, message: "Not found" });

    const payload = buildRulesPayload(req, existingDoc);
    const updated = await Rules.findByIdAndUpdate(req.params.id, payload, { new: true });
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /rules-section/:id — also best-effort removes the hero image from disk
exports.deleteRules = async (req, res) => {
  try {
    const doc = await Rules.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    deleteFileIfExists(doc.heroImage);

    await Rules.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};