const fs = require("fs");
const path = require("path");
const YogaAshramSection = require("../models/yogaAshramModel");

/* ── Helpers ── */

// Safely parse a JSON string sent inside multipart/form-data.
// Falls back to [] / {} if the field is missing or invalid.
const safeParse = (value, fallback = []) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Build the public path for an uploaded file (served from /uploads)
const filePathFor = (file) => (file ? `/uploads/${file.filename}` : undefined);

// Delete a file from disk if it exists (used when replacing/removing images)
const removeFileIfExists = (relativePath) => {
  if (!relativePath) return;
  const filename = relativePath.split("/").pop();
  const fullPath = path.join("uploads", filename);
  fs.unlink(fullPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to delete file:", fullPath, err.message);
    }
  });
};

// Fields that are stored as arrays of plain strings (paragraphs, badges, etc.)
const STRING_ARRAY_FIELDS = [
  "welcomeParagraphs",
  "experienceParagraphs",
  "certBadges",
  "whatParagraphs",
  "whyParagraphs",
];

// Fields that are stored as arrays of objects (stats, timeline, pills, cards, etc.)
const OBJECT_ARRAY_FIELDS = [
  "welcomeStats",
  "timelineItems",
  "coursePills",
  "whatIcons",
  "whyCards",
  "activities",
  "coursesList",
];

// Simple string fields saved as-is
const SIMPLE_STRING_FIELDS = [
  "heroImageAlt",
  "mainTitle",
  "featureImageAlt",
  "quoteText",
  "experienceTitle",
  "bestSectionLabel",
  "bestSectionTitle",
  "aboutCardTitle",
  "aboutCardText",
  "coursesCardTitle",
  "coursesCardText",
  "ashramPhotoAlt",
  "photoCaptionTitle",
  "photoCaptionSub",
  "whatSectionLabel",
  "whatSectionTitle",
  "pullquote",
  "whatExtraParagraph",
  "whySectionLabel",
  "whySectionTitle",
  "whySectionLink",
  "actSectionLabel",
  "actSectionTitle",
  "actIntroText",
  "actBottomText",
  "coursesHeading",
];

// Build a payload object from req.body + req.files, ready to save/update
const buildPayload = (body, files) => {
  const payload = {};

  SIMPLE_STRING_FIELDS.forEach((key) => {
    if (body[key] !== undefined) payload[key] = body[key];
  });

  STRING_ARRAY_FIELDS.forEach((key) => {
    if (body[key] !== undefined) payload[key] = safeParse(body[key], []);
  });

  OBJECT_ARRAY_FIELDS.forEach((key) => {
    if (body[key] !== undefined) payload[key] = safeParse(body[key], []);
  });

  if (files?.heroImage?.[0]) payload.heroImage = filePathFor(files.heroImage[0]);
  if (files?.featureImage?.[0]) payload.featureImage = filePathFor(files.featureImage[0]);
  if (files?.ashramPhoto?.[0]) payload.ashramPhoto = filePathFor(files.ashramPhoto[0]);

  return payload;
};

/* ── GET — list (singleton, returns latest doc) ── */
exports.getYogaAshramSection = async (req, res) => {
  try {
    const data = await YogaAshramSection.findOne().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getYogaAshramSection error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch yoga ashram section" });
  }
};

/* ── GET by id ── */
exports.getYogaAshramSectionById = async (req, res) => {
  try {
    const data = await YogaAshramSection.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Yoga ashram section not found" });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getYogaAshramSectionById error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch yoga ashram section" });
  }
};

/* ── POST — create ── */
exports.createYogaAshramSection = async (req, res) => {
  try {
    const existing = await YogaAshramSection.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A yoga ashram section already exists. Please edit the existing one instead.",
      });
    }

    const payload = buildPayload(req.body, req.files);
    const created = await YogaAshramSection.create(payload);

    return res.status(201).json({ success: true, message: "Yoga ashram section created", data: created });
  } catch (error) {
    console.error("createYogaAshramSection error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create yoga ashram section" });
  }
};

/* ── PUT — update ── */
exports.updateYogaAshramSection = async (req, res) => {
  try {
    const existing = await YogaAshramSection.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Yoga ashram section not found" });
    }

    const payload = buildPayload(req.body, req.files);

    // If a new image was uploaded, delete the old one from disk
    if (payload.heroImage && existing.heroImage) removeFileIfExists(existing.heroImage);
    if (payload.featureImage && existing.featureImage) removeFileIfExists(existing.featureImage);
    if (payload.ashramPhoto && existing.ashramPhoto) removeFileIfExists(existing.ashramPhoto);

    const updated = await YogaAshramSection.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: "Yoga ashram section updated", data: updated });
  } catch (error) {
    console.error("updateYogaAshramSection error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update yoga ashram section" });
  }
};

/* ── DELETE ── */
exports.deleteYogaAshramSection = async (req, res) => {
  try {
    const existing = await YogaAshramSection.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Yoga ashram section not found" });
    }

    removeFileIfExists(existing.heroImage);
    removeFileIfExists(existing.featureImage);
    removeFileIfExists(existing.ashramPhoto);

    await YogaAshramSection.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: "Yoga ashram section deleted" });
  } catch (error) {
    console.error("deleteYogaAshramSection error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete yoga ashram section" });
  }
};