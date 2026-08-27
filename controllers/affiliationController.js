const fs = require("fs");
const path = require("path");
const Affiliation = require("../models/affiliationModel");

/* ── Helpers ── */

// Safely parse a JSON string from a multipart field; returns fallback on failure
const parseJSON = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Convert stored "/uploads/xxx.jpg" path into an absolute disk path for deletion
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
const findFiles = (files, fieldname) => (files || []).filter((f) => f.fieldname === fieldname);
const toPublicPath = (file) => (file ? `/uploads/${file.filename}` : "");

/**
 * Builds the full Affiliation payload from req.body + req.files.
 * Used by both create and update.
 * `existingDoc` (optional) supplies previous values so unspecified files/arrays are preserved.
 */
const buildAffiliationPayload = (req, existingDoc = null) => {
  const body = req.body;
  const files = req.files || [];

  const payload = {
    heroImageAlt: body.heroImageAlt ?? existingDoc?.heroImageAlt ?? "",
    mainTitle: body.mainTitle ?? existingDoc?.mainTitle ?? "",
    introCardTitle: body.introCardTitle ?? existingDoc?.introCardTitle ?? "",
    highlightTitle: body.highlightTitle ?? existingDoc?.highlightTitle ?? "",
    yogaAllianceUrl: body.yogaAllianceUrl ?? existingDoc?.yogaAllianceUrl ?? "",
    certsSectionTitle: body.certsSectionTitle ?? existingDoc?.certsSectionTitle ?? "",
    certsSectionSubtitle: body.certsSectionSubtitle ?? existingDoc?.certsSectionSubtitle ?? "",
    boardSectionTitle: body.boardSectionTitle ?? existingDoc?.boardSectionTitle ?? "",
    boardSectionSubtitle: body.boardSectionSubtitle ?? existingDoc?.boardSectionSubtitle ?? "",
    boardInfoTitle: body.boardInfoTitle ?? existingDoc?.boardInfoTitle ?? "",
    boardInfoText: body.boardInfoText ?? existingDoc?.boardInfoText ?? "",
    iyfSectionTitle: body.iyfSectionTitle ?? existingDoc?.iyfSectionTitle ?? "",
    iyfTitle: body.iyfTitle ?? existingDoc?.iyfTitle ?? "",
  };

  // ── Dynamic-length arrays (paragraphs / notes / cards) ──
  payload.accreditationCards = parseJSON(body.accreditationCards, existingDoc?.accreditationCards ?? []);
  payload.introParagraphs = parseJSON(body.introParagraphs, existingDoc?.introParagraphs ?? []);
  payload.highlightParagraphs = parseJSON(body.highlightParagraphs, existingDoc?.highlightParagraphs ?? []);
  payload.iyfParagraphs = parseJSON(body.iyfParagraphs, existingDoc?.iyfParagraphs ?? []);
  payload.iyfFooterNotes = parseJSON(body.iyfFooterNotes, existingDoc?.iyfFooterNotes ?? []);

  // ── Single images: hero / board certificate / iyf logo ──
  const heroFile = findFile(files, "heroImage");
  payload.heroImage = heroFile ? toPublicPath(heroFile) : existingDoc?.heroImage ?? "";
  if (heroFile && existingDoc?.heroImage) deleteFileIfExists(existingDoc.heroImage);

  const boardCertFile = findFile(files, "boardCertificateImage");
  payload.boardCertificateImage = boardCertFile ? toPublicPath(boardCertFile) : existingDoc?.boardCertificateImage ?? "";
  if (boardCertFile && existingDoc?.boardCertificateImage) deleteFileIfExists(existingDoc.boardCertificateImage);

  const iyfLogoFile = findFile(files, "iyfLogoImage");
  payload.iyfLogoImage = iyfLogoFile ? toPublicPath(iyfLogoFile) : existingDoc?.iyfLogoImage ?? "";
  if (iyfLogoFile && existingDoc?.iyfLogoImage) deleteFileIfExists(existingDoc.iyfLogoImage);

  // ── Gallery images: new uploads + retained existing urls ──
  const newGalleryFiles = findFiles(files, "galleryImages");
  const retainedGallery = parseJSON(body.existingGalleryImages, []);
  const removedGallery = (existingDoc?.galleryImages ?? []).filter((url) => !retainedGallery.includes(url));
  removedGallery.forEach(deleteFileIfExists);
  payload.galleryImages = [...retainedGallery, ...newGalleryFiles.map(toPublicPath)];

  // ── RYS images: alt texts (ordered) + files/existing per index ──
  const rysAlts = parseJSON(body.rysImagesAlt, []);
  const existingRysImages = parseJSON(body.existingRysImages, []); // null where a new file replaces it
  const rysCount = Math.max(rysAlts.length, existingRysImages.length);
  payload.rysImages = [];
  for (let i = 0; i < rysCount; i++) {
    const newFile = findFile(files, `rysImage_${i}`);
    const prevImage = existingDoc?.rysImages?.[i]?.image ?? "";
    if (newFile && prevImage) deleteFileIfExists(prevImage);
    payload.rysImages.push({
      alt: rysAlts[i] ?? "",
      image: newFile ? toPublicPath(newFile) : existingRysImages[i] ?? prevImage ?? "",
    });
  }

  // ── Certs: type/description (ordered) + files/existing per index ──
  const certsData = parseJSON(body.certsData, []);
  const existingCertImages = parseJSON(body.existingCertImages, []); // null where a new file replaces it
  payload.certs = certsData.map((c, i) => {
    const newFile = findFile(files, `certImage_${i}`);
    const prevImage = existingDoc?.certs?.[i]?.image ?? "";
    if (newFile && prevImage) deleteFileIfExists(prevImage);
    return {
      type: c.type ?? "",
      description: c.description ?? "",
      image: newFile ? toPublicPath(newFile) : existingCertImages[i] ?? prevImage ?? "",
    };
  });

  return payload;
};

/* ── Controllers ── */

// GET /accreditation — singleton fetch (returns the one doc, or null)
exports.getAffiliation = async (req, res) => {
  try {
    const doc = await Affiliation.findOne().sort({ createdAt: -1 });
    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /accreditation/:id
exports.getAffiliationById = async (req, res) => {
  try {
    const doc = await Affiliation.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /accreditation — create (singleton: refuses if one already exists)
exports.createAffiliation = async (req, res) => {
  try {
    const already = await Affiliation.findOne();
    if (already) {
      return res.status(409).json({
        success: false,
        message: "Affiliation section already exists. Use update instead.",
        data: already,
      });
    }
    const payload = buildAffiliationPayload(req, null);
    const doc = await Affiliation.create(payload);
    return res.status(201).json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /accreditation/:id
exports.updateAffiliation = async (req, res) => {
  try {
    const existingDoc = await Affiliation.findById(req.params.id);
    if (!existingDoc) return res.status(404).json({ success: false, message: "Not found" });

    const payload = buildAffiliationPayload(req, existingDoc);
    const updated = await Affiliation.findByIdAndUpdate(req.params.id, payload, { new: true });
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /accreditation/:id — also best-effort removes all associated files from disk
exports.deleteAffiliation = async (req, res) => {
  try {
    const doc = await Affiliation.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    deleteFileIfExists(doc.heroImage);
    deleteFileIfExists(doc.boardCertificateImage);
    deleteFileIfExists(doc.iyfLogoImage);
    (doc.galleryImages || []).forEach(deleteFileIfExists);
    (doc.rysImages || []).forEach((r) => deleteFileIfExists(r.image));
    (doc.certs || []).forEach((c) => deleteFileIfExists(c.image));

    await Affiliation.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};