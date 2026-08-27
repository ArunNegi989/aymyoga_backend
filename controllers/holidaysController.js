const fs = require("fs");
const path = require("path");
const Holidays = require("../models/holidaysModel");

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
 * Builds the full Holidays payload from req.body + req.files.
 * Used by both create and update. `existingDoc` supplies previous values so
 * unspecified fields are preserved.
 */
const buildHolidaysPayload = (req, existingDoc = null) => {
  const body = req.body;
  const files = req.files || [];

  const payload = {
    heroImageAlt: body.heroImageAlt ?? existingDoc?.heroImageAlt ?? "",
    mainTitle: body.mainTitle ?? existingDoc?.mainTitle ?? "",
    mediaImageAlt: body.mediaImageAlt ?? existingDoc?.mediaImageAlt ?? "",
    imageOverlayCaption: body.imageOverlayCaption ?? existingDoc?.imageOverlayCaption ?? "",
    videoEmbedUrl: body.videoEmbedUrl ?? existingDoc?.videoEmbedUrl ?? "",
    benefitsHeading: body.benefitsHeading ?? existingDoc?.benefitsHeading ?? "",
    ctaText: body.ctaText ?? existingDoc?.ctaText ?? "",
    ctaButtonText: body.ctaButtonText ?? existingDoc?.ctaButtonText ?? "",
    ctaButtonLink: body.ctaButtonLink ?? existingDoc?.ctaButtonLink ?? "",
    shivirTitle: body.shivirTitle ?? existingDoc?.shivirTitle ?? "",
    shivirSubtitle: body.shivirSubtitle ?? existingDoc?.shivirSubtitle ?? "",
    campImageAlt: body.campImageAlt ?? existingDoc?.campImageAlt ?? "",
    campImageCaption: body.campImageCaption ?? existingDoc?.campImageCaption ?? "",
    datesHighlight: body.datesHighlight ?? existingDoc?.datesHighlight ?? "",
    durationRange: body.durationRange ?? existingDoc?.durationRange ?? "",
    dateNote: body.dateNote ?? existingDoc?.dateNote ?? "",
    timetableTitle: body.timetableTitle ?? existingDoc?.timetableTitle ?? "",
    timetableSubtitle: body.timetableSubtitle ?? existingDoc?.timetableSubtitle ?? "",
    enrollTitle: body.enrollTitle ?? existingDoc?.enrollTitle ?? "",
    seatsNote: body.seatsNote ?? existingDoc?.seatsNote ?? "",
    eligibilityTitle: body.eligibilityTitle ?? existingDoc?.eligibilityTitle ?? "",
    eligibilityText: body.eligibilityText ?? existingDoc?.eligibilityText ?? "",
    guidelinesTitle: body.guidelinesTitle ?? existingDoc?.guidelinesTitle ?? "",
    moreInfoTitle: body.moreInfoTitle ?? existingDoc?.moreInfoTitle ?? "",
    dressCodeTitle: body.dressCodeTitle ?? existingDoc?.dressCodeTitle ?? "",
    dressCodeMen: body.dressCodeMen ?? existingDoc?.dressCodeMen ?? "",
    dressCodeWomen: body.dressCodeWomen ?? existingDoc?.dressCodeWomen ?? "",
    dressCodeNote: body.dressCodeNote ?? existingDoc?.dressCodeNote ?? "",
    reachTitle: body.reachTitle ?? existingDoc?.reachTitle ?? "",
    reachText: body.reachText ?? existingDoc?.reachText ?? "",
  };

  // ── Dynamic string / paragraph arrays ──
  payload.bodyParagraphs = parseJSON(body.bodyParagraphs, existingDoc?.bodyParagraphs ?? []);
  payload.ayurvedaCalloutParagraphs = parseJSON(body.ayurvedaCalloutParagraphs, existingDoc?.ayurvedaCalloutParagraphs ?? []);
  payload.benefits = parseJSON(body.benefits, existingDoc?.benefits ?? []);
  payload.descriptionParagraphs = parseJSON(body.descriptionParagraphs, existingDoc?.descriptionParagraphs ?? []);
  payload.datePeriods = parseJSON(body.datePeriods, existingDoc?.datePeriods ?? []);
  payload.enrollSteps = parseJSON(body.enrollSteps, existingDoc?.enrollSteps ?? []);
  payload.guidelines = parseJSON(body.guidelines, existingDoc?.guidelines ?? []);
  payload.moreInfoParagraphs = parseJSON(body.moreInfoParagraphs, existingDoc?.moreInfoParagraphs ?? []);

  // ── Structured arrays ──
  payload.timetableRows = parseJSON(body.timetableRows, existingDoc?.timetableRows ?? []);
  payload.pricingCards = parseJSON(body.pricingCards, existingDoc?.pricingCards ?? []);

  // ── Single images: hero / media / camp ──
  const heroFile = findFile(files, "heroImage");
  payload.heroImage = heroFile ? toPublicPath(heroFile) : existingDoc?.heroImage ?? "";
  if (heroFile && existingDoc?.heroImage) deleteFileIfExists(existingDoc.heroImage);

  const mediaFile = findFile(files, "mediaImage");
  payload.mediaImage = mediaFile ? toPublicPath(mediaFile) : existingDoc?.mediaImage ?? "";
  if (mediaFile && existingDoc?.mediaImage) deleteFileIfExists(existingDoc.mediaImage);

  const campFile = findFile(files, "campImage");
  payload.campImage = campFile ? toPublicPath(campFile) : existingDoc?.campImage ?? "";
  if (campFile && existingDoc?.campImage) deleteFileIfExists(existingDoc.campImage);

  return payload;
};

/* ── Controllers ── */

// GET /holidays-section — singleton fetch (returns the one doc, or null)
exports.getHolidays = async (req, res) => {
  try {
    const doc = await Holidays.findOne().sort({ createdAt: -1 });
    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /holidays-section/:id
exports.getHolidaysById = async (req, res) => {
  try {
    const doc = await Holidays.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /holidays-section — create (singleton: refuses if one already exists)
exports.createHolidays = async (req, res) => {
  try {
    const already = await Holidays.findOne();
    if (already) {
      return res.status(409).json({
        success: false,
        message: "Yoga Holidays section already exists. Use update instead.",
        data: already,
      });
    }
    const payload = buildHolidaysPayload(req, null);
    const doc = await Holidays.create(payload);
    return res.status(201).json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /holidays-section/:id
exports.updateHolidays = async (req, res) => {
  try {
    const existingDoc = await Holidays.findById(req.params.id);
    if (!existingDoc) return res.status(404).json({ success: false, message: "Not found" });

    const payload = buildHolidaysPayload(req, existingDoc);
    const updated = await Holidays.findByIdAndUpdate(req.params.id, payload, { new: true });
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /holidays-section/:id — also best-effort removes associated files from disk
exports.deleteHolidays = async (req, res) => {
  try {
    const doc = await Holidays.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    deleteFileIfExists(doc.heroImage);
    deleteFileIfExists(doc.mediaImage);
    deleteFileIfExists(doc.campImage);

    await Holidays.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};