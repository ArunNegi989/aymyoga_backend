const Model = require("../../models/courses/Yoga200Content");

/* ═══════════════════════════════════════════════
   SHARED HELPERS
═══════════════════════════════════════════════ */

/** Pick first element if array, else return raw value as string */
const getSingle = (val) => {
  if (Array.isArray(val)) return val[0] ?? "";
  return val ?? "";
};

/** Safe JSON.parse with a fallback default */
const parseJSON = (val, def = []) => {
  try {
    return val ? JSON.parse(val) : def;
  } catch {
    return def;
  }
};

/** Normalise multer path to a forward-slash URL path */
const path = require("path");

const normalizePath = (filePath) => {
  if (!filePath) return "";

  const normalized = filePath.replace(/\\/g, "/");

  // sirf uploads ke baad wala path lo
  const uploadIndex = normalized.indexOf("/uploads/");

  if (uploadIndex !== -1) {
    return normalized.substring(uploadIndex);
  }

  return `/uploads/${path.basename(normalized)}`;
};
/**
 * Rich-text fields come from the frontend as PLAIN HTML strings appended
 * directly to FormData (no JSON.stringify wrapper — that was removed in the
 * frontend fix).  We still call this helper so old data encoded with
 * JSON.stringify continues to decode correctly, while plain HTML passes
 * through unchanged.
 */
const decodeHtml = (val) => {
  if (!val) return "";
  const raw = Array.isArray(val) ? val[0] : val;
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return parsed;
    return raw;
  } catch {
    return raw; // already plain HTML — return as-is
  }
};

/**
 * Build the full data object that is common to both CREATE and UPDATE.
 * Keeps both handlers DRY and guarantees every field is processed the
 * same way in both paths.
 */
const buildDataObject = (body, files) => {
  /* ── file lookup helper ── */
  const getFile = (name) => {
    const file = files.find((f) => f.fieldname === name);
    return file ? normalizePath(file.path) : null; // null = not uploaded
  };

  /* ── Dynamic intro paragraphs ── */
  const introParaCount = parseInt(getSingle(body.introParaCount)) || 0;
  const introParaFields = {};
  for (let i = 1; i <= Math.max(introParaCount, 10); i++) {
    if (body[`introPara${i}`] !== undefined) {
      introParaFields[`introPara${i}`] = getSingle(body[`introPara${i}`]);
    }
  }

  /* ── Programs — merge uploaded images with JSON payload ── */
  const parsedPrograms = parseJSON(body.programs);
  const programsWithImages = parsedPrograms.map((p, i) => {
    const progFile = files.find((f) => f.fieldname === `programImage${i}`);
    return {
      ...p,
      image: progFile ? normalizePath(progFile.path) : p.image || "",
    };
  });

  /* ── aimsIntro dynamic paragraphs ── */
  const aimsIntro = Object.keys(body)
    .filter((k) => /^aimsIntro\d+$/.test(k))
    .sort(
      (a, b) =>
        parseInt(a.replace("aimsIntro", "")) -
        parseInt(b.replace("aimsIntro", "")),
    )
    .map((k) => getSingle(body[k]));

  /* ── syllabusIntro dynamic paragraphs ── */
  const syllabusIntro = Object.keys(body)
    .filter((k) => /^syllabusIntro\d+$/.test(k))
    .sort(
      (a, b) =>
        parseInt(a.replace("syllabusIntro", "")) -
        parseInt(b.replace("syllabusIntro", "")),
    )
    .map((k) => getSingle(body[k]));

  /* ── Stats array ── */
  const stats = [1, 2, 3, 4].map((i) => ({
    icon: getSingle(body[`stat${i}Icon`]),
    value: getSingle(body[`stat${i}Val`]),
    title: getSingle(body[`stat${i}Title`]),
    desc: getSingle(body[`stat${i}Desc`]),
  }));

  /* ═══════════════════════════════════════════
     MAIN DATA OBJECT — every form field mapped
  ═══════════════════════════════════════════ */
  const data = {
    /* ── meta ── */
    slug: getSingle(body.slug),
    status: getSingle(body.status) || "Active",

    /* ── hero ── */
    pageMainH1: getSingle(body.pageMainH1),
    heroImgAlt: getSingle(body.heroImgAlt),

    /* ── intro paragraphs ── */
    ...introParaFields,
    introParaCount,

    /* ── course card ── */
    courseCardHeaderLabel: getSingle(body.courseCardHeaderLabel),
    courseCardItem1Label: getSingle(body.courseCardItem1Label),
    courseCardItem1Value: getSingle(body.courseCardItem1Value),
    courseCardItem2Label: getSingle(body.courseCardItem2Label),
    courseCardItem2Value: getSingle(body.courseCardItem2Value),
    courseCardItem3Label: getSingle(body.courseCardItem3Label),
    courseCardItem3Value: getSingle(body.courseCardItem3Value),
    courseCardItem4Label: getSingle(body.courseCardItem4Label),
    courseCardItem4Value: getSingle(body.courseCardItem4Value),
    courseCardItem4Sub: getSingle(body.courseCardItem4Sub),
    courseCardItem5Label: getSingle(body.courseCardItem5Label),
    courseCardItem5Value: getSingle(body.courseCardItem5Value),
    courseCardItem6Label: getSingle(body.courseCardItem6Label),
    courseCardItem6Value: getSingle(body.courseCardItem6Value),
    courseCardFeeLabel: getSingle(body.courseCardFeeLabel),
    courseCardFeeFrom: getSingle(body.courseCardFeeFrom),
    courseCardOldPrice: getSingle(body.courseCardOldPrice),
    courseCardNewPrice: getSingle(body.courseCardNewPrice),
    courseCardPriceCurrency: getSingle(body.courseCardPriceCurrency),
    courseCardBookBtnText: getSingle(body.courseCardBookBtnText),
    courseCardBookBtnUrl: getSingle(body.courseCardBookBtnUrl),

    /* ── video ── */
    videoBadgeText: getSingle(body.videoBadgeText),
    videoUrl: getSingle(body.videoUrl),

    /* ── stats ── */
    stats,

    /* ── aims & objectives ── */
    aimsH3: getSingle(body.aimsH3),
    aimsKeyObjLabel: getSingle(body.aimsKeyObjLabel),
    aimsIntro,
    aimsBullets: [].concat(body.aimsBullets || []),
    aimsOutro: decodeHtml(body.aimsOutro),

    /* ── COURSE OVERVIEW — all 6 label/value pairs ── */
    overviewH2: getSingle(body.overviewH2),
    overviewSubPara: getSingle(body.overviewSubPara),
    overviewCertLabel: getSingle(body.overviewCertLabel),
    overviewCertName: getSingle(body.overviewCertName),
    overviewLevelLabel: getSingle(body.overviewLevelLabel),
    overviewLevel: getSingle(body.overviewLevel),
    overviewEligLabel: getSingle(body.overviewEligLabel),
    overviewEligibility: getSingle(body.overviewEligibility),
    overviewAgeLabel: getSingle(body.overviewAgeLabel),
    overviewMinAge: getSingle(body.overviewMinAge),
    overviewCreditsLabel: getSingle(body.overviewCreditsLabel),
    overviewCredits: getSingle(body.overviewCredits),
    overviewLangLabel: getSingle(body.overviewLangLabel),
    overviewLanguage: getSingle(body.overviewLanguage),

    /* ── upcoming dates ── */
    batchSectionTag: getSingle(body.batchSectionTag),
    upcomingDatesH2: getSingle(body.upcomingDatesH2),
    upcomingDatesSubtext: getSingle(body.upcomingDatesSubtext),

    /* ── fee inclusions - FIXED: Parse from JSON strings ── */
    feeIncludedTitle: getSingle(body.feeIncludedTitle),
    feeNotIncludedTitle: getSingle(body.feeNotIncludedTitle),
    includedFee: (() => {
      const raw = getSingle(body.includedFee);
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [raw];
      }
    })(),
    notIncludedFee: (() => {
      const raw = getSingle(body.notIncludedFee);
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [raw];
      }
    })(),

    /* ── syllabus ── */
    syllabusH3: getSingle(body.syllabusH3),
    syllabusIntro,

    /* ── modules ── */
    modules: parseJSON(body.modules),

    /* ── ashtanga ── */
    ashtangaH2: getSingle(body.ashtangaH2),
    ashtangaSubtitle: getSingle(body.ashtangaSubtitle),
    ashtangaImgAlt: getSingle(body.ashtangaImgAlt),
    ashtangaDesc: decodeHtml(body.ashtangaDesc),
    ashtangaPill1: getSingle(body.ashtangaPill1),
    ashtangaPill2: getSingle(body.ashtangaPill2),
    ashtangaPill3: getSingle(body.ashtangaPill3),

    /* ── primary series ── */
    primarySeriesH3: getSingle(body.primarySeriesH3),
    primarySeriesSubtext: getSingle(body.primarySeriesSubtext),
    primaryIntro: decodeHtml(body.primaryIntro),
    foundationItems: [].concat(body.foundationItems || []),
    weekGrid: parseJSON(body.weekGrid),

    /* ── hatha yoga ── */
    hathaH2: getSingle(body.hathaH2),
    hathaSubtitle: getSingle(body.hathaSubtitle),
    hathaImgAlt: getSingle(body.hathaImgAlt),
    hathaDesc: decodeHtml(body.hathaDesc),
    hathaPill1: getSingle(body.hathaPill1),
    hathaPill2: getSingle(body.hathaPill2),
    hathaPill3: getSingle(body.hathaPill3),
    hatha43: parseJSON(body.hatha43),

    /* ── asanas section ── */
    asanasH2: getSingle(body.asanasH2),
    asanasSubtext: getSingle(body.asanasSubtext),

    /* ── programs ── */
    newProgramsH2: getSingle(body.newProgramsH2),
    newProgramsSubtext: getSingle(body.newProgramsSubtext),
    programs: programsWithImages,

    /* ── evaluation ── */
    evalH2: getSingle(body.evalH2),
    evalDesc: decodeHtml(body.evalDesc),

    /* ── luxury facilities ── */
    luxuryH2: getSingle(body.luxuryH2),
    luxFeatures: parseJSON(body.luxFeatures),

    /* ── indian fees ── */
    indianFeeH2: getSingle(body.indianFeeH2),
    indianFees: parseJSON(body.indianFees),

    /* ── daily schedule ── */
    scheduleH2: getSingle(body.scheduleH2),
    schedDesc: decodeHtml(body.schedDesc),
    schedRows: parseJSON(body.schedRows),

    /* ── more information ── */
    moreInfoH2: getSingle(body.moreInfoH2),
    instrLangs: parseJSON(body.instrLangs),
    spanishChineseNote: getSingle(body.spanishChineseNote),
    visaPassportTitle: getSingle(body.visaPassportTitle),
    visaPassportDesc: decodeHtml(body.visaPassportDesc),

    /* ── global certification ── */
    globalCertH2: getSingle(body.globalCertH2),
    globalCert1: decodeHtml(body.globalCert1),
    globalCert2: decodeHtml(body.globalCert2),

    /* ── requirements for enrollment ── */
    requirementsH2: getSingle(body.requirementsH2),
    requirementsImgAlt: getSingle(body.requirementsImgAlt),
    req1: decodeHtml(body.req1),
    req2: decodeHtml(body.req2),
    req3: decodeHtml(body.req3),
    req4: decodeHtml(body.req4),

    /* ── what you need to know ── */
    whatYouNeedH2: getSingle(body.whatYouNeedH2),
    knowQA: parseJSON(body.knowQA),

    /* ── why AYM ── */
    best200HrH4: getSingle(body.best200HrH4),
    best200Hr: decodeHtml(body.best200Hr),

    /* ── what's included ── */
    whatsIncludedH4: getSingle(body.whatsIncludedH4),
    whatIncl: parseJSON(body.whatIncl),

    /* ── booking steps ── */
    bookingH2: getSingle(body.bookingH2),
    step1Icon: getSingle(body.step1Icon),
    step1Title: getSingle(body.step1Title),
    bookingStep1Desc: decodeHtml(body.bookingStep1Desc),
    step2Icon: getSingle(body.step2Icon),
    step2Title: getSingle(body.step2Title),
    bookingStep2Desc: decodeHtml(body.bookingStep2Desc),
    step3Icon: getSingle(body.step3Icon),
    step3Title: getSingle(body.step3Title),
    bookingStep3Desc: decodeHtml(body.bookingStep3Desc),
    step4Icon: getSingle(body.step4Icon),
    step4Title: getSingle(body.step4Title),
    bookingStep4Desc: decodeHtml(body.bookingStep4Desc),

    /* ── faq ── */
    faqH2: getSingle(body.faqH2),
    faqItems: parseJSON(body.faqItems),

    /* ── cta ── */
    ctaTitle: getSingle(body.ctaTitle),
    ctaSubtitle: getSingle(body.ctaSubtitle),
    ctaApplyBtnText: getSingle(body.ctaApplyBtnText),
    ctaApplyUrl: getSingle(body.ctaApplyUrl),
    ctaPhone: getSingle(body.ctaPhone),
    whatsappNumber: getSingle(body.whatsappNumber),
    whatsappBtnText: getSingle(body.whatsappBtnText),

    /* ── seo ── */
    metaTitle: getSingle(body.metaTitle),
    metaDesc: getSingle(body.metaDesc),
    metaKeywords: getSingle(body.metaKeywords),

    /* ── eligibility / visa ── */
    eligibilityInfoTitle: getSingle(body.eligibilityInfoTitle),
    eligibilityInfoText: getSingle(body.eligibilityInfoText),
  };

  return { data, getFile };
};

/* ═══════════════════════════════════════════════
   CREATE
═══════════════════════════════════════════════ */
exports.create = async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || [];

    const { data, getFile } = buildDataObject(body, files);

    /* ── Images — required on create ── */
    data.heroImage = getFile("heroImage") || "";
    data.ashtangaImage = getFile("ashtangaImage") || "";
    data.hathaImage = getFile("hathaImage") || "";
    data.reqImage = getFile("reqImage") || "";
    data.aimsImage = getFile("aimsImage") || "";
    data.primarySeriesImage = getFile("primarySeriesImage") || "";

    data.luxImages = files
      .filter((f) => f.fieldname === "luxImages")
      .map((f) => normalizePath(f.path));

    data.schedImages = files
      .filter((f) => f.fieldname === "schedImages")
      .map((f) => normalizePath(f.path));

    /* ── Video ── */
    const videoFile = getFile("videoFile");
    if (videoFile) data.videoFile = videoFile;

    const doc = await Model.create(data);

    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: doc,
    });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ═══════════════════════════════════════════════
   GET ALL
═══════════════════════════════════════════════ */
exports.getAll = async (req, res) => {
  try {
    const data = await Model.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ═══════════════════════════════════════════════
   GET ONE
═══════════════════════════════════════════════ */
exports.getOne = async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    if (!data)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ═══════════════════════════════════════════════
   UPDATE
   Key fixes vs. old version:
   1. Uses buildDataObject() — all fields processed identically to CREATE
   2. Existing images are PRESERVED when no new file is uploaded
   3. existingLuxImages / existingSchedImages sent by the frontend are merged
      with any newly uploaded files so partial gallery updates work correctly
═══════════════════════════════════════════════ */
exports.update = async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || [];

    const { data, getFile } = buildDataObject(body, files);

    /* ── Single image fields — only overwrite if a new file was uploaded ── */
    const heroNew = getFile("heroImage");
    const ashtangaNew = getFile("ashtangaImage");
    const hathaNew = getFile("hathaImage");
    const reqNew = getFile("reqImage");
    const aimsNew = getFile("aimsImage");
    const primaryNew = getFile("primarySeriesImage");
    const videoFileNew = getFile("videoFile");

    if (heroNew) data.heroImage = heroNew;
    else if (body.existingHeroImage)
      data.heroImage = getSingle(body.existingHeroImage);

    if (ashtangaNew) data.ashtangaImage = ashtangaNew;
    else if (body.existingAshtangaImage)
      data.ashtangaImage = getSingle(body.existingAshtangaImage);

    if (hathaNew) data.hathaImage = hathaNew;
    else if (body.existingHathaImage)
      data.hathaImage = getSingle(body.existingHathaImage);

    if (reqNew) data.reqImage = reqNew;
    else if (body.existingReqImage)
      data.reqImage = getSingle(body.existingReqImage);

    if (aimsNew) data.aimsImage = aimsNew;
    else if (body.existingAimsImage)
      data.aimsImage = getSingle(body.existingAimsImage);

    if (primaryNew) data.primarySeriesImage = primaryNew;
    else if (body.existingPrimaryImage)
      data.primarySeriesImage = getSingle(body.existingPrimaryImage);

    if (videoFileNew) data.videoFile = videoFileNew;

    /* ── Gallery images — merge existing paths + new uploads ── */
    const existingLux = parseJSON(body.existingLuxImages, []);
    const existingSched = parseJSON(body.existingSchedImages, []);

    const newLuxImgs = files
      .filter((f) => f.fieldname === "luxImages")
      .map((f) => normalizePath(f.path));

    const newSchedImgs = files
      .filter((f) => f.fieldname === "schedImages")
      .map((f) => normalizePath(f.path));

    /* If new files uploaded, replace gallery; otherwise keep existing */
    data.luxImages = newLuxImgs.length
      ? [...existingLux, ...newLuxImgs]
      : existingLux;
    data.schedImages = newSchedImgs.length
      ? [...existingSched, ...newSchedImgs]
      : existingSched;

    /* ── Perform update ── */
    const updated = await Model.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: false,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ═══════════════════════════════════════════════
   DELETE
═══════════════════════════════════════════════ */
exports.delete = async (req, res) => {
  try {
    const deleted = await Model.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};