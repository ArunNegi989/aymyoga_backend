const Model = require("../../models/courses/kundaliniTTCModel");

/* =========================
   HELPERS
========================= */

const parseJSON = (val) => {
  try {
    const parsed = val ? JSON.parse(val) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const getFilePath = (files, key) => {
  if (!files || !files[key]) return "";
  return `/uploads/${files[key][0].filename}`;
};

/* =========================
   CREATE
========================= */
exports.create = async (req, res) => {
  try {
    const exists = await Model.findOne();

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Only one record allowed. Use update.",
      });
    }

    const body = req.body;

    const data = {
      ...body,

      whatIsParagraphs: parseJSON(body.whatIsParagraphs),
      activateParagraphs: parseJSON(body.activateParagraphs),
      eligibilityParagraphs: parseJSON(body.eligibilityParagraphs),
      locationParagraphs: parseJSON(body.locationParagraphs),

      syllabusModules: parseJSON(body.syllabusModules),
      benefitItems: parseJSON(body.benefitItems),
      highlightCards: parseJSON(body.highlightCards),
      readingItems: parseJSON(body.readingItems),
      facilityItems: parseJSON(body.facilityItems),
      scheduleItems: parseJSON(body.scheduleItems),
      whyCards: parseJSON(body.whyCards),
      typesItems: parseJSON(body.typesItems),
      refundItems: parseJSON(body.refundItems),
      sylBadges: parseJSON(body.sylBadges),
      eligibilityPills: parseJSON(body.eligibilityPills),
      locationStats: parseJSON(body.locationStats),
      facilityIconCards: parseJSON(body.facilityIconCards),

      schedulePhaseLabels: parseJSON(body.schedulePhaseLabels),
      scheduleStats: parseJSON(body.scheduleStats),

      whyRishikeshBannerStats: parseJSON(body.whyRishikeshBannerStats),

      refundIcons: parseJSON(body.refundIcons),
      refundColors: parseJSON(body.refundColors),
      refundTrustItems: parseJSON(body.refundTrustItems),

      courseInfoDetails: parseJSON(body.courseInfoDetails),
      courseInfoCardTitle: body.courseInfoCardTitle || "COURSE DETAILS",
      courseInfoFeeLabel: body.courseInfoFeeLabel || "COURSE FEE",
      courseInfoFeeFromText: body.courseInfoFeeFromText || "starting from",
      courseInfoBookBtnText: body.courseInfoBookBtnText || "BOOK NOW",
      courseInfoUsdPrice: parseFloat(body.courseInfoUsdPrice) || 999,
      courseInfoInrPrice: parseFloat(body.courseInfoInrPrice) || 82000,
      courseInfoOriginalUsdPrice:
        parseFloat(body.courseInfoOriginalUsdPrice) || 1799,
      courseInfoOriginalInrPrice:
        parseFloat(body.courseInfoOriginalInrPrice) || 148000,

      whatIsImageAlt:
        body.whatIsImageAlt || "Kundalini Yoga meditation practice",
      whatIsImage: getFilePath(req.files, "whatIsImage"),

      activateImageAlt: body.activateImageAlt || "Kundalini Yoga practice",
      activateImage: getFilePath(req.files, "activateImage"),

      curriculumImageAlt:
        body.curriculumImageAlt || "Kundalini Yoga teacher training class",
      curriculumImage: getFilePath(req.files, "curriculumImage"),

      sylHeaderBgImageAlt:
        body.sylHeaderBgImageAlt || "Kundalini Yoga syllabus header background",
      sylHeaderBgImage: getFilePath(req.files, "sylHeaderBgImage"),
      courseOverviewBadgeText:
        body.courseOverviewBadgeText || "Learn · Practice · Teach",

      eligibilityImage: getFilePath(req.files, "eligibilityImage"),
      eligibilityImageAlt:
        body.eligibilityImageAlt || "Yoga students practicing",
      eligibilityBadgeTitle: body.eligibilityBadgeTitle || "Open to All",
      eligibilityBadgeSub:
        body.eligibilityBadgeSub || "No prerequisites required",
      eligibilityChip1Num: body.eligibilityChip1Num || "0",
      eligibilityChip1Label: body.eligibilityChip1Label || "Age Limit",
      eligibilityChip2Num: body.eligibilityChip2Num || "All",
      eligibilityChip2Label: body.eligibilityChip2Label || "Backgrounds",

      locationBannerImage: getFilePath(req.files, "locationBannerImage"),
      locationBannerImageAlt:
        body.locationBannerImageAlt || "Rishikesh mountains",
      locationStackTopImage: getFilePath(req.files, "locationStackTopImage"),
      locationStackTopImageAlt: body.locationStackTopImageAlt || "Yoga class",
      locationStackTopLabel: body.locationStackTopLabel || "Practice Hall",
      locationStackBottomImage: getFilePath(
        req.files,
        "locationStackBottomImage",
      ),
      locationStackBottomImageAlt:
        body.locationStackBottomImageAlt || "Ashram view",
      locationStackBottomLabel:
        body.locationStackBottomLabel || "Himalayan Setting",

      facilitiesVideoUrl: body.facilitiesVideoUrl || "",
      facilitiesVideoPoster: getFilePath(req.files, "facilitiesVideoPoster"),
      facilitiesVideoTag: body.facilitiesVideoTag || "LIVE · BREATHE · GROW",
      facilitiesVideoText:
        body.facilitiesVideoText ||
        "Everything you need for a transformative 24-day residential experience",

      scheduleTagLine: body.scheduleTagLine || "24-DAY RESIDENTIAL PROGRAM",
      scheduleHeaderSub:
        body.scheduleHeaderSub ||
        "A carefully structured day balancing intense practice with rest, study &amp; spiritual integration.",
      scheduleNoteIcon: body.scheduleNoteIcon || "📌",
      scheduleNoteText:
        body.scheduleNoteText ||
        "Schedule may vary slightly by week. Self-study & personal practice time is built into each day.",
      scheduleQuoteText:
        body.scheduleQuoteText ||
        "Sadhana is the foundation. When you practice every day with discipline and devotion, transformation becomes inevitable.",
      scheduleQuoteAuthor: body.scheduleQuoteAuthor || "— Yogi Bhajan",
      scheduleImg1Tag: body.scheduleImg1Tag || "Morning Practice",
      scheduleImg2Tag: body.scheduleImg2Tag || "Evening Sadhana",

      whyRishikeshBannerImage: getFilePath(
        req.files,
        "whyRishikeshBannerImage",
      ),
      whyRishikeshBannerImageAlt:
        body.whyRishikeshBannerImageAlt || "Rishikesh Himalayan landscape",
      whyRishikeshBannerTag:
        body.whyRishikeshBannerTag || "Sacred City · Yoga Capital of the World",

      spiritualIcon: body.spiritualIcon || "🕉️",
      naturalIcon: body.naturalIcon || "🌿",

      typesIcon: body.typesIcon || "📋",
      topSchoolsIcon: body.topSchoolsIcon || "🏆",

      aymPillText:
        body.aymPillText || "AYM Yoga School — Ranked among Rishikesh's finest",

      refundTagLine: body.refundTagLine || "TRANSPARENCY & TRUST",
      refundHeaderSub:
        body.refundHeaderSub ||
        "We believe in clear, fair policies. Here's everything you need to know about our cancellation terms.",

      heroImage: getFilePath(req.files, "heroImage"),
      classImage: getFilePath(req.files, "classImage"),
      schedImg1: getFilePath(req.files, "schedImg1"),
      schedImg2: getFilePath(req.files, "schedImg2"),
    };

    const newData = await Model.create(data);

    res.json({
      success: true,
      message: "Created successfully",
      data: newData,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.get = async (req, res) => {
  try {
    const data = await Model.findOne();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    const existing = await Model.findOne();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No record found",
      });
    }

    const body = req.body;

    const updatedData = {
      ...body,

      // arrays
      whatIsParagraphs: parseJSON(body.whatIsParagraphs),
      activateParagraphs: parseJSON(body.activateParagraphs),
      eligibilityParagraphs: parseJSON(body.eligibilityParagraphs),
      locationParagraphs: parseJSON(body.locationParagraphs),

      syllabusModules: parseJSON(body.syllabusModules),
      benefitItems: parseJSON(body.benefitItems),
      highlightCards: parseJSON(body.highlightCards),
      readingItems: parseJSON(body.readingItems),
      facilityItems: parseJSON(body.facilityItems),
      scheduleItems: parseJSON(body.scheduleItems),
      whyCards: parseJSON(body.whyCards),
      typesItems: parseJSON(body.typesItems),
      refundItems: parseJSON(body.refundItems),
      sylBadges: parseJSON(body.sylBadges),
      eligibilityPills: parseJSON(body.eligibilityPills),
      locationStats: parseJSON(body.locationStats),
      facilityIconCards: parseJSON(body.facilityIconCards),

      // Schedule Dynamic Fields
      schedulePhaseLabels: parseJSON(body.schedulePhaseLabels),
      scheduleStats: parseJSON(body.scheduleStats),

      whyRishikeshBannerStats: parseJSON(body.whyRishikeshBannerStats),

      refundIcons: parseJSON(body.refundIcons),
      refundColors: parseJSON(body.refundColors),
      refundTrustItems: parseJSON(body.refundTrustItems),

      courseInfoDetails: parseJSON(body.courseInfoDetails),
      courseInfoCardTitle:
        body.courseInfoCardTitle ||
        existing.courseInfoCardTitle ||
        "COURSE DETAILS",
      courseInfoFeeLabel:
        body.courseInfoFeeLabel || existing.courseInfoFeeLabel || "COURSE FEE",
      courseInfoFeeFromText:
        body.courseInfoFeeFromText ||
        existing.courseInfoFeeFromText ||
        "starting from",
      courseInfoBookBtnText:
        body.courseInfoBookBtnText ||
        existing.courseInfoBookBtnText ||
        "BOOK NOW",
      courseInfoUsdPrice:
        parseFloat(body.courseInfoUsdPrice) ||
        existing.courseInfoUsdPrice ||
        999,
      courseInfoInrPrice:
        parseFloat(body.courseInfoInrPrice) ||
        existing.courseInfoInrPrice ||
        82000,
      courseInfoOriginalUsdPrice:
        parseFloat(body.courseInfoOriginalUsdPrice) ||
        existing.courseInfoOriginalUsdPrice ||
        1799,
      courseInfoOriginalInrPrice:
        parseFloat(body.courseInfoOriginalInrPrice) ||
        existing.courseInfoOriginalInrPrice ||
        148000,

      whatIsImageAlt:
        body.whatIsImageAlt ||
        existing.whatIsImageAlt ||
        "Kundalini Yoga meditation practice",

      activateImageAlt:
        body.activateImageAlt ||
        existing.activateImageAlt ||
        "Kundalini Yoga practice",

      curriculumImageAlt:
        body.curriculumImageAlt ||
        existing.curriculumImageAlt ||
        "Kundalini Yoga teacher training class",

      sylHeaderBgImageAlt:
        body.sylHeaderBgImageAlt ||
        existing.sylHeaderBgImageAlt ||
        "Kundalini Yoga syllabus header background",
      courseOverviewBadgeText:
        body.courseOverviewBadgeText ||
        existing.courseOverviewBadgeText ||
        "Learn · Practice · Teach",

      eligibilityImageAlt:
        body.eligibilityImageAlt ||
        existing.eligibilityImageAlt ||
        "Yoga students practicing",
      eligibilityBadgeTitle:
        body.eligibilityBadgeTitle ||
        existing.eligibilityBadgeTitle ||
        "Open to All",
      eligibilityBadgeSub:
        body.eligibilityBadgeSub ||
        existing.eligibilityBadgeSub ||
        "No prerequisites required",
      eligibilityChip1Num:
        body.eligibilityChip1Num || existing.eligibilityChip1Num || "0",
      eligibilityChip1Label:
        body.eligibilityChip1Label ||
        existing.eligibilityChip1Label ||
        "Age Limit",
      eligibilityChip2Num:
        body.eligibilityChip2Num || existing.eligibilityChip2Num || "All",
      eligibilityChip2Label:
        body.eligibilityChip2Label ||
        existing.eligibilityChip2Label ||
        "Backgrounds",

      locationBannerImageAlt:
        body.locationBannerImageAlt ||
        existing.locationBannerImageAlt ||
        "Rishikesh mountains",
      locationStackTopImageAlt:
        body.locationStackTopImageAlt ||
        existing.locationStackTopImageAlt ||
        "Yoga class",
      locationStackTopLabel:
        body.locationStackTopLabel ||
        existing.locationStackTopLabel ||
        "Practice Hall",
      locationStackBottomImageAlt:
        body.locationStackBottomImageAlt ||
        existing.locationStackBottomImageAlt ||
        "Ashram view",
      locationStackBottomLabel:
        body.locationStackBottomLabel ||
        existing.locationStackBottomLabel ||
        "Himalayan Setting",

      facilitiesVideoUrl:
        body.facilitiesVideoUrl || existing.facilitiesVideoUrl || "",
      facilitiesVideoTag:
        body.facilitiesVideoTag ||
        existing.facilitiesVideoTag ||
        "LIVE · BREATHE · GROW",
      facilitiesVideoText:
        body.facilitiesVideoText ||
        existing.facilitiesVideoText ||
        "Everything you need for a transformative 24-day residential experience",

      scheduleTagLine:
        body.scheduleTagLine ||
        existing.scheduleTagLine ||
        "24-DAY RESIDENTIAL PROGRAM",
      scheduleHeaderSub:
        body.scheduleHeaderSub ||
        existing.scheduleHeaderSub ||
        "A carefully structured day balancing intense practice with rest, study &amp; spiritual integration.",
      scheduleNoteIcon:
        body.scheduleNoteIcon || existing.scheduleNoteIcon || "📌",
      scheduleNoteText:
        body.scheduleNoteText ||
        existing.scheduleNoteText ||
        "Schedule may vary slightly by week. Self-study & personal practice time is built into each day.",
      scheduleQuoteText:
        body.scheduleQuoteText ||
        existing.scheduleQuoteText ||
        "Sadhana is the foundation. When you practice every day with discipline and devotion, transformation becomes inevitable.",
      scheduleQuoteAuthor:
        body.scheduleQuoteAuthor ||
        existing.scheduleQuoteAuthor ||
        "— Yogi Bhajan",
      scheduleImg1Tag:
        body.scheduleImg1Tag || existing.scheduleImg1Tag || "Morning Practice",
      scheduleImg2Tag:
        body.scheduleImg2Tag || existing.scheduleImg2Tag || "Evening Sadhana",

      whyRishikeshBannerImageAlt:
        body.whyRishikeshBannerImageAlt ||
        existing.whyRishikeshBannerImageAlt ||
        "Rishikesh Himalayan landscape",
      whyRishikeshBannerTag:
        body.whyRishikeshBannerTag ||
        existing.whyRishikeshBannerTag ||
        "Sacred City · Yoga Capital of the World",

      spiritualIcon: body.spiritualIcon || existing.spiritualIcon || "🕉️",
      naturalIcon: body.naturalIcon || existing.naturalIcon || "🌿",

      typesIcon: body.typesIcon || existing.typesIcon || "📋",
      topSchoolsIcon: body.topSchoolsIcon || existing.topSchoolsIcon || "🏆",

      aymPillText:
        body.aymPillText ||
        existing.aymPillText ||
        "AYM Yoga School — Ranked among Rishikesh's finest",

      refundTagLine:
        body.refundTagLine || existing.refundTagLine || "TRANSPARENCY & TRUST",
      refundHeaderSub:
        body.refundHeaderSub ||
        existing.refundHeaderSub ||
        "We believe in clear, fair policies. Here's everything you need to know about our cancellation terms.",
    };

    if (req.files?.whatIsImage) {
      updatedData.whatIsImage = getFilePath(req.files, "whatIsImage");
    }

    if (req.files?.activateImage) {
      updatedData.activateImage = getFilePath(req.files, "activateImage");
    }

    if (req.files?.curriculumImage) {
      updatedData.curriculumImage = getFilePath(req.files, "curriculumImage");
    }

    if (req.files?.sylHeaderBgImage) {
      updatedData.sylHeaderBgImage = getFilePath(req.files, "sylHeaderBgImage");
    }

    if (req.files?.eligibilityImage) {
      updatedData.eligibilityImage = getFilePath(req.files, "eligibilityImage");
    }

    if (req.files?.locationBannerImage) {
      updatedData.locationBannerImage = getFilePath(
        req.files,
        "locationBannerImage",
      );
    }

    if (req.files?.locationStackTopImage) {
      updatedData.locationStackTopImage = getFilePath(
        req.files,
        "locationStackTopImage",
      );
    }

    if (req.files?.locationStackBottomImage) {
      updatedData.locationStackBottomImage = getFilePath(
        req.files,
        "locationStackBottomImage",
      );
    }

    if (req.files?.facilitiesVideoPoster) {
      updatedData.facilitiesVideoPoster = getFilePath(
        req.files,
        "facilitiesVideoPoster",
      );
    }

    if (req.files?.whyRishikeshBannerImage) {
      updatedData.whyRishikeshBannerImage = getFilePath(
        req.files,
        "whyRishikeshBannerImage",
      );
    }
    if (req.files?.heroImage) {
      updatedData.heroImage = getFilePath(req.files, "heroImage");
    }

    if (req.files?.classImage) {
      updatedData.classImage = getFilePath(req.files, "classImage");
    }

    if (req.files?.schedImg1) {
      updatedData.schedImg1 = getFilePath(req.files, "schedImg1");
    }
    if (req.files?.schedImg2) {
      updatedData.schedImg2 = getFilePath(req.files, "schedImg2");
    }

    const updated = await Model.findByIdAndUpdate(existing._id, updatedData, {
      new: true,
    });

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   DELETE
========================= */
exports.delete = async (req, res) => {
  try {
    const existing = await Model.findOne();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No record found",
      });
    }

    await Model.findByIdAndDelete(existing._id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
