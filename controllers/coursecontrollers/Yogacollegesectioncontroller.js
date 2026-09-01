const fs = require("fs");
const path = require("path");
const YogaCollegeSection = require("../../models/courses/Yogacollegesection");

/* ─────────────────────── Helpers ─────────────────────── */

// Fields sent as JSON strings in multipart/form-data — parse them safely
const parseJSON = (val, fallback) => {
  if (val === undefined || val === null || val === "") return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

// req.files (from upload.fields) → { fieldname: [file] }
const getFilePath = (files, fieldname) => {
  const f = files?.[fieldname]?.[0];
  if (!f) return undefined;
  // adjust this to however your upload.js exposes the public path
  return f.path ? `/uploads/${path.basename(f.path)}` : undefined;
};

const deleteOldFile = (filePath) => {
  if (!filePath) return;
  const abs = path.join(__dirname, "..", filePath.replace(/^\//, ""));
  fs.unlink(abs, () => {}); // ignore errors (file may already be gone)
};

/* Build the plain update object shared by create + update.
   `files` = req.files, `existing` = current doc (for update, to know which
   image fields to keep/replace). */
const buildPayload = (body, files, existing = {}) => {
  const payload = {
    heroImageAlt: body.heroImageAlt,
    heroTitle: body.heroTitle,
    heroSubtitle: body.heroSubtitle,

    aimImage1Alt: body.aimImage1Alt,
    aimImage2Alt: body.aimImage2Alt,
    aimImage3Alt: body.aimImage3Alt,

    introImageAlt: body.introImageAlt,
    highlightImageAlt: body.highlightImageAlt,

    protocolTab: parseJSON(body.protocolTab, existing.protocolTab),
    wellnessTab: parseJSON(body.wellnessTab, existing.wellnessTab),
    teacherTab: parseJSON(body.teacherTab, existing.teacherTab),
    masterTab: parseJSON(body.masterTab, existing.masterTab),

    highlightBadge: body.highlightBadge,
    highlightTitle: body.highlightTitle,
    highlightSubtitle: body.highlightSubtitle,

    certSectionLabel: body.certSectionLabel,
    certSectionTitle: body.certSectionTitle,
    certCards: parseJSON(body.certCards, existing.certCards),

    coursesSectionLabel: body.coursesSectionLabel,
    coursesSectionTitle: body.coursesSectionTitle,
    coursesSectionSub: body.coursesSectionSub,

    collegeSectionLabel: body.collegeSectionLabel,
    collegeHeading: body.collegeHeading,
    collegeParagraph: body.collegeParagraph,
    collegeHighlights: parseJSON(body.collegeHighlights, existing.collegeHighlights),
    collegeImageAlt: body.collegeImageAlt,
    collegeImageBadge: body.collegeImageBadge,

    collegeCoursesHeading: body.collegeCoursesHeading,
    collegeCourses: parseJSON(body.collegeCourses, existing.collegeCourses),

    maObjectivesHeading: body.maObjectivesHeading,
    maObjectives: parseJSON(body.maObjectives, existing.maObjectives),
    maObjectivesImageAlt: body.maObjectivesImageAlt,
    maObjectivesImageBadge: body.maObjectivesImageBadge,

    admissionsSectionLabel: body.admissionsSectionLabel,
    maEligibilityHeading: body.maEligibilityHeading,
    maEligibilityParagraph: body.maEligibilityParagraph,
    maDetailsGrid: parseJSON(body.maDetailsGrid, existing.maDetailsGrid),
    howToApplyHeading: body.howToApplyHeading,
    howToApplyParagraph: body.howToApplyParagraph,

    careerSectionLabel: body.careerSectionLabel,
    careerHeading: body.careerHeading,
    careerParagraphs: parseJSON(body.careerParagraphs, existing.careerParagraphs),
    careerOptions: parseJSON(body.careerOptions, existing.careerOptions),
    careerImageAlt: body.careerImageAlt,
    careerImageBadge: body.careerImageBadge,

    applyNowLink: body.applyNowLink,
    bookNowLink: body.bookNowLink,
    moreDetailsLink: body.moreDetailsLink,
  };

  // In-person courses: merge incoming meta with per-index uploaded images
  const incomingCourses = parseJSON(body.inPersonCourses, existing.inPersonCourses || []);
  payload.inPersonCourses = incomingCourses.map((course, i) => {
    const uploaded = getFilePath(files, `courseImage_${i}`);
    return {
      ...course,
      image: uploaded || course.image || existing.inPersonCourses?.[i]?.image,
    };
  });

  // Single image fields — only overwrite if a new file was uploaded
  const singleImageFields = [
    "heroImage",
    "aimImage1",
    "aimImage2",
    "aimImage3",
    "introImage",
    "highlightImage",
    "collegeImage",
    "maObjectivesImage",
    "careerImage",
  ];
  singleImageFields.forEach((field) => {
    const uploaded = getFilePath(files, field);
    if (uploaded) {
      // if replacing, clean up the old file on disk
      if (existing[field]) deleteOldFile(existing[field]);
      payload[field] = uploaded;
    }
  });

  return payload;
};

/* ─────────────────────── Controllers ─────────────────────── */

// GET /yoga-college-section  (list — usually just one doc, but kept generic)
exports.getAllYogaCollegeSections = async (req, res) => {
  try {
    const sections = await YogaCollegeSection.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /yoga-college-section/:id
exports.getYogaCollegeSectionById = async (req, res) => {
  try {
    const section = await YogaCollegeSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Yoga college section not found" });
    }
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /yoga-college-section
exports.createYogaCollegeSection = async (req, res) => {
  try {
    const payload = buildPayload(req.body, req.files, {});
    const section = await YogaCollegeSection.create(payload);
    res.status(201).json({ success: true, message: "Yoga college section created", data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /yoga-college-section/:id
exports.updateYogaCollegeSection = async (req, res) => {
  try {
    const existing = await YogaCollegeSection.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Yoga college section not found" });
    }
    const payload = buildPayload(req.body, req.files, existing.toObject());
    const updated = await YogaCollegeSection.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, message: "Yoga college section updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /yoga-college-section/:id
exports.deleteYogaCollegeSection = async (req, res) => {
  try {
    const section = await YogaCollegeSection.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Yoga college section not found" });
    }
    res.status(200).json({ success: true, message: "Yoga college section deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};