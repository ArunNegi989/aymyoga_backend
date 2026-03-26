const BaliPage = require("../../models/courses/baliPageModel");

/* =========================
   HELPERS
========================= */
const parseJSON = (val) => {
  try {
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
};



const getArray = (body, key) => {
  return Object.keys(body)
    .filter((k) => k.startsWith(key))
    .map((k) => body[k]);
};

/* =========================
   PARSE FUNCTION
========================= */
const parseData = (req, existing = {}) => {
  const body = req.body;

  return {
    ...body,

    /* JSON fields */
    uniquePoints: parseJSON(body.uniquePoints),
    courses: parseJSON(body.courses),
    highlights: parseJSON(body.highlights),
    destHighlights: parseJSON(body.destHighlights),
    aymSpecial: parseJSON(body.aymSpecial),
    chakras: parseJSON(body.chakras),

    /* ARRAY FIX */
    introParagraphs: parseJSON(body.introParagraphs),
uniquePointsParagraphs: parseJSON(body.uniquePointsParagraphs),
    aymSpecialParagraphs: parseJSON(body.aymSpecialParagraphs),

    /* IMAGES */
    heroImage: req.files?.heroImage?.[0]
      ? "/uploads/" + req.files.heroImage[0].filename
      : existing.heroImage,

    groupImage: req.files?.groupImage?.[0]
      ? "/uploads/" + req.files.groupImage[0].filename
      : existing.groupImage,

    templeImage: req.files?.templeImage?.[0]
      ? "/uploads/" + req.files.templeImage[0].filename
      : existing.templeImage,

    riceImage: req.files?.riceImage?.[0]
      ? "/uploads/" + req.files.riceImage[0].filename
      : existing.riceImage,

    practiceImage: req.files?.practiceImage?.[0]
      ? "/uploads/" + req.files.practiceImage[0].filename
      : existing.practiceImage,

    teacherImage: req.files?.teacherImage?.[0]
      ? "/uploads/" + req.files.teacherImage[0].filename
      : existing.teacherImage,

    gardenImage: req.files?.gardenImage?.[0]
      ? "/uploads/" + req.files.gardenImage[0].filename
      : existing.gardenImage,

    ubudImage: req.files?.ubudImage?.[0]
      ? "/uploads/" + req.files.ubudImage[0].filename
      : existing.ubudImage,
  };
};

/* =========================
   CREATE
========================= */
exports.createPage = async (req, res) => {
  try {
    const existing = await BaliPage.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Only one Bali page allowed",
      });
    }

    const data = parseData(req);

    const page = new BaliPage(data);
    await page.save();

    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET
========================= */
exports.getPage = async (req, res) => {
  try {
    const page = await BaliPage.findOne();
    res.json({ success: true, data: page });
  } catch {
    res.status(500).json({ success: false });
  }
};

/* =========================
   UPDATE (NO ID)
========================= */
exports.updatePage = async (req, res) => {
  try {
    const existing = await BaliPage.findOne();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No page found",
      });
    }

    const data = parseData(req, existing);

    const updated = await BaliPage.findByIdAndUpdate(
      existing._id,
      data,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   DELETE (NO ID)
========================= */
exports.deletePage = async (req, res) => {
  try {
    const existing = await BaliPage.findOne();

    if (!existing) {
      return res.status(404).json({ success: false });
    }

    await BaliPage.findByIdAndDelete(existing._id);

    res.json({ success: true, message: "Deleted successfully" });
  } catch {
    res.status(500).json({ success: false });
  }
};