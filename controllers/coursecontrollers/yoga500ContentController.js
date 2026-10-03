const Yoga500 = require("../../models/courses/yoga500ContentModel");

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

const getArrayFiles = (files, key) => {
  if (!files || !files[key]) return [];
  return files[key].map((file) => "/uploads/" + file.filename);
};

/* =========================
   CREATE / REPLACE SINGLE
========================= */
exports.createContent = async (req, res) => {
  try {
    await Yoga500.deleteMany();

    const body = req.body;

    let introItems = parseJSON(body.introItems);

    if (req.files && req.files.introMedia && req.files.introMedia.length > 0) {
      const introMediaFiles = req.files.introMedia;
      let mediaIndex = 0;

      introItems = introItems.map((item) => {
        if (item.media === "new_upload" && introMediaFiles[mediaIndex]) {
          const newItem = {
            ...item,
            media: "/uploads/" + introMediaFiles[mediaIndex].filename,
          };
          mediaIndex++;
          return newItem;
        }
        return item;
      });
    }

    let videoUrl = "";
    if (req.files && req.files.videoFile && req.files.videoFile[0]) {
      videoUrl = "/uploads/" + req.files.videoFile[0].filename;
    } else if (body.existingVideoUrl) {
      videoUrl = body.existingVideoUrl;
    } else if (body.videoUrl) {
      videoUrl = body.videoUrl;
    }

    const data = {
      ...body,
      introItems: introItems,
      introParas: parseJSON(body.introParas),
      standApartParas: parseJSON(body.standApartParas),
      gainsParas: parseJSON(body.gainsParas),
      credibilityParas: parseJSON(body.credibilityParas),
      durationParas: parseJSON(body.durationParas),
      syllabusParas: parseJSON(body.syllabusParas),
      eligibilityParas: parseJSON(body.eligibilityParas),
      evaluationParas: parseJSON(body.evaluationParas),
      fictionParas: parseJSON(body.fictionParas),
      includedItems: parseJSON(body.includedItems),
      notIncludedItems: parseJSON(body.notIncludedItems),
      indianFees: parseJSON(body.indianFees),
      syllabusModules: parseJSON(body.syllabusModules),
      reviews: parseJSON(body.reviews),
      standApartPills: parseJSON(body.standApartPills),
      standApartStats: parseJSON(body.standApartStats),
      imgBadgeText: body.imgBadgeText || "500 Hr Advanced TTC",
      videoUrl: videoUrl,
      videoBadgeText: body.videoBadgeText || "✦ Featured Video ✦",
      videoTitle:
        body.videoTitle ||
        "Experience the Journey of 500 Hour Yoga Teacher Training",
      videoSubtitle: body.videoSubtitle || "Watch Our Students' Transformation",
      evalImageAlt: body.evalImageAlt || "Evaluation process",
      courseInfoDetails: parseJSON(body.courseInfoDetails),
      courseInfoCardTitle: body.courseInfoCardTitle || "COURSE DETAILS",
      courseInfoFeeLabel: body.courseInfoFeeLabel || "COURSE FEE",
      courseInfoFeeFromText: body.courseInfoFeeFromText || "starting from",
      courseInfoBookBtnText: body.courseInfoBookBtnText || "BOOK NOW",
      courseInfoOriginalPriceMultiplier:
        parseFloat(body.courseInfoOriginalPriceMultiplier) || 1.8,
      courseInfoUsdPrice: parseFloat(body.courseInfoUsdPrice) || 1649,
      courseInfoInrPrice: parseFloat(body.courseInfoInrPrice) || 135000,
      courseInfoOriginalUsdPrice:
        parseFloat(body.courseInfoOriginalUsdPrice) || 2950,
      courseInfoOriginalInrPrice:
        parseFloat(body.courseInfoOriginalInrPrice) || 240000,
      heroImage: req.files?.heroImage
        ? "/uploads/" + req.files.heroImage[0].filename
        : "",
      shivaImage: req.files?.shivaImage
        ? "/uploads/" + req.files.shivaImage[0].filename
        : "",
      evalImage: req.files?.evalImage
        ? "/uploads/" + req.files.evalImage[0].filename
        : "",
      accomImages: getArrayFiles(req.files, "accomImage"),
      foodImages: getArrayFiles(req.files, "foodImage"),
    };

    const newData = await Yoga500.create(data);
    res.json({ success: true, data: newData });
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.getContent = async (req, res) => {
  try {
    const data = await Yoga500.findOne();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Get error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.updateContent = async (req, res) => {
  try {
    const existing = await Yoga500.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const body = req.body;

    const newAccom = getArrayFiles(req.files, "accomImage");
    const newFood = getArrayFiles(req.files, "foodImage");

    const existingAccom = parseJSON(body.existingAccomImages);
    const existingFood = parseJSON(body.existingFoodImages);

    const finalAccom = [...existingAccom, ...newAccom];
    const finalFood = [...existingFood, ...newFood];

    let introItems = parseJSON(body.introItems);

    if (req.files && req.files.introMedia && req.files.introMedia.length > 0) {
      const introMediaFiles = req.files.introMedia;
      let mediaIndex = 0;

      introItems = introItems.map((item) => {
        if (item.media === "new_upload" && introMediaFiles[mediaIndex]) {
          const newItem = {
            ...item,
            media: "/uploads/" + introMediaFiles[mediaIndex].filename,
          };
          mediaIndex++;
          return newItem;
        }
        return item;
      });
    }

    let videoUrl = existing.videoUrl;
    if (req.files && req.files.videoFile && req.files.videoFile[0]) {
      videoUrl = "/uploads/" + req.files.videoFile[0].filename;
    } else if (body.existingVideoUrl === "remove") {
      videoUrl = "";
    } else if (body.videoUrl && !req.files?.videoFile) {
      videoUrl = body.videoUrl;
    }

    let evalImage = existing.evalImage;
    if (req.files && req.files.evalImage && req.files.evalImage[0]) {
      evalImage = "/uploads/" + req.files.evalImage[0].filename;
    }

    let heroImage = existing.heroImage;
    if (req.files && req.files.heroImage && req.files.heroImage[0]) {
      heroImage = "/uploads/" + req.files.heroImage[0].filename;
    }

    let shivaImage = existing.shivaImage;
    if (req.files && req.files.shivaImage && req.files.shivaImage[0]) {
      shivaImage = "/uploads/" + req.files.shivaImage[0].filename;
    }

    const updated = {
      ...body,
      introItems: introItems,
      introParas: parseJSON(body.introParas),
      standApartParas: parseJSON(body.standApartParas),
      gainsParas: parseJSON(body.gainsParas),
      credibilityParas: parseJSON(body.credibilityParas),
      durationParas: parseJSON(body.durationParas),
      syllabusParas: parseJSON(body.syllabusParas),
      eligibilityParas: parseJSON(body.eligibilityParas),
      evaluationParas: parseJSON(body.evaluationParas),
      fictionParas: parseJSON(body.fictionParas),
      includedItems: parseJSON(body.includedItems),
      notIncludedItems: parseJSON(body.notIncludedItems),
      indianFees: parseJSON(body.indianFees),
      syllabusModules: parseJSON(body.syllabusModules),
      reviews: parseJSON(body.reviews),
      standApartPills: parseJSON(body.standApartPills),
      standApartStats: parseJSON(body.standApartStats),
      imgBadgeText:
        body.imgBadgeText || existing.imgBadgeText || "500 Hr Advanced TTC",
      videoUrl: videoUrl,
      videoBadgeText:
        body.videoBadgeText || existing.videoBadgeText || "✦ Featured Video ✦",
      videoTitle:
        body.videoTitle ||
        existing.videoTitle ||
        "Experience the Journey of 500 Hour Yoga Teacher Training",
      videoSubtitle:
        body.videoSubtitle ||
        existing.videoSubtitle ||
        "Watch Our Students' Transformation",
      evalImageAlt:
        body.evalImageAlt || existing.evalImageAlt || "Evaluation process",
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
      courseInfoOriginalPriceMultiplier:
        parseFloat(body.courseInfoOriginalPriceMultiplier) ||
        existing.courseInfoOriginalPriceMultiplier ||
        1.8,
      courseInfoUsdPrice:
        parseFloat(body.courseInfoUsdPrice) ||
        existing.courseInfoUsdPrice ||
        1649,
      courseInfoInrPrice:
        parseFloat(body.courseInfoInrPrice) ||
        existing.courseInfoInrPrice ||
        135000,
      courseInfoOriginalUsdPrice:
        parseFloat(body.courseInfoOriginalUsdPrice) ||
        existing.courseInfoOriginalUsdPrice ||
        2950,
      courseInfoOriginalInrPrice:
        parseFloat(body.courseInfoOriginalInrPrice) ||
        existing.courseInfoOriginalInrPrice ||
        240000,
      heroImage: heroImage,
      shivaImage: shivaImage,
      evalImage: evalImage,
      accomImages: finalAccom,
      foodImages: finalFood,
    };

    const data = await Yoga500.findByIdAndUpdate(req.params.id, updated, {
      new: true,
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE
========================= */
exports.deleteContent = async (req, res) => {
  try {
    await Yoga500.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
};
