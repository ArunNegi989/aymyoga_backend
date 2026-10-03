const Model = require("../../models/courses/bestYogaSchoolModelrishikesh");

/* =========================
   HELPER
========================= */
const parseJSON = (val) => {
  try {
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
};

/* =========================
   EXTRACT FILES
========================= */
const extractImages = (files) => {
  let heroImage = "";
  let mediaMainImage = "";
  const mediaSmallImages = {};
  const accredImages = {};
  const courseImages = {};
  const specialtyImages = {};

  files.forEach((file) => {
    if (file.fieldname === "heroImage") {
      heroImage = "/uploads/" + file.filename;
    }

    if (file.fieldname === "mediaMainImage") {
      mediaMainImage = "/uploads/" + file.filename;
    }

    if (file.fieldname.startsWith("mediaSmallImage_")) {
      const index = file.fieldname.replace("mediaSmallImage_", "");
      mediaSmallImages[index] = "/uploads/" + file.filename;
    }

    if (file.fieldname.startsWith("accredImg_")) {
      const id = file.fieldname.replace("accredImg_", "");
      accredImages[id] = "/uploads/" + file.filename;
    }

    if (file.fieldname.startsWith("courseImg_")) {
      const id = file.fieldname.replace("courseImg_", "");
      courseImages[id] = "/uploads/" + file.filename;
    }

    if (file.fieldname.startsWith("specialtyImg_")) {
      const id = file.fieldname.replace("specialtyImg_", "");
      specialtyImages[id] = "/uploads/" + file.filename;
    }
  });

  return {
    heroImage,
    mediaMainImage,
    mediaSmallImages,
    accredImages,
    courseImages,
    specialtyImages,
  };
};

/* =========================
   CREATE (ONLY ONE)
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

    const {
      heroImage,
      mediaMainImage,
      mediaSmallImages,
      accredImages,
      courseImages,
      specialtyImages,
    } = extractImages(req.files || []);

    let accredBadges = parseJSON(req.body.accredBadges);
    let courseCards = parseJSON(req.body.courseCards);
    let specialtyCourses = parseJSON(req.body.specialtyCourses);
    let mediaSmallImagesArray = parseJSON(req.body.mediaSmallImages) || [];
    let trainingTags = parseJSON(req.body.trainingTags);
    let pillsItems = parseJSON(req.body.pillsItems);

    accredBadges = accredBadges.map((item) => ({
      ...item,
      imgUrl: accredImages[item.id] || item.imgUrl || "",
    }));

    courseCards = courseCards.map((item) => ({
      ...item,
      imgUrl: courseImages[item.id] || item.imgUrl || "",
    }));

    specialtyCourses = specialtyCourses.map((item) => ({
      ...item,
      imgUrl: specialtyImages[item.id] || item.imgUrl || "",
    }));

    mediaSmallImagesArray = mediaSmallImagesArray.map((item, index) => ({
      ...item,
      imgUrl: mediaSmallImages[index] || item.imgUrl || "",
    }));

    const data = {
      status: req.body.status,
      heroTitle: req.body.heroTitle,
      heroImage,

      accrSectionTitle: req.body.accrSectionTitle,
      coursesSectionTitle: req.body.coursesSectionTitle,
      specialtySectionTitle: req.body.specialtySectionTitle,

      bodyParagraphs1: parseJSON(req.body.bodyParagraphs1),
      bodyParagraphs2: parseJSON(req.body.bodyParagraphs2),

      accredBadges,
      courseCards,
      specialtyCourses,

      inlineLinks: parseJSON(req.body.inlineLinks),
      inlineLinks2: parseJSON(req.body.inlineLinks2),

      courseInfoCardTitle: req.body.courseInfoCardTitle || "COURSE DETAILS",
      courseInfoFeeLabel: req.body.courseInfoFeeLabel || "COURSE FEE",
      courseInfoFeeFromText: req.body.courseInfoFeeFromText || "starting from",
      courseInfoBookBtnText: req.body.courseInfoBookBtnText || "BOOK NOW",
      courseInfoUsdPrice: parseFloat(req.body.courseInfoUsdPrice) || 999,
      courseInfoInrPrice: parseFloat(req.body.courseInfoInrPrice) || 82000,
      courseInfoOriginalUsdPrice:
        parseFloat(req.body.courseInfoOriginalUsdPrice) || 1799,
      courseInfoOriginalInrPrice:
        parseFloat(req.body.courseInfoOriginalInrPrice) || 148000,
      courseInfoDetails: parseJSON(req.body.courseInfoDetails),

      contentBadgeText:
        req.body.contentBadgeText || "Welcome to AYM Yoga School",
      contentTitleHighlight: req.body.contentTitleHighlight || "Rishikesh",
      mediaMainImage,
      mediaMainImageAlt: req.body.mediaMainImageAlt || "Yoga Teacher Training",
      mediaMainVideoUrl: req.body.mediaMainVideoUrl || "",
      mediaSmallImages: mediaSmallImagesArray,
      trainingTags: trainingTags || [],
      pillsItems: pillsItems || [],
      accrEyebrowText: req.body.accrEyebrowText || "Certified & Recognised",
      accrTaglineText:
        req.body.accrTaglineText ||
        "Yoga Alliance USA & Ministry of AYUSH, Government of India",
    };

    const created = await Model.create(data);

    res.json({
      success: true,
      message: "Created successfully",
      data: created,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET
========================= */
exports.get = async (req, res) => {
  try {
    const data = await Model.findOne();

    res.json({
      success: true,
      data: data || null,
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

    const {
      heroImage,
      mediaMainImage,
      mediaSmallImages,
      accredImages,
      courseImages,
      specialtyImages,
    } = extractImages(req.files || []);

    let accredBadges = parseJSON(req.body.accredBadges);
    let courseCards = parseJSON(req.body.courseCards);
    let specialtyCourses = parseJSON(req.body.specialtyCourses);
    let mediaSmallImagesArray = parseJSON(req.body.mediaSmallImages) || [];
    let trainingTags = parseJSON(req.body.trainingTags);
    let pillsItems = parseJSON(req.body.pillsItems);

    // map images
    accredBadges = accredBadges.map((item) => ({
      ...item,
      imgUrl: accredImages[item.id] || item.imgUrl || "",
    }));

    courseCards = courseCards.map((item) => ({
      ...item,
      imgUrl: courseImages[item.id] || item.imgUrl || "",
    }));

    specialtyCourses = specialtyCourses.map((item) => ({
      ...item,
      imgUrl: specialtyImages[item.id] || item.imgUrl || "",
    }));

    // Map media small images
    mediaSmallImagesArray = mediaSmallImagesArray.map((item, index) => ({
      ...item,
      imgUrl: mediaSmallImages[index] || item.imgUrl || "",
    }));

    const updateData = {
      status: req.body.status,
      heroTitle: req.body.heroTitle,

      accrSectionTitle: req.body.accrSectionTitle,
      coursesSectionTitle: req.body.coursesSectionTitle,
      specialtySectionTitle: req.body.specialtySectionTitle,

      bodyParagraphs1: parseJSON(req.body.bodyParagraphs1),
      bodyParagraphs2: parseJSON(req.body.bodyParagraphs2),

      accredBadges,
      courseCards,
      specialtyCourses,

      inlineLinks: parseJSON(req.body.inlineLinks),
      inlineLinks2: parseJSON(req.body.inlineLinks2),

      // Course Info Card Fields
      courseInfoCardTitle:
        req.body.courseInfoCardTitle ||
        existing.courseInfoCardTitle ||
        "COURSE DETAILS",
      courseInfoFeeLabel:
        req.body.courseInfoFeeLabel ||
        existing.courseInfoFeeLabel ||
        "COURSE FEE",
      courseInfoFeeFromText:
        req.body.courseInfoFeeFromText ||
        existing.courseInfoFeeFromText ||
        "starting from",
      courseInfoBookBtnText:
        req.body.courseInfoBookBtnText ||
        existing.courseInfoBookBtnText ||
        "BOOK NOW",
      courseInfoUsdPrice:
        parseFloat(req.body.courseInfoUsdPrice) ||
        existing.courseInfoUsdPrice ||
        999,
      courseInfoInrPrice:
        parseFloat(req.body.courseInfoInrPrice) ||
        existing.courseInfoInrPrice ||
        82000,
      courseInfoOriginalUsdPrice:
        parseFloat(req.body.courseInfoOriginalUsdPrice) ||
        existing.courseInfoOriginalUsdPrice ||
        1799,
      courseInfoOriginalInrPrice:
        parseFloat(req.body.courseInfoOriginalInrPrice) ||
        existing.courseInfoOriginalInrPrice ||
        148000,
      courseInfoDetails: parseJSON(req.body.courseInfoDetails),

      // Media Gallery Fields
      contentBadgeText:
        req.body.contentBadgeText ||
        existing.contentBadgeText ||
        "Welcome to AYM Yoga School",
      contentTitleHighlight:
        req.body.contentTitleHighlight ||
        existing.contentTitleHighlight ||
        "Rishikesh",
      mediaMainImageAlt:
        req.body.mediaMainImageAlt ||
        existing.mediaMainImageAlt ||
        "Yoga Teacher Training",
      mediaMainVideoUrl:
        req.body.mediaMainVideoUrl || existing.mediaMainVideoUrl || "",
      mediaSmallImages: mediaSmallImagesArray,
      trainingTags: trainingTags || [],
      pillsItems: pillsItems || [],
      accrEyebrowText:
        req.body.accrEyebrowText ||
        existing.accrEyebrowText ||
        "Certified & Recognised",
      accrTaglineText:
        req.body.accrTaglineText ||
        existing.accrTaglineText ||
        "Yoga Alliance USA & Ministry of AYUSH, Government of India",
    };

    if (heroImage) {
      updateData.heroImage = heroImage;
    }

    if (mediaMainImage) {
      updateData.mediaMainImage = mediaMainImage;
    }

    const updated = await Model.findByIdAndUpdate(existing._id, updateData, {
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

exports.remove = async (req, res) => {
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
