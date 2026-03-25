const Yoga300 = require("../../models/courses/yoga300Content1model");

/* =========================
   COMMON PARSER FUNCTION
========================= */
const parseData = (req, existingImage = "") => {
  const body = req.body;

  // image
  let heroImage = existingImage;
  if (req.files?.heroImage) {
    heroImage = "/uploads/" + req.files.heroImage[0].filename;
  }

  // fees
  const includedFee = Array.isArray(body.includedFee)
    ? body.includedFee
    : body.includedFee
    ? [body.includedFee]
    : [];

  const notIncludedFee = Array.isArray(body.notIncludedFee)
    ? body.notIncludedFee
    : body.notIncludedFee
    ? [body.notIncludedFee]
    : [];

  // paragraphs
  const introParagraphs = [];
  const topParagraphs = [];

  Object.keys(body)
    .sort()
    .forEach((key) => {
      if (key.startsWith("introPara")) introParagraphs.push(body[key]);
      if (key.startsWith("topPara")) topParagraphs.push(body[key]);
    });

  // overview
  const overviewFields = JSON.parse(body.overviewFields || "[]").map(
    ({ label, value, multiline }) => ({
      label,
      value,
      multiline,
    })
  );

  // modules
  const modules = JSON.parse(body.modules || "[]").map((m) => ({
    num: m.num,
    label: m.label,
    title: m.title,
    content: m.content,
    subTitle: m.subTitle,
    listItems: m.listItems || [],
    twoCol: m.twoCol || false,
  }));

  return {
    ...body,
    heroImage,
    introParagraphs,
    topParagraphs,
    includedFee,
    notIncludedFee,
    overviewFields,
    modules,
  };
};

/* =========================
   CREATE (ONLY ONE RECORD)
========================= */
exports.create = async (req, res) => {
  try {
    const existing = await Yoga300.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Record already exists. Please edit or delete first.",
      });
    }

    const parsedData = parseData(req);

    const data = new Yoga300(parsedData);
    await data.save();

    res.status(201).json({
      success: true,
      message: "Created successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ALL (LIST PAGE)
========================= */
exports.get = async (req, res) => {
  try {
    const data = await Yoga300.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET SINGLE BY ID
========================= */
exports.getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Yoga300.findById(id);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Yoga300.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "No record found" });
    }

    const parsedData = parseData(req, existing.heroImage);

    const updated = await Yoga300.findByIdAndUpdate(
      id,
      parsedData,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE
========================= */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    await Yoga300.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};