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
    // ❗ single record system
    await Yoga500.deleteMany();

    const body = req.body;

    const data = {
      ...body,

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
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.updateContent = async (req, res) => {
  try {
    const existing = await Yoga500.findById(req.params.id);

    if (!existing)
      return res.status(404).json({ message: "Not found" });

    const body = req.body;

    // ✅ get new uploaded images
    const newAccom = getArrayFiles(req.files, "accomImage");
    const newFood = getArrayFiles(req.files, "foodImage");

    const updated = {
      ...body,

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

      heroImage: req.files?.heroImage
        ? "/uploads/" + req.files.heroImage[0].filename
        : existing.heroImage,

      shivaImage: req.files?.shivaImage
        ? "/uploads/" + req.files.shivaImage[0].filename
        : existing.shivaImage,

      evalImage: req.files?.evalImage
        ? "/uploads/" + req.files.evalImage[0].filename
        : existing.evalImage,

      // ✅ FIXED LOGIC
      accomImages: newAccom.length
        ? newAccom
        : existing.accomImages,

      foodImages: newFood.length
        ? newFood
        : existing.foodImages,
    };

    const data = await Yoga500.findByIdAndUpdate(
      req.params.id,
      updated,
      { new: true }
    );

    res.json({ success: true, data });
  } catch (err) {
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
    res.status(500).json({ message: err.message });
  }
};