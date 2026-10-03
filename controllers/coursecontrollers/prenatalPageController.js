const PrenatalPage = require("../../models/courses/prenatalPageModel");

/* =========================
   HELPER
========================= */
const parseJSON = (field) => {
  try {
    return JSON.parse(field || "[]");
  } catch {
    return [];
  }
};

/* =========================
   BUILD DATA
========================= */
const buildData = (body, files) => {
  const data = {
    ...body,

    introExtraParagraphs: parseJSON(body.introExtraParagraphs),
    featuresExtraParagraphs: parseJSON(body.featuresExtraParagraphs),
    costsExtraParagraphs: parseJSON(body.costsExtraParagraphs),
    onlineExtraParagraphs: parseJSON(body.onlineExtraParagraphs),

    schedule: parseJSON(body.schedule),
    curriculum: parseJSON(body.curriculum),
    hoursSummary: parseJSON(body.hoursSummary),

    // Features Dynamic Fields
    featuresStats: parseJSON(body.featuresStats),
    featuresPills: parseJSON(body.featuresPills),

    // Location Dynamic Fields
    locationBadges: parseJSON(body.locationBadges),

    // Online Highlights
    onlineHighlights: parseJSON(body.onlineHighlights),

    // Course Info Card Fields
    courseInfoCardTitle: body.courseInfoCardTitle || "COURSE DETAILS",
    courseInfoFeeLabel: body.courseInfoFeeLabel || "COURSE FEE",
    courseInfoFeeFromText: body.courseInfoFeeFromText || "starting from",
    courseInfoBookBtnText: body.courseInfoBookBtnText || "BOOK NOW",
    courseInfoUsdPrice: parseFloat(body.courseInfoUsdPrice) || 399,
    courseInfoInrPrice: parseFloat(body.courseInfoInrPrice) || 33000,
    courseInfoOriginalUsdPrice:
      parseFloat(body.courseInfoOriginalUsdPrice) || 799,
    courseInfoOriginalInrPrice:
      parseFloat(body.courseInfoOriginalInrPrice) || 66000,
    courseInfoDetails: parseJSON(body.courseInfoDetails),

    // Features Video
    featuresVideoType: body.featuresVideoType || "none",
    featuresVideoUrl: body.featuresVideoUrl || "",
    featuresVideoLabel:
      body.featuresVideoLabel || "Watch Our Prenatal Yoga Sessions",

    // Online Section Video Fields
    onlineVideoType: body.onlineVideoType || "none",
    onlineVideoUrl: body.onlineVideoUrl || "",
    onlineVideoLabel: body.onlineVideoLabel || "Course Preview",

    // Online Section Fields
    onlineHeaderSubtitle: body.onlineHeaderSubtitle || "",
    onlineHighlightsTitle: body.onlineHighlightsTitle || "What You Get Online",
    onlineBonusIcon: body.onlineBonusIcon || "🎁",
    onlineBonusTitle: body.onlineBonusTitle || "Bonus Included",
    onlineBonusText:
      body.onlineBonusText ||
      "Free access to prenatal yoga community & monthly workshops",
    onlineCtaLabel: body.onlineCtaLabel || "Ready to begin your journey?",
    onlineCtaSub:
      body.onlineCtaSub ||
      "Join our next online batch · Flexible schedule · Globally certified",
    onlineCtaBtnText: body.onlineCtaBtnText || "Enrol Now",
    onlineCtaBtnUrl: body.onlineCtaBtnUrl || "#batch-section",

    // Location Map
    locationMapEmbedUrl: body.locationMapEmbedUrl || "",
    locationMapLabel:
      body.locationMapLabel || "📍 Tapovan, Rishikesh, Uttarakhand",
  };

  /* HERO IMAGE */
  if (files?.heroImage && files.heroImage[0]) {
    data.heroImage = "/uploads/" + files.heroImage[0].filename;
  }

  /* LOCATION IMAGE */
  if (files?.locationImage && files.locationImage[0]) {
    data.locationImage = "/uploads/" + files.locationImage[0].filename;
  }

  /* FEATURES VIDEO FILE - only save if type is 'local' */
  if (
    data.featuresVideoType === "local" &&
    files?.featuresVideoFile &&
    files.featuresVideoFile[0]
  ) {
    data.featuresVideoFile = "/uploads/" + files.featuresVideoFile[0].filename;
  } else if (data.featuresVideoType !== "local") {
    data.featuresVideoFile = "";
  }

  /* ONLINE VIDEO FILE - only save if type is 'local' */
  if (
    data.onlineVideoType === "local" &&
    files?.onlineVideoFile &&
    files.onlineVideoFile[0]
  ) {
    data.onlineVideoFile = "/uploads/" + files.onlineVideoFile[0].filename;
  } else if (data.onlineVideoType !== "local") {
    data.onlineVideoFile = "";
  }

  /* ONLINE VIDEO POSTER */
  if (files?.onlineVideoPoster && files.onlineVideoPoster[0]) {
    data.onlineVideoPoster = "/uploads/" + files.onlineVideoPoster[0].filename;
  }

  /* HERO GRID IMAGES */
  const heroGridAlts = parseJSON(body.heroGridAlts);
  const heroGridImages = [];

  for (let i = 0; i < 3; i++) {
    const imageKey = `heroGridImage${i}`;
    if (files && files[imageKey] && files[imageKey][0]) {
      heroGridImages.push({
        url: "/uploads/" + files[imageKey][0].filename,
        alt: heroGridAlts[i] || "",
      });
    } else if (body.existingGridImages) {
      const existingImages = parseJSON(body.existingGridImages);
      if (existingImages[i] && existingImages[i].url) {
        heroGridImages.push(existingImages[i]);
      }
    } else if (body.heroGridImages) {
      const existingGrid = parseJSON(body.heroGridImages);
      if (existingGrid[i] && existingGrid[i].url) {
        heroGridImages.push(existingGrid[i]);
      }
    }
  }

  if (heroGridImages.length) {
    data.heroGridImages = heroGridImages;
  }

  return data;
};

/* =========================
   CREATE
========================= */
exports.createPage = async (req, res) => {
  try {
    const existing = await PrenatalPage.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Page already exists. Use update instead.",
      });
    }

    const data = buildData(req.body, req.files);

    const created = await PrenatalPage.create(data);

    res.json({
      success: true,
      message: "Created successfully",
      data: created,
    });
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   UPDATE
========================= */
exports.updatePage = async (req, res) => {
  try {
    const existing = await PrenatalPage.findOne();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No page found to update",
      });
    }

    const data = buildData(req.body, req.files);

    const updated = await PrenatalPage.findByIdAndUpdate(existing._id, data, {
      new: true,
    });

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET
========================= */
exports.getPage = async (req, res) => {
  try {
    const page = await PrenatalPage.findOne();

    res.json({
      success: true,
      data: page,
    });
  } catch (err) {
    console.error("Get error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   DELETE
========================= */
exports.deletePage = async (req, res) => {
  try {
    const page = await PrenatalPage.findOne();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "No record found",
      });
    }

    await PrenatalPage.findByIdAndDelete(page._id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
