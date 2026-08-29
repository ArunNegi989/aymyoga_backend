// FILE: controllers/meditationSectionController.js
const fs = require("fs");
const path = require("path");
const MeditationSection = require("../models/MeditationSection");

const relPath = (filename) =>
  filename ? `/uploads/${filename}` : "";

const safeUnlink = (relativePath) => {
  if (!relativePath) return;
  const abs = path.join(__dirname, "..", relativePath);
  fs.unlink(abs, () => {}); // ignore errors (file may not exist)
};

const safeParseJSON = (val, fallback) => {
  if (val === undefined || val === null || val === "") return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

/* ══════════════════════════════
   CREATE (singleton — first-time save)
══════════════════════════════ */
exports.createSection = async (req, res) => {
  try {
    const existing = await MeditationSection.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Meditation section already exists. Use update instead.",
      });
    }

    const body = req.body;
    const files = req.files || {};

    const methodCardsInput = safeParseJSON(body.methodCards, []);
    const methodCards = methodCardsInput.map((m, i) => ({
      title: m.title,
      text: m.text,
      imageAlt: m.imageAlt || "",
      image: files[`methodImage${i}`]
        ? relPath(files[`methodImage${i}`][0].filename)
        : "",
    }));

    const doc = await MeditationSection.create({
      heroImage: files.heroImage ? relPath(files.heroImage[0].filename) : "",
      heroImageAlt: body.heroImageAlt,
      heroTitle: body.heroTitle,

      whatIsTitle: body.whatIsTitle,
      whatIsParagraphs: safeParseJSON(body.whatIsParagraphs, []),
      videoUrl: body.videoUrl,

      methodsSectionTitle: body.methodsSectionTitle,
      methodCards,
      methodsClosingText: body.methodsClosingText || "",

      elevateTitle: body.elevateTitle,
      elevateParagraph: body.elevateParagraph,
      elevateImage: files.elevateImage ? relPath(files.elevateImage[0].filename) : "",
      elevateImageAlt: body.elevateImageAlt || "",

      whyChooseTitle: body.whyChooseTitle,
      whyCards: safeParseJSON(body.whyCards, []),

      scheduleTitle: body.scheduleTitle,
      highlightsLabel: body.highlightsLabel,
      highlightCards: safeParseJSON(body.highlightCards, []),

      batchSectionTag: body.batchSectionTag || "",
      batchSectionTitle: body.batchSectionTitle || "",
      batchSectionSub: body.batchSectionSub || "",
      batchSectionDuration: body.batchSectionDuration || "",

      ctaBadgeText: body.ctaBadgeText || "",
      ctaTitle: body.ctaTitle,
      ctaPara1: body.ctaPara1 || "",
      ctaSubTitle: body.ctaSubTitle || "",
      ctaPara2: body.ctaPara2 || "",
      ctaEnrollLink: body.ctaEnrollLink || "/yoga-registration",
      ctaLearnMoreLink: body.ctaLearnMoreLink || "/contact",
      ctaImage: files.ctaImage ? relPath(files.ctaImage[0].filename) : "",
      ctaImageAlt: body.ctaImageAlt || "",
      ctaImageOverlayText: body.ctaImageOverlayText || "",
    });

    return res.status(201).json({
      success: true,
      message: "Meditation section created successfully",
      data: doc,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to create meditation section",
    });
  }
};

/* ══════════════════════════════
   GET (list — returns the singleton, wrapped as expected by frontend)
══════════════════════════════ */
exports.getSection = async (req, res) => {
  try {
    const doc = await MeditationSection.findOne().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: doc, // frontend handles: Array.isArray(...) ? [0] : data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch meditation section",
    });
  }
};

/* ══════════════════════════════
   GET BY ID (edit page)
══════════════════════════════ */
exports.getSectionById = async (req, res) => {
  try {
    const doc = await MeditationSection.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid section id" });
  }
};

/* ══════════════════════════════
   UPDATE
══════════════════════════════ */
exports.updateSection = async (req, res) => {
  try {
    const doc = await MeditationSection.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    const body = req.body;
    const files = req.files || {};

    // ── Simple fields ──
    if (body.heroImageAlt !== undefined) doc.heroImageAlt = body.heroImageAlt;
    if (body.heroTitle !== undefined) doc.heroTitle = body.heroTitle;

    if (body.whatIsTitle !== undefined) doc.whatIsTitle = body.whatIsTitle;
    if (body.whatIsParagraphs !== undefined)
      doc.whatIsParagraphs = safeParseJSON(body.whatIsParagraphs, doc.whatIsParagraphs);
    if (body.videoUrl !== undefined) doc.videoUrl = body.videoUrl;

    if (body.methodsSectionTitle !== undefined) doc.methodsSectionTitle = body.methodsSectionTitle;
    if (body.methodsClosingText !== undefined) doc.methodsClosingText = body.methodsClosingText;

    if (body.elevateTitle !== undefined) doc.elevateTitle = body.elevateTitle;
    if (body.elevateParagraph !== undefined) doc.elevateParagraph = body.elevateParagraph;
    if (body.elevateImageAlt !== undefined) doc.elevateImageAlt = body.elevateImageAlt;

    if (body.whyChooseTitle !== undefined) doc.whyChooseTitle = body.whyChooseTitle;
    if (body.whyCards !== undefined) doc.whyCards = safeParseJSON(body.whyCards, doc.whyCards);

    if (body.scheduleTitle !== undefined) doc.scheduleTitle = body.scheduleTitle;
    if (body.highlightsLabel !== undefined) doc.highlightsLabel = body.highlightsLabel;
    if (body.highlightCards !== undefined)
      doc.highlightCards = safeParseJSON(body.highlightCards, doc.highlightCards);

    if (body.batchSectionTag !== undefined) doc.batchSectionTag = body.batchSectionTag;
    if (body.batchSectionTitle !== undefined) doc.batchSectionTitle = body.batchSectionTitle;
    if (body.batchSectionSub !== undefined) doc.batchSectionSub = body.batchSectionSub;
    if (body.batchSectionDuration !== undefined) doc.batchSectionDuration = body.batchSectionDuration;

    if (body.ctaBadgeText !== undefined) doc.ctaBadgeText = body.ctaBadgeText;
    if (body.ctaTitle !== undefined) doc.ctaTitle = body.ctaTitle;
    if (body.ctaPara1 !== undefined) doc.ctaPara1 = body.ctaPara1;
    if (body.ctaSubTitle !== undefined) doc.ctaSubTitle = body.ctaSubTitle;
    if (body.ctaPara2 !== undefined) doc.ctaPara2 = body.ctaPara2;
    if (body.ctaEnrollLink !== undefined) doc.ctaEnrollLink = body.ctaEnrollLink;
    if (body.ctaLearnMoreLink !== undefined) doc.ctaLearnMoreLink = body.ctaLearnMoreLink;
    if (body.ctaImageAlt !== undefined) doc.ctaImageAlt = body.ctaImageAlt;
    if (body.ctaImageOverlayText !== undefined) doc.ctaImageOverlayText = body.ctaImageOverlayText;

    // ── Single images (replace old file if a new one uploaded) ──
    if (files.heroImage) {
      safeUnlink(doc.heroImage);
      doc.heroImage = relPath(files.heroImage[0].filename);
    }
    if (files.elevateImage) {
      safeUnlink(doc.elevateImage);
      doc.elevateImage = relPath(files.elevateImage[0].filename);
    }
    if (files.ctaImage) {
      safeUnlink(doc.ctaImage);
      doc.ctaImage = relPath(files.ctaImage[0].filename);
    }

    // ── Method cards (merge text fields + optionally replace each image) ──
    if (body.methodCards !== undefined) {
      const incoming = safeParseJSON(body.methodCards, []);
      const oldCards = doc.methodCards || [];

      doc.methodCards = incoming.map((m, i) => {
        const oldImage = oldCards[i]?.image || "";
        let image = oldImage;

        if (files[`methodImage${i}`]) {
          safeUnlink(oldImage);
          image = relPath(files[`methodImage${i}`][0].filename);
        }

        return {
          title: m.title,
          text: m.text,
          imageAlt: m.imageAlt || "",
          image,
        };
      });

      // If old array had more cards than new (cards removed), clean up their images
      if (oldCards.length > incoming.length) {
        for (let i = incoming.length; i < oldCards.length; i++) {
          safeUnlink(oldCards[i]?.image);
        }
      }
    }

    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Meditation section updated successfully",
      data: doc,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to update meditation section",
    });
  }
};

/* ══════════════════════════════
   DELETE
══════════════════════════════ */
exports.deleteSection = async (req, res) => {
  try {
    const doc = await MeditationSection.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    // Clean up all uploaded images
    safeUnlink(doc.heroImage);
    safeUnlink(doc.elevateImage);
    safeUnlink(doc.ctaImage);
    (doc.methodCards || []).forEach((m) => safeUnlink(m.image));

    await MeditationSection.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Meditation section deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid section id",
    });
  }
};