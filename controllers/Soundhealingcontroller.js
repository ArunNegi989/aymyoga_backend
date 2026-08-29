const fs = require("fs");
const path = require("path");
const SoundHealingSection = require("../models/Soundhealingmodel");

/* ── Helpers ── */

// Safely parse a JSON string sent from the multipart form; falls back to [] on failure
const safeParse = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Delete an old uploaded file (e.g. "/uploads/xxx.jpg") from disk, ignoring errors
const deleteOldFile = (relativePath) => {
  if (!relativePath) return;
  const cleaned = relativePath.replace(/^\/+/, ""); // strip leading slash
  const fullPath = path.join(process.cwd(), cleaned);
  fs.unlink(fullPath, () => {
    // ignore errors (file may already be missing)
  });
};

// Build the plain-object payload (without images) shared by create & update
const buildTextFields = (body) => ({
  heroImageAlt: body.heroImageAlt || "",

  introTitle: body.introTitle || "",
  introParagraphs: safeParse(body.introParagraphs),
  introSignatureText: body.introSignatureText || "",
  introImageAlt: body.introImageAlt || "",
  introImageBadge: body.introImageBadge || "",

  whatIsTitle: body.whatIsTitle || "",
  whatIsIntro: body.whatIsIntro || "",
  levels: safeParse(body.levels),
  bowl1Alt: body.bowl1Alt || "",
  bowl2Alt: body.bowl2Alt || "",
  bowl3Alt: body.bowl3Alt || "",

  aimEyebrow: body.aimEyebrow || "",
  aimTitle: body.aimTitle || "",
  aimParagraphs: safeParse(body.aimParagraphs),
  pillsLabel: body.pillsLabel || "",
  pills: safeParse(body.pills),
  aimImageAlt: body.aimImageAlt || "",
  aimImageBadge: body.aimImageBadge || "",
  aimQuoteText: body.aimQuoteText || "",
  aimQuoteAttribution: body.aimQuoteAttribution || "",

  benefitsTitle: body.benefitsTitle || "",
  benefitsIntro: body.benefitsIntro || "",
  benCards: safeParse(body.benCards),
  benefitsImageAlt: body.benefitsImageAlt || "",

  expectTitle: body.expectTitle || "",
  expectIntro: body.expectIntro || "",
  expectCards: safeParse(body.expectCards),
  instrLabel: body.instrLabel || "",
  instruments: safeParse(body.instruments),

  whyJoinTitle: body.whyJoinTitle || "",
  whyCards: safeParse(body.whyCards),
  certBannerIcon: body.certBannerIcon || "",
  certBannerText: body.certBannerText || "",

  batchSectionTag: body.batchSectionTag || "",
  batchSectionTitle: body.batchSectionTitle || "",
  batchSectionSub: body.batchSectionSub || "",
});

/* ── Controllers ── */

// GET /sound-healing-section  (list — singleton, but returns as an array like other admin sections)
exports.getAll = async (req, res) => {
  try {
    const data = await SoundHealingSection.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /sound-healing-section/:id
exports.getOne = async (req, res) => {
  try {
    const data = await SoundHealingSection.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Sound Healing section not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /sound-healing-section
exports.create = async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || {};

    const doc = new SoundHealingSection({
      ...buildTextFields(body),
      heroImage: files.heroImage?.[0] ? `/uploads/${files.heroImage[0].filename}` : "",
      introImage: files.introImage?.[0] ? `/uploads/${files.introImage[0].filename}` : "",
      bowl1Image: files.bowl1Image?.[0] ? `/uploads/${files.bowl1Image[0].filename}` : "",
      bowl2Image: files.bowl2Image?.[0] ? `/uploads/${files.bowl2Image[0].filename}` : "",
      bowl3Image: files.bowl3Image?.[0] ? `/uploads/${files.bowl3Image[0].filename}` : "",
      aimImage: files.aimImage?.[0] ? `/uploads/${files.aimImage[0].filename}` : "",
      benefitsImage: files.benefitsImage?.[0] ? `/uploads/${files.benefitsImage[0].filename}` : "",
    });

    await doc.save();
    res.status(201).json({ success: true, message: "Sound Healing section created", data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /sound-healing-section/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await SoundHealingSection.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Sound Healing section not found" });
    }

    const body = req.body;
    const files = req.files || {};

    // Map of formField -> DB field for the 7 replaceable images
    const imageFields = [
      { form: "heroImage", db: "heroImage" },
      { form: "introImage", db: "introImage" },
      { form: "bowl1Image", db: "bowl1Image" },
      { form: "bowl2Image", db: "bowl2Image" },
      { form: "bowl3Image", db: "bowl3Image" },
      { form: "aimImage", db: "aimImage" },
      { form: "benefitsImage", db: "benefitsImage" },
    ];

    const imageUpdates = {};
    imageFields.forEach(({ form, db }) => {
      if (files[form]?.[0]) {
        deleteOldFile(existing[db]);
        imageUpdates[db] = `/uploads/${files[form][0].filename}`;
      }
    });

    Object.assign(existing, buildTextFields(body), imageUpdates);

    await existing.save();
    res.status(200).json({ success: true, message: "Sound Healing section updated", data: existing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /sound-healing-section/:id
exports.remove = async (req, res) => {
  try {
    const existing = await SoundHealingSection.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Sound Healing section not found" });
    }

    // Clean up uploaded files from disk
    deleteOldFile(existing.heroImage);
    deleteOldFile(existing.introImage);
    deleteOldFile(existing.bowl1Image);
    deleteOldFile(existing.bowl2Image);
    deleteOldFile(existing.bowl3Image);
    deleteOldFile(existing.aimImage);
    deleteOldFile(existing.benefitsImage);

    await SoundHealingSection.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Sound Healing section deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};