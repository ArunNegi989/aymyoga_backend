const Worldwide = require("../../models/courses/worldwidemodel");

/* =========================
   PARSE FUNCTION
========================= */
const parseData = (req, existing = {}) => {
  const body = req.body;

  const parseJSON = (val) => {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  };

  return {
    slug: body.slug,
    status: body.status,

    pageTitleH1: body.pageTitleH1,
    heroImgAlt: body.heroImgAlt,
    heroImage: req.files?.heroImage
      ? "/uploads/" + req.files.heroImage[0].filename
      : existing.heroImage,

    // Top paragraphs
    topParagraphs: Array.from(
      { length: Number(body.topParagraphCount || 0) },
      (_, i) => body[`topPara${i + 1}`]
    ),

    // Stats
    statsTitle: body.statsTitle,
    stats: parseJSON(body.stats),

    // Curriculum
    curriculumTitle: body.curriculumTitle,
    curriculumSubHeading: body.curriculumSubHeading,
    curriculumIntro: body.curriculumIntro,
    curriculumParagraphs: Array.from(
      { length: Number(body.curriculumParagraphCount || 0) },
      (_, i) => body[`curriculumPara${i + 1}`]
    ),
    curriculumItems: parseJSON(body.curriculumItems),

    curriculumRightImage: req.files?.curriculumRightImage
      ? "/uploads/" + req.files.curriculumRightImage[0].filename
      : existing.curriculumRightImage,

    curriculumRightImageAlt: body.curriculumRightImageAlt,

    // Teacher
    teacherTeamTitle: body.teacherTeamTitle,
    teacherTeamSubtitle: body.teacherTeamSubtitle,
    teacherTeamDescription: body.teacherTeamDescription,

    teacherTeamLeftImage: req.files?.teacherTeamLeftImage
      ? "/uploads/" + req.files.teacherTeamLeftImage[0].filename
      : existing.teacherTeamLeftImage,

    teacherTeamLeftImageAlt: body.teacherTeamLeftImageAlt,
    teacherTeamBadgeValue: body.teacherTeamBadgeValue,
    teacherTeamBadgeLabel: body.teacherTeamBadgeLabel,

    // Benefits
    benefitsHeading: body.benefitsHeading,
    benefitsTitle: body.benefitsTitle,
    benefitsSubtext: body.benefitsSubtext,
    benefits: parseJSON(body.benefits),

    // Wellness
    wellnessTitle: body.wellnessTitle,
    wellnessDescription: body.wellnessDescription,

    // Community
    communityTitle: body.communityTitle,
    communitySubtext: body.communitySubtext,
    communityDescription: body.communityDescription,

    // Locations
    locationsTitle: body.locationsTitle,
    locationsSubtext: body.locationsSubtext,
    locations: parseJSON(body.locations),

    // Footer
    footerTitle: body.footerTitle,
    footerSubtext: body.footerSubtext,
    footerMetaText: body.footerMetaText,
  };
};

/* =========================
   CREATE (ONLY ONE RECORD)
========================= */
exports.createContent = async (req, res) => {
  try {
    const existing = await Worldwide.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Only one record allowed. Use update.",
      });
    }

    const data = parseData(req);
    const newData = await Worldwide.create(data);

    res.json({ success: true, data: newData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET
========================= */
exports.getContent = async (req, res) => {
  try {
    const data = await Worldwide.findOne();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.updateContent = async (req, res) => {
  try {
    const existing = await Worldwide.findOne();
    if (!existing) {
      return res.status(404).json({ message: "No data found" });
    }

    const updatedData = parseData(req, existing);

    const updated = await Worldwide.findByIdAndUpdate(
      existing._id,
      updatedData,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE
========================= */
exports.deleteContent = async (req, res) => {
  try {
    const existing = await Worldwide.findOne();
    if (!existing) {
      return res.status(404).json({ message: "No data found" });
    }

    await Worldwide.findByIdAndDelete(existing._id);

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};