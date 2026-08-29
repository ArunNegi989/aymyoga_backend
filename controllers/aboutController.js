const fs = require("fs");
const path = require("path");
const About = require("../models/aboutModel");

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

// req.files comes from multer.any() — a flat array with .fieldname on each file
const findFile = (files, fieldname) => (files || []).find((f) => f.fieldname === fieldname);
const toPublicPath = (file) => (file ? `/uploads/${file.filename}` : "");

/**
 * Builds the full About payload from req.body + req.files.
 * Used by both create and update. `existingDoc` supplies previous values so
 * unspecified files/arrays are preserved.
 */
const buildAboutPayload = (req, existingDoc = null) => {
  const body = req.body;
  const files = req.files || [];

  const payload = {
    heroImageAlt: body.heroImageAlt ?? existingDoc?.heroImageAlt ?? "",
    logoAbbr: body.logoAbbr ?? existingDoc?.logoAbbr ?? "",
    logoFullText: body.logoFullText ?? existingDoc?.logoFullText ?? "",
    logoIndiaText: body.logoIndiaText ?? existingDoc?.logoIndiaText ?? "",

    schoolBlockTitle: body.schoolBlockTitle ?? existingDoc?.schoolBlockTitle ?? "",
    schoolGalleryLabel: body.schoolGalleryLabel ?? existingDoc?.schoolGalleryLabel ?? "",

    visionMissionBlockTitle: body.visionMissionBlockTitle ?? existingDoc?.visionMissionBlockTitle ?? "",
    visionTitle: body.visionTitle ?? existingDoc?.visionTitle ?? "",
    missionTitle: body.missionTitle ?? existingDoc?.missionTitle ?? "",

    objectivesBlockTitle: body.objectivesBlockTitle ?? existingDoc?.objectivesBlockTitle ?? "",
    historyBlockTitle: body.historyBlockTitle ?? existingDoc?.historyBlockTitle ?? "",
    activitiesBlockTitle: body.activitiesBlockTitle ?? existingDoc?.activitiesBlockTitle ?? "",
  };

  // ── Dynamic-length paragraph / string arrays ──
  payload.schoolParagraphs = parseJSON(body.schoolParagraphs, existingDoc?.schoolParagraphs ?? []);
  payload.visionParagraphs = parseJSON(body.visionParagraphs, existingDoc?.visionParagraphs ?? []);
  payload.missionParagraphs = parseJSON(body.missionParagraphs, existingDoc?.missionParagraphs ?? []);
  payload.visionMissionProseParagraphs = parseJSON(
    body.visionMissionProseParagraphs,
    existingDoc?.visionMissionProseParagraphs ?? []
  );
  payload.objectivesIntroParagraphs = parseJSON(
    body.objectivesIntroParagraphs,
    existingDoc?.objectivesIntroParagraphs ?? []
  );
  payload.activitiesIntroParagraphs = parseJSON(
    body.activitiesIntroParagraphs,
    existingDoc?.activitiesIntroParagraphs ?? []
  );
  payload.objectives = parseJSON(body.objectives, existingDoc?.objectives ?? []);

  // ── Icon + title + description arrays (no images) ──
  payload.highlights = parseJSON(body.highlights, existingDoc?.highlights ?? []);
  payload.activities = parseJSON(body.activities, existingDoc?.activities ?? []);

  // ── Single images: hero / school gallery / vision / mission ──
  const heroFile = findFile(files, "heroImage");
  payload.heroImage = heroFile ? toPublicPath(heroFile) : existingDoc?.heroImage ?? "";
  if (heroFile && existingDoc?.heroImage) deleteFileIfExists(existingDoc.heroImage);

  const schoolGalleryFile = findFile(files, "schoolGalleryImage");
  payload.schoolGalleryImage = schoolGalleryFile ? toPublicPath(schoolGalleryFile) : existingDoc?.schoolGalleryImage ?? "";
  if (schoolGalleryFile && existingDoc?.schoolGalleryImage) deleteFileIfExists(existingDoc.schoolGalleryImage);

  const visionFile = findFile(files, "visionImage");
  payload.visionImage = visionFile ? toPublicPath(visionFile) : existingDoc?.visionImage ?? "";
  if (visionFile && existingDoc?.visionImage) deleteFileIfExists(existingDoc.visionImage);

  const missionFile = findFile(files, "missionImage");
  payload.missionImage = missionFile ? toPublicPath(missionFile) : existingDoc?.missionImage ?? "";
  if (missionFile && existingDoc?.missionImage) deleteFileIfExists(existingDoc.missionImage);

  // ── Timeline items: year/title/paragraphs (ordered) + per-index image ──
  const timelineData = parseJSON(body.timelineData, []); // [{year, title, paragraphs}]
  const existingTimelineImages = parseJSON(body.existingTimelineImages, []); // null where a new file replaces it
  payload.timelineItems = timelineData.map((t, i) => {
    const newFile = findFile(files, `timelineImage_${i}`);
    const prevImage = existingDoc?.timelineItems?.[i]?.image ?? "";
    if (newFile && prevImage) deleteFileIfExists(prevImage);
    return {
      year: t.year ?? "",
      title: t.title ?? "",
      paragraphs: Array.isArray(t.paragraphs) ? t.paragraphs : [],
      image: newFile ? toPublicPath(newFile) : existingTimelineImages[i] ?? prevImage ?? "",
    };
  });

  // Clean up images for any timeline entries that were removed entirely
  const removedCount = (existingDoc?.timelineItems?.length ?? 0) - timelineData.length;
  if (removedCount > 0) {
    for (let i = timelineData.length; i < existingDoc.timelineItems.length; i++) {
      deleteFileIfExists(existingDoc.timelineItems[i]?.image);
    }
  }

  return payload;
};

/* ── Controllers ── */

// GET /about-section — singleton fetch (returns the one doc, or null)
exports.getAbout = async (req, res) => {
  try {
    const doc = await About.findOne().sort({ createdAt: -1 });
    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /about-section/:id
exports.getAboutById = async (req, res) => {
  try {
    const doc = await About.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /about-section — create (singleton: refuses if one already exists)
exports.createAbout = async (req, res) => {
  try {
    const already = await About.findOne();
    if (already) {
      return res.status(409).json({
        success: false,
        message: "About Us section already exists. Use update instead.",
        data: already,
      });
    }
    const payload = buildAboutPayload(req, null);
    const doc = await About.create(payload);
    return res.status(201).json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /about-section/:id
exports.updateAbout = async (req, res) => {
  try {
    const existingDoc = await About.findById(req.params.id);
    if (!existingDoc) return res.status(404).json({ success: false, message: "Not found" });

    const payload = buildAboutPayload(req, existingDoc);
    const updated = await About.findByIdAndUpdate(req.params.id, payload, { new: true });
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /about-section/:id — also best-effort removes all associated files from disk
exports.deleteAbout = async (req, res) => {
  try {
    const doc = await About.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    deleteFileIfExists(doc.heroImage);
    deleteFileIfExists(doc.schoolGalleryImage);
    deleteFileIfExists(doc.visionImage);
    deleteFileIfExists(doc.missionImage);
    (doc.timelineItems || []).forEach((t) => deleteFileIfExists(t.image));

    await About.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};