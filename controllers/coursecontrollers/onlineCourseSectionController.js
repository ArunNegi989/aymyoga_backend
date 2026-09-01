const fs = require("fs");
const path = require("path");
const OnlineCourseSection = require("../../models/courses/OnlineCourseSection");

/* ── helpers ── */
const parseJSON = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const findFile = (files, fieldname) =>
  (files || []).find((f) => f.fieldname === fieldname);

const removeFile = (relativePath) => {
  try {
    if (!relativePath) return;
    const filePath = path.join(process.cwd(), relativePath.replace(/^\//, ""));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Failed to remove file:", err.message);
  }
};

/* ── CREATE ── */
exports.createSection = async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || [];

    const heroFile = findFile(files, "heroImage");
    const whyFile = findFile(files, "whyImage");

    const introParagraphs = parseJSON(body.introParagraphs, []);
    const whyReasons = parseJSON(body.whyReasons, []);
    const keyBenefits = parseJSON(body.keyBenefits, []);
    const liveCourses = parseJSON(body.liveCourses, []);
    const faqs = parseJSON(body.faqs, []);
    const recordedCourses = parseJSON(body.recordedCourses, []);
    const infoBlocks = parseJSON(body.infoBlocks, []);
    const curriculumData = parseJSON(body.curriculumData, []);
    const existingCurriculumImages = parseJSON(body.existingCurriculumImages, []);
    const otherCoursesData = parseJSON(body.otherCoursesData, []);
    const existingOtherCourseImages = parseJSON(body.existingOtherCourseImages, []);

    const curriculumAreas = curriculumData.map((area, i) => {
      const file = findFile(files, `curriculumImage_${i}`);
      const image = file ? `/uploads/${file.filename}` : existingCurriculumImages[i] || null;
      return { ...area, image };
    });

    const otherCourses = otherCoursesData.map((course, i) => {
      const file = findFile(files, `otherCourseImage_${i}`);
      const image = file ? `/uploads/${file.filename}` : existingOtherCourseImages[i] || null;
      return { ...course, image };
    });

    const section = new OnlineCourseSection({
      heroImage: heroFile ? `/uploads/${heroFile.filename}` : null,
      heroImageAlt: body.heroImageAlt,

      introEyebrow: body.introEyebrow,
      introTitle: body.introTitle,
      introParagraphs,

      whyEyebrow: body.whyEyebrow,
      whyTitle: body.whyTitle,
      whyReasons,
      whyImage: whyFile ? `/uploads/${whyFile.filename}` : null,
      whyImageAlt: body.whyImageAlt,
      whyImageBadgeText: body.whyImageBadgeText,
      whyVideoEmbedUrl: body.whyVideoEmbedUrl,
      whyVideoBadgeText: body.whyVideoBadgeText,

      benefitsEyebrow: body.benefitsEyebrow,
      benefitsTitle: body.benefitsTitle,
      keyBenefits,

      coursesEyebrow: body.coursesEyebrow,
      coursesTitle: body.coursesTitle,
      liveCourses,

      seatBookingEyebrow: body.seatBookingEyebrow,
      seatBookingTitle: body.seatBookingTitle,
      seatBookingSubtitle: body.seatBookingSubtitle,

      noteBoxText: body.noteBoxText,
      faqEyebrow: body.faqEyebrow,
      faqTitle: body.faqTitle,
      faqs,

      curriculumEyebrow: body.curriculumEyebrow,
      curriculumTitle: body.curriculumTitle,
      curriculumAreas,

      recordedEyebrow: body.recordedEyebrow,
      recordedTitle: body.recordedTitle,
      recordedCourses,
      infoBlocks,

      otherEyebrow: body.otherEyebrow,
      otherTitle: body.otherTitle,
      otherCourses,
    });

    await section.save();

    return res.status(201).json({
      success: true,
      message: "Online course section created successfully",
      data: section,
    });
  } catch (error) {
    console.error("createSection error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create online course section",
    });
  }
};

/* ── INDEX (GET ALL) ── */
exports.getAllSections = async (req, res) => {
  try {
    const sections = await OnlineCourseSection.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: sections });
  } catch (error) {
    console.error("getAllSections error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch online course sections",
    });
  }
};

/* ── GET BY ID ── */
exports.getSectionById = async (req, res) => {
  try {
    const section = await OnlineCourseSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    return res.status(200).json({ success: true, data: section });
  } catch (error) {
    console.error("getSectionById error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch online course section",
    });
  }
};

/* ── UPDATE ── */
exports.updateSection = async (req, res) => {
  try {
    const existing = await OnlineCourseSection.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    const body = req.body;
    const files = req.files || [];

    const heroFile = findFile(files, "heroImage");
    const whyFile = findFile(files, "whyImage");

    // remove old top-level images if replaced
    if (heroFile && existing.heroImage) removeFile(existing.heroImage);
    if (whyFile && existing.whyImage) removeFile(existing.whyImage);

    const introParagraphs = parseJSON(body.introParagraphs, existing.introParagraphs);
    const whyReasons = parseJSON(body.whyReasons, existing.whyReasons);
    const keyBenefits = parseJSON(body.keyBenefits, existing.keyBenefits);
    const liveCourses = parseJSON(body.liveCourses, existing.liveCourses);
    const faqs = parseJSON(body.faqs, existing.faqs);
    const recordedCourses = parseJSON(body.recordedCourses, existing.recordedCourses);
    const infoBlocks = parseJSON(body.infoBlocks, existing.infoBlocks);
    const curriculumData = parseJSON(body.curriculumData, null);
    const existingCurriculumImages = parseJSON(body.existingCurriculumImages, []);
    const otherCoursesData = parseJSON(body.otherCoursesData, null);
    const existingOtherCourseImages = parseJSON(body.existingOtherCourseImages, []);

    // Curriculum areas (only rebuild if curriculumData sent)
    let curriculumAreas = existing.curriculumAreas;
    if (curriculumData) {
      curriculumAreas = curriculumData.map((area, i) => {
        const file = findFile(files, `curriculumImage_${i}`);
        const oldImage = existing.curriculumAreas?.[i]?.image;
        if (file && oldImage) removeFile(oldImage);
        const image = file ? `/uploads/${file.filename}` : existingCurriculumImages[i] || null;
        return { ...area, image };
      });
    }

    // Other courses (only rebuild if otherCoursesData sent)
    let otherCourses = existing.otherCourses;
    if (otherCoursesData) {
      otherCourses = otherCoursesData.map((course, i) => {
        const file = findFile(files, `otherCourseImage_${i}`);
        const oldImage = existing.otherCourses?.[i]?.image;
        if (file && oldImage) removeFile(oldImage);
        const image = file ? `/uploads/${file.filename}` : existingOtherCourseImages[i] || null;
        return { ...course, image };
      });
    }

    existing.heroImage = heroFile ? `/uploads/${heroFile.filename}` : existing.heroImage;
    existing.heroImageAlt = body.heroImageAlt ?? existing.heroImageAlt;

    existing.introEyebrow = body.introEyebrow ?? existing.introEyebrow;
    existing.introTitle = body.introTitle ?? existing.introTitle;
    existing.introParagraphs = introParagraphs;

    existing.whyEyebrow = body.whyEyebrow ?? existing.whyEyebrow;
    existing.whyTitle = body.whyTitle ?? existing.whyTitle;
    existing.whyReasons = whyReasons;
    existing.whyImage = whyFile ? `/uploads/${whyFile.filename}` : existing.whyImage;
    existing.whyImageAlt = body.whyImageAlt ?? existing.whyImageAlt;
    existing.whyImageBadgeText = body.whyImageBadgeText ?? existing.whyImageBadgeText;
    existing.whyVideoEmbedUrl = body.whyVideoEmbedUrl ?? existing.whyVideoEmbedUrl;
    existing.whyVideoBadgeText = body.whyVideoBadgeText ?? existing.whyVideoBadgeText;

    existing.benefitsEyebrow = body.benefitsEyebrow ?? existing.benefitsEyebrow;
    existing.benefitsTitle = body.benefitsTitle ?? existing.benefitsTitle;
    existing.keyBenefits = keyBenefits;

    existing.coursesEyebrow = body.coursesEyebrow ?? existing.coursesEyebrow;
    existing.coursesTitle = body.coursesTitle ?? existing.coursesTitle;
    existing.liveCourses = liveCourses;

    existing.seatBookingEyebrow = body.seatBookingEyebrow ?? existing.seatBookingEyebrow;
    existing.seatBookingTitle = body.seatBookingTitle ?? existing.seatBookingTitle;
    existing.seatBookingSubtitle = body.seatBookingSubtitle ?? existing.seatBookingSubtitle;

    existing.noteBoxText = body.noteBoxText ?? existing.noteBoxText;
    existing.faqEyebrow = body.faqEyebrow ?? existing.faqEyebrow;
    existing.faqTitle = body.faqTitle ?? existing.faqTitle;
    existing.faqs = faqs;

    existing.curriculumEyebrow = body.curriculumEyebrow ?? existing.curriculumEyebrow;
    existing.curriculumTitle = body.curriculumTitle ?? existing.curriculumTitle;
    existing.curriculumAreas = curriculumAreas;

    existing.recordedEyebrow = body.recordedEyebrow ?? existing.recordedEyebrow;
    existing.recordedTitle = body.recordedTitle ?? existing.recordedTitle;
    existing.recordedCourses = recordedCourses;
    existing.infoBlocks = infoBlocks;

    existing.otherEyebrow = body.otherEyebrow ?? existing.otherEyebrow;
    existing.otherTitle = body.otherTitle ?? existing.otherTitle;
    existing.otherCourses = otherCourses;

    await existing.save();

    return res.status(200).json({
      success: true,
      message: "Online course section updated successfully",
      data: existing,
    });
  } catch (error) {
    console.error("updateSection error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update online course section",
    });
  }
};

/* ── DELETE ── */
exports.deleteSection = async (req, res) => {
  try {
    const section = await OnlineCourseSection.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    removeFile(section.heroImage);
    removeFile(section.whyImage);
    (section.curriculumAreas || []).forEach((a) => removeFile(a.image));
    (section.otherCourses || []).forEach((c) => removeFile(c.image));

    return res.status(200).json({ success: true, message: "Section deleted successfully" });
  } catch (error) {
    console.error("deleteSection error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete online course section",
    });
  }
};