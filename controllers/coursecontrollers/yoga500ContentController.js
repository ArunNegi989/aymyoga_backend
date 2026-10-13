const Yoga500 = require("../../models/courses/yoga500ContentModel");

/* =========================
   HELPERS
========================= */

// fallback tab milta hai jab value missing ya invalid ho
const parseJSON = (val, fallback = []) => {
  if (val === undefined || val === null || val === "") return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

const getArrayFiles = (files, key) => {
  if (!files || !files[key]) return [];
  return files[key].map((file) => "/uploads/" + file.filename);
};

/* =========================
   CREATE / REPLACE SINGLE
   (unchanged logic)
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
   UPDATE  (SAFE MERGE)
   - ...body spread hata diya
   - jo field request mein nahi aayi, DB wali value as-it-is rehti hai
   - non-image arrays ko empty [] se overwrite nahi hone dete
   - $set use hota hai, sirf diye gaye fields badalte hain
========================= */
const TEXT_FIELDS = [
  "slug",
  "status",
  "pageMainH1",
  "heroImgAlt",
  "standApartH2",
  "gainsH2",
  "seatSectionH2",
  "seatSectionSubtext",
  "tableNoteText",
  "tableNoteEmail",
  "tableNoteAirportText",
  "credibilityH2",
  "durationH2",
  "syllabusH2",
  "eligibilityH3",
  "evaluationH3",
  "includedTitle",
  "includedNote",
  "notIncludedTitle",
  "fictionH3",
  "reviewsSectionH2",
  "refundH3",
  "refundPara",
  "applyH3",
  "applyPara",
  "indianFeeH3",
  "imgBadgeText",
  "videoBadgeText",
  "videoTitle",
  "videoSubtitle",
  "evalImageAlt",
  "courseInfoCardTitle",
  "courseInfoFeeLabel",
  "courseInfoFeeFromText",
  "courseInfoBookBtnText",
];

const NUMBER_FIELDS = [
  "courseInfoOriginalPriceMultiplier",
  "courseInfoUsdPrice",
  "courseInfoInrPrice",
  "courseInfoOriginalUsdPrice",
  "courseInfoOriginalInrPrice",
];

// Admin UI in lists ko kabhi poora khali nahi karne deta (min 1 item),
// isliye khali [] aaye to usse galti maan ke purana data rakhte hain.
const ARRAY_FIELDS = [
  "introParas",
  "standApartParas",
  "gainsParas",
  "credibilityParas",
  "durationParas",
  "syllabusParas",
  "eligibilityParas",
  "evaluationParas",
  "fictionParas",
  "includedItems",
  "notIncludedItems",
  "indianFees",
  "syllabusModules",
  "reviews",
  "standApartPills",
  "standApartStats",
  "courseInfoDetails",
];

exports.updateContent = async (req, res) => {
  try {
    const existing = await Yoga500.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const body = req.body || {};
    const updated = {};

    /* ---------- text fields ---------- */
    TEXT_FIELDS.forEach((k) => {
      if (body[k] !== undefined && body[k] !== "undefined") {
        updated[k] = body[k];
      }
    });

    /* ---------- number fields ---------- */
    NUMBER_FIELDS.forEach((k) => {
      if (body[k] !== undefined && body[k] !== "") {
        const n = parseFloat(body[k]);
        if (!isNaN(n)) updated[k] = n;
      }
    });

    /* ---------- array fields ---------- */
    ARRAY_FIELDS.forEach((k) => {
      if (body[k] === undefined) return; // aayi hi nahi -> purana rakho
      const incoming = parseJSON(body[k], null);
      if (!Array.isArray(incoming)) return; // invalid -> purana rakho
      const old = existing[k];
      if (incoming.length === 0 && Array.isArray(old) && old.length > 0) return;
      updated[k] = incoming;
    });

    /* ---------- intro items (+ new media upload mapping) ---------- */
    let introItems = existing.introItems || [];
    if (body.introItems !== undefined) {
      const parsed = parseJSON(body.introItems, null);
      if (
        Array.isArray(parsed) &&
        !(parsed.length === 0 && introItems.length > 0)
      ) {
        introItems = parsed;
      }
    }
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
    updated.introItems = introItems;

    /* ---------- accommodation / food images ---------- */
    const newAccom = getArrayFiles(req.files, "accomImage");
    const newFood = getArrayFiles(req.files, "foodImage");

    // frontend ne list bheji to wahi (user ne remove bhi kiya ho sakta hai),
    // nahi bheji to DB wali purani images rakho
    const keptAccom =
      body.existingAccomImages !== undefined
        ? parseJSON(body.existingAccomImages, existing.accomImages || [])
        : existing.accomImages || [];
    const keptFood =
      body.existingFoodImages !== undefined
        ? parseJSON(body.existingFoodImages, existing.foodImages || [])
        : existing.foodImages || [];

    updated.accomImages = [...keptAccom, ...newAccom];
    updated.foodImages = [...keptFood, ...newFood];

    /* ---------- video ---------- */
    let videoUrl = existing.videoUrl;
    if (req.files && req.files.videoFile && req.files.videoFile[0]) {
      videoUrl = "/uploads/" + req.files.videoFile[0].filename;
    } else if (body.existingVideoUrl === "remove") {
      videoUrl = "";
    }
    updated.videoUrl = videoUrl;

    /* ---------- single images ---------- */
    updated.heroImage = req.files?.heroImage?.[0]
      ? "/uploads/" + req.files.heroImage[0].filename
      : existing.heroImage;
    updated.shivaImage = req.files?.shivaImage?.[0]
      ? "/uploads/" + req.files.shivaImage[0].filename
      : existing.shivaImage;
    updated.evalImage = req.files?.evalImage?.[0]
      ? "/uploads/" + req.files.evalImage[0].filename
      : existing.evalImage;

    const data = await Yoga500.findByIdAndUpdate(
      req.params.id,
      { $set: updated },
      { new: true },
    );

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