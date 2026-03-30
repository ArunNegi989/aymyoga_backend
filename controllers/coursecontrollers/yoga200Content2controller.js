const Yoga200Content2 = require("../../models/courses/Yoga200Content2");
const fs   = require("fs");
const path = require("path");

/* ── Helper: delete file from disk ── */
const deleteFile = (filePath) => {
  try {
    const fullPath = path.join(__dirname, "../../", filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (err) {
    console.log("deleteFile error:", err);
  }
};

/* ── Helper: map multer files → URL paths ── */
const getPaths = (files) =>
  files ? files.map((f) => "/uploads/" + f.filename) : [];

/* ── Helper: safely parse all JSON array/object fields ── */
const parseArrayFields = (body) => ({
  programs:    JSON.parse(body.programs    || "[]"),
  reviews:     JSON.parse(body.reviews     || "[]"),
  inclFee:     JSON.parse(body.inclFee     || "[]"),
  notInclFee:  JSON.parse(body.notInclFee  || "[]"),
  luxFeatures: JSON.parse(body.luxFeatures || "[]"),
  whatIncl:    JSON.parse(body.whatIncl    || "[]"),
  instrLangs:  JSON.parse(body.instrLangs  || "[]"),
  indianFees:  JSON.parse(body.indianFees  || "[]"),
  schedRows:   JSON.parse(body.schedRows   || "[]"),
  faqItems:    JSON.parse(body.faqItems    || "[]"),
  knowQA:      JSON.parse(body.knowQA      || "[]"),
});

/* ════════════════════════════════════════
   CREATE  (only one record allowed)
════════════════════════════════════════ */
exports.createContent = async (req, res) => {
  try {
    const existing = await Yoga200Content2.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Only one record allowed ❌",
      });
    }

    const body    = req.body;
    const files   = req.files || {};
    const arrays  = parseArrayFields(body);

    const data = new Yoga200Content2({
      /* ── plain text / string fields (spread body, overrides below) ── */
      evalH2:               body.evalH2               || "",
      evalDesc:             body.evalDesc              || "",

      accommodationH2:      body.accommodationH2       || "",

      foodH2:               body.foodH2                || "",

      luxuryH2:             body.luxuryH2              || "",

      indianFeeH2:          body.indianFeeH2           || "",

      scheduleH2:           body.scheduleH2            || "",
      schedDesc:            body.schedDesc             || "",

      moreInfoH2:           body.moreInfoH2            || "",
      spanishChineseNote:   body.spanishChineseNote    || "",
      eligibilityInfoTitle: body.eligibilityInfoTitle  || "",
      eligibilityInfoText:  body.eligibilityInfoText   || "",
      visaPassportTitle:    body.visaPassportTitle      || "",
      visaPassportDesc:     body.visaPassportDesc       || "",

      ctaTitle:             body.ctaTitle              || "",
      ctaSubtitle:          body.ctaSubtitle           || "",
      ctaPhone:             body.ctaPhone              || "",
      ctaApplyBtnText:      body.ctaApplyBtnText       || "",

      newProgramsH2:        body.newProgramsH2         || "",
      newProgramsSubtext:   body.newProgramsSubtext    || "",

      globalCertH2:         body.globalCertH2          || "",
      globalCert1:          body.globalCert1           || "",
      globalCert2:          body.globalCert2           || "",

      requirementsH2:       body.requirementsH2        || "",
      requirementsImgAlt:   body.requirementsImgAlt    || "",
      req1:                 body.req1                  || "",
      req2:                 body.req2                  || "",
      req3:                 body.req3                  || "",
      req4:                 body.req4                  || "",

      whatYouNeedH2:        body.whatYouNeedH2         || "",

      best200HrH4:          body.best200HrH4           || "",
      best200Hr:            body.best200Hr             || "",

      whatsIncludedH4:      body.whatsIncludedH4       || "",

      reviewsH2:            body.reviewsH2             || "",
      reviewsSubtext:       body.reviewsSubtext        || "",

      videosH2:             body.videosH2              || "",
      video1Label:          body.video1Label           || "",
      video1Url:            body.video1Url             || "",
      video1Thumb:          body.video1Thumb           || "",
      video2Label:          body.video2Label           || "",
      video2Url:            body.video2Url             || "",
      video2Thumb:          body.video2Thumb           || "",
      video3Label:          body.video3Label           || "",
      video3Url:            body.video3Url             || "",
      video3Thumb:          body.video3Thumb           || "",

      bookingH2:            body.bookingH2             || "",
      step1Icon:            body.step1Icon             || "",
      step1Title:           body.step1Title            || "",
      bookingStep1Desc:     body.bookingStep1Desc      || "",
      step2Icon:            body.step2Icon             || "",
      step2Title:           body.step2Title            || "",
      bookingStep2Desc:     body.bookingStep2Desc      || "",
      step3Icon:            body.step3Icon             || "",
      step3Title:           body.step3Title            || "",
      bookingStep3Desc:     body.bookingStep3Desc      || "",
      step4Icon:            body.step4Icon             || "",
      step4Title:           body.step4Title            || "",
      bookingStep4Desc:     body.bookingStep4Desc      || "",

      faqH2:                body.faqH2                 || "",

      metaTitle:            body.metaTitle             || "",
      metaDesc:             body.metaDesc              || "",
      slug:                 body.slug                  || "",
      metaKeywords:         body.metaKeywords          || "",
      status:               body.status                || "Active",

      /* ── parsed arrays ── */
      ...arrays,

      /* ── image paths ── */
      accomImages:  getPaths(files["accomImages"]),
      foodImages:   getPaths(files["foodImages"]),
      luxImages:    getPaths(files["luxImages"]),
      schedImages:  getPaths(files["schedImages"]),
      reqImage:     files["reqImage"]
                      ? "/uploads/" + files["reqImage"][0].filename
                      : "",
    });

    await data.save();
    res.json({ success: true, message: "Created ✅", data });
  } catch (err) {
    console.error("createContent error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   GET  (single record, no ID)
════════════════════════════════════════ */
exports.getContent = async (req, res) => {
  try {
    const data = await Yoga200Content2.findOne();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   UPDATE  (no ID)
════════════════════════════════════════ */
exports.updateContent = async (req, res) => {
  try {
    const existing = await Yoga200Content2.findOne();
    if (!existing) {
      return res.status(404).json({ success: false, message: "No record found" });
    }

    const body   = req.body;
    const files  = req.files || {};
    const arrays = parseArrayFields(body);

    /* ── Images: keep old if no new file uploaded ── */
    let accomImages  = existing.accomImages;
    if (files["accomImages"]) {
      accomImages.forEach(deleteFile);
      accomImages = getPaths(files["accomImages"]);
    }

    let foodImages = existing.foodImages;
    if (files["foodImages"]) {
      foodImages.forEach(deleteFile);
      foodImages = getPaths(files["foodImages"]);
    }

    let luxImages = existing.luxImages;
    if (files["luxImages"]) {
      luxImages.forEach(deleteFile);
      luxImages = getPaths(files["luxImages"]);
    }

    let schedImages = existing.schedImages;
    if (files["schedImages"]) {
      schedImages.forEach(deleteFile);
      schedImages = getPaths(files["schedImages"]);
    }

    let reqImage = existing.reqImage;
    if (files["reqImage"]) {
      if (reqImage) deleteFile(reqImage);
      reqImage = "/uploads/" + files["reqImage"][0].filename;
    }

    const updated = await Yoga200Content2.findByIdAndUpdate(
      existing._id,
      {
        /* ── plain string fields ── */
        evalH2:               body.evalH2               || "",
        evalDesc:             body.evalDesc              || "",

        accommodationH2:      body.accommodationH2       || "",

        foodH2:               body.foodH2                || "",

        luxuryH2:             body.luxuryH2              || "",

        indianFeeH2:          body.indianFeeH2           || "",

        scheduleH2:           body.scheduleH2            || "",
        schedDesc:            body.schedDesc             || "",

        moreInfoH2:           body.moreInfoH2            || "",
        spanishChineseNote:   body.spanishChineseNote    || "",
        eligibilityInfoTitle: body.eligibilityInfoTitle  || "",
        eligibilityInfoText:  body.eligibilityInfoText   || "",
        visaPassportTitle:    body.visaPassportTitle      || "",
        visaPassportDesc:     body.visaPassportDesc       || "",

        ctaTitle:             body.ctaTitle              || "",
        ctaSubtitle:          body.ctaSubtitle           || "",
        ctaPhone:             body.ctaPhone              || "",
        ctaApplyBtnText:      body.ctaApplyBtnText       || "",

        newProgramsH2:        body.newProgramsH2         || "",
        newProgramsSubtext:   body.newProgramsSubtext    || "",

        globalCertH2:         body.globalCertH2          || "",
        globalCert1:          body.globalCert1           || "",
        globalCert2:          body.globalCert2           || "",

        requirementsH2:       body.requirementsH2        || "",
        requirementsImgAlt:   body.requirementsImgAlt    || "",
        req1:                 body.req1                  || "",
        req2:                 body.req2                  || "",
        req3:                 body.req3                  || "",
        req4:                 body.req4                  || "",

        whatYouNeedH2:        body.whatYouNeedH2         || "",

        best200HrH4:          body.best200HrH4           || "",
        best200Hr:            body.best200Hr             || "",

        whatsIncludedH4:      body.whatsIncludedH4       || "",

        reviewsH2:            body.reviewsH2             || "",
        reviewsSubtext:       body.reviewsSubtext        || "",

        videosH2:             body.videosH2              || "",
        video1Label:          body.video1Label           || "",
        video1Url:            body.video1Url             || "",
        video1Thumb:          body.video1Thumb           || "",
        video2Label:          body.video2Label           || "",
        video2Url:            body.video2Url             || "",
        video2Thumb:          body.video2Thumb           || "",
        video3Label:          body.video3Label           || "",
        video3Url:            body.video3Url             || "",
        video3Thumb:          body.video3Thumb           || "",

        bookingH2:            body.bookingH2             || "",
        step1Icon:            body.step1Icon             || "",
        step1Title:           body.step1Title            || "",
        bookingStep1Desc:     body.bookingStep1Desc      || "",
        step2Icon:            body.step2Icon             || "",
        step2Title:           body.step2Title            || "",
        bookingStep2Desc:     body.bookingStep2Desc      || "",
        step3Icon:            body.step3Icon             || "",
        step3Title:           body.step3Title            || "",
        bookingStep3Desc:     body.bookingStep3Desc      || "",
        step4Icon:            body.step4Icon             || "",
        step4Title:           body.step4Title            || "",
        bookingStep4Desc:     body.bookingStep4Desc      || "",

        faqH2:                body.faqH2                 || "",

        metaTitle:            body.metaTitle             || "",
        metaDesc:             body.metaDesc              || "",
        slug:                 body.slug                  || "",
        metaKeywords:         body.metaKeywords          || "",
        status:               body.status                || "Active",

        /* ── parsed arrays ── */
        ...arrays,

        /* ── resolved image paths ── */
        accomImages,
        foodImages,
        luxImages,
        schedImages,
        reqImage,
      },
      { new: true }
    );

    res.json({ success: true, message: "Updated ✅", data: updated });
  } catch (err) {
    console.error("updateContent error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   DELETE
════════════════════════════════════════ */
exports.deleteContent = async (req, res) => {
  try {
    const existing = await Yoga200Content2.findOne();
    if (!existing) {
      return res.status(404).json({ success: false, message: "No record found" });
    }

    existing.accomImages?.forEach(deleteFile);
    existing.foodImages?.forEach(deleteFile);
    existing.luxImages?.forEach(deleteFile);
    existing.schedImages?.forEach(deleteFile);
    if (existing.reqImage) deleteFile(existing.reqImage);

    await existing.deleteOne();
    res.json({ success: true, message: "Deleted 🗑️" });
  } catch (err) {
    console.error("deleteContent error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};