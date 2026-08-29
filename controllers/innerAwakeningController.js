const fs = require("fs");
const path = require("path");
const InnerAwakeningSection = require("../models/innerAwakeningModel");

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

  heroBadge: body.heroBadge || "",
  mainTitle: body.mainTitle || "",
  subTitle: body.subTitle || "",
  whoTitle: body.whoTitle || "",
  maharishiIntro: body.maharishiIntro || "",
  maharishiImageAlt: body.maharishiImageAlt || "",
  imageCaption: body.imageCaption || "",
  heroStats: safeParse(body.heroStats),

  whatBadge: body.whatBadge || "",
  whatTitle: body.whatTitle || "",
  quoteText: body.quoteText || "",
  bodyText: body.bodyText || "",
  insightCards: safeParse(body.insightCards),
  programNote: body.programNote || "",

  scheduleBadge: body.scheduleBadge || "",
  scheduleTitle: body.scheduleTitle || "",
  weeksBadge: body.weeksBadge || "",
  weeksText: body.weeksText || "",
  card1Title: body.card1Title || "",
  points: safeParse(body.points),
  cardFootnote: body.cardFootnote || "",
  card2Title: body.card2Title || "",
  morningLabel: body.morningLabel || "",
  morningItems: safeParse(body.morningItems),
  breakText: body.breakText || "",
  eveningLabel: body.eveningLabel || "",
  eveningItems: safeParse(body.eveningItems),

  galleryBadge: body.galleryBadge || "",
  galleryTitle: body.galleryTitle || "",
  gallerySubtitle: body.gallerySubtitle || "",

  definitionTitle: body.definitionTitle || "",
  terms: safeParse(body.terms),
  participantTitle: body.participantTitle || "",
  participantList: safeParse(body.participantList),

  feeBadge: body.feeBadge || "",
  feeTitle: body.feeTitle || "",
  includedItems: safeParse(body.includedItems),
  pricingBadge: body.pricingBadge || "",
  priceUSD: body.priceUSD || "",
  priceINR: body.priceINR || "",
  pricingDesc: body.pricingDesc || "",
  pricingNote: body.pricingNote || "",
});

// Build galleryImages array, mapping uploaded files (galleryImage_0, galleryImage_1, galleryImage_2)
// onto the caption/subcaption sent in the "galleryImages" JSON field, falling back to any
// existing image path (for update, when a new file wasn't chosen for that slot).
const buildGalleryImages = (body, files, existingGalleryImages = []) => {
  const input = safeParse(body.galleryImages);
  return input.map((g, i) => {
    const uploadedFile = files?.[`galleryImage_${i}`]?.[0];
    if (uploadedFile) {
      // replacing an existing image on update -> remove the old file from disk
      if (existingGalleryImages?.[i]?.image) {
        deleteOldFile(existingGalleryImages[i].image);
      }
      return {
        caption: g.caption || "",
        subcaption: g.subcaption || "",
        image: `/uploads/${uploadedFile.filename}`,
      };
    }
    return {
      caption: g.caption || "",
      subcaption: g.subcaption || "",
      image: g.image || existingGalleryImages?.[i]?.image || "",
    };
  });
};

/* ── Controllers ── */

// GET /inner-awakening-section  (list — singleton, but returns as an array like other admin sections)
exports.getAll = async (req, res) => {
  try {
    const data = await InnerAwakeningSection.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /inner-awakening-section/:id
exports.getOne = async (req, res) => {
  try {
    const data = await InnerAwakeningSection.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Inner Awakening section not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /inner-awakening-section
exports.create = async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || {};

    const heroImage = files.heroImage?.[0] ? `/uploads/${files.heroImage[0].filename}` : "";
    const maharishiImage = files.maharishiImage?.[0] ? `/uploads/${files.maharishiImage[0].filename}` : "";
    const galleryImages = buildGalleryImages(body, files);

    const doc = new InnerAwakeningSection({
      ...buildTextFields(body),
      heroImage,
      maharishiImage,
      galleryImages,
    });

    await doc.save();
    res.status(201).json({ success: true, message: "Inner Awakening section created", data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /inner-awakening-section/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await InnerAwakeningSection.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Inner Awakening section not found" });
    }

    const body = req.body;
    const files = req.files || {};

    // Hero image
    let heroImage = existing.heroImage;
    if (files.heroImage?.[0]) {
      deleteOldFile(existing.heroImage);
      heroImage = `/uploads/${files.heroImage[0].filename}`;
    }

    // Guru image
    let maharishiImage = existing.maharishiImage;
    if (files.maharishiImage?.[0]) {
      deleteOldFile(existing.maharishiImage);
      maharishiImage = `/uploads/${files.maharishiImage[0].filename}`;
    }

    // Gallery images (per-slot replace)
    const galleryImages = buildGalleryImages(body, files, existing.galleryImages);

    Object.assign(existing, buildTextFields(body), {
      heroImage,
      maharishiImage,
      galleryImages,
    });

    await existing.save();
    res.status(200).json({ success: true, message: "Inner Awakening section updated", data: existing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /inner-awakening-section/:id
exports.remove = async (req, res) => {
  try {
    const existing = await InnerAwakeningSection.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Inner Awakening section not found" });
    }

    // Clean up uploaded files from disk
    deleteOldFile(existing.heroImage);
    deleteOldFile(existing.maharishiImage);
    (existing.galleryImages || []).forEach((g) => deleteOldFile(g.image));

    await InnerAwakeningSection.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Inner Awakening section deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};