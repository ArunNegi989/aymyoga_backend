const Yoga200 = require("../../models/courses/yoga200Model");

/* =========================
   CREATE
========================= */
exports.createYoga200 = async (req, res) => {
  try {
    const body = req.body;

    const getPath = (file) =>
      file ? `/uploads/${file.filename}` : null;

    const multiPaths = (files) =>
      files ? files.map((f) => `/uploads/${f.filename}`) : [];

    /* =========================
       FIX 1: STATS ARRAY
    ========================= */
    const stats = [1, 2, 3, 4].map((i) => ({
      icon: body[`stat${i}Icon`] || "",
      val: body[`stat${i}Val`] || "",
      title: body[`stat${i}Title`] || "",
      desc: body[`stat${i}Desc`] || "",
    }));

    /* =========================
       FIX 2: MODULES ARRAY
    ========================= */
    const modules = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
      title: body[`mod${i}Title`] || "",
      intro: body[`mod${i}Intro`] || "",
      items: body[`mod${i}Items`]
        ? Array.isArray(body[`mod${i}Items`])
          ? body[`mod${i}Items`]
          : [body[`mod${i}Items`]]
        : [],
      body: body[`mod${i}Body`] || "",
    }));

    /* =========================
       FINAL DATA
    ========================= */
    const data = {
      ...body,

      stats,
      modules,

      // images
      heroImage: getPath(req.files?.["heroImage"]?.[0]),
      ashtangaImage: getPath(req.files?.["ashtangaImage"]?.[0]),
      hathaImage: getPath(req.files?.["hathaImage"]?.[0]),
      requirementsImage: getPath(req.files?.["requirementsImage"]?.[0]),

      accommodationImages: multiPaths(req.files?.["accommodationImages"]),
      foodImages: multiPaths(req.files?.["foodImages"]),
      luxuryImages: multiPaths(req.files?.["luxuryImages"]),
      scheduleImages: multiPaths(req.files?.["scheduleImages"]),

      // JSON fields
      scheduleRows: JSON.parse(body.scheduleRows || "[]"),
      instructionLangs: JSON.parse(body.instructionLangs || "[]"),
      indianFees: JSON.parse(body.indianFees || "[]"),
      hatha43: JSON.parse(body.hatha43 || "[]"),
      weekGrid: JSON.parse(body.weekGrid || "[]"),
      programs: JSON.parse(body.programs || "[]"),
      reviews: JSON.parse(body.reviews || "[]"),
      faqItems: JSON.parse(body.faqItems || "[]"),
      knowQA: JSON.parse(body.knowQA || "[]"),

      // array fix (IMPORTANT)
      aimsBullets: Array.isArray(body.aimsBullets)
        ? body.aimsBullets
        : [body.aimsBullets].filter(Boolean),

      includedFee: Array.isArray(body.includedFee)
        ? body.includedFee
        : [body.includedFee].filter(Boolean),

      notIncludedFee: Array.isArray(body.notIncludedFee)
        ? body.notIncludedFee
        : [body.notIncludedFee].filter(Boolean),
    };

    const newData = await Yoga200.create(data);

    res.status(201).json({
      success: true,
      message: "Yoga 200 created successfully",
      data: newData,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ALL
========================= */
exports.getYoga200 = async (req, res) => {
  try {
    const data = await Yoga200.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.getSingleYoga200 = async (req, res) => {
  try {
    const data = await Yoga200.findById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.updateYoga200 = async (req, res) => {
  try {
    const body = req.body;

    const updated = await Yoga200.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* =========================
   DELETE
========================= */
exports.deleteYoga200 = async (req, res) => {
  try {
    await Yoga200.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};