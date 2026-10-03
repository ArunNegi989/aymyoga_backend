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

const resolveImage = (req, fieldName, existing = {}) => {
  if (req.files?.[fieldName]?.[0]) {
    return "/uploads/" + req.files[fieldName][0].filename;
  }

  const urlKey = `${fieldName}Url`;
  if (req.body?.[urlKey] && req.body[urlKey].trim()) {
    return req.body[urlKey].trim();
  }

  return existing[fieldName] || "";
};

const parseData = (req, existing = {}) => {
  const body = req.body;

  return {
    ...body,

    uniquePoints: parseJSON(body.uniquePoints),
    courses: parseJSON(body.courses),
    highlights: parseJSON(body.highlights),
    destHighlights: parseJSON(body.destHighlights),
    aymSpecial: parseJSON(body.aymSpecial),
    chakras: parseJSON(body.chakras),

    introParagraphs: parseJSON(body.introParagraphs),
    uniquePointsParagraphs: parseJSON(body.uniquePointsParagraphs),
    aymSpecialParagraphs: parseJSON(body.aymSpecialParagraphs),

    heroImage: resolveImage(req, "heroImage", existing),
    groupImage: resolveImage(req, "groupImage", existing),
    templeImage: resolveImage(req, "templeImage", existing),
    riceImage: resolveImage(req, "riceImage", existing),
    practiceImage: resolveImage(req, "practiceImage", existing),
    teacherImage: resolveImage(req, "teacherImage", existing),
    gardenImage: resolveImage(req, "gardenImage", existing),
    ubudImage: resolveImage(req, "ubudImage", existing),
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
        message: "Only one Bali page allowed. Use PUT to update.",
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
        message: "No Bali page found. Create one first.",
      });
    }

    const data = parseData(req, existing);

    const updated = await BaliPage.findByIdAndUpdate(existing._id, data, {
      new: true,
    });

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
