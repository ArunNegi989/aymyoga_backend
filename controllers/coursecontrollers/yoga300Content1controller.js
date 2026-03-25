const Yoga300 = require("../../models/courses/yoga300Content1model");

/* =========================
   COMMON PARSER FUNCTION
========================= */
const parseData = (req, existingImage = "") => {
  const body = req.body;

  /* ========= IMAGE ========= */
  let heroImage = existingImage;
  if (req.files?.heroImage) {
    heroImage = "/uploads/" + req.files.heroImage[0].filename;
  }

  /* ========= FEES ========= */
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

  /* ========= PARAGRAPHS (BEST METHOD) ========= */
  const introParagraphs = [];
  const topParagraphs = [];

  const introCount = Number(body.introParagraphCount || 0);
  const topCount = Number(body.topParagraphCount || 0);

  // intro
  for (let i = 1; i <= introCount; i++) {
    const val = body[`introPara${i}`];
    if (val && val.trim()) {
      introParagraphs.push(val);
    }
  }

  // top
  for (let i = 1; i <= topCount; i++) {
    const val = body[`topPara${i}`];
    if (val && val.trim()) {
      topParagraphs.push(val);
    }
  }

  /* ========= OVERVIEW ========= */
  let overviewFields = [];
  try {
    overviewFields = JSON.parse(body.overviewFields || "[]").map(
      ({ label, value, multiline }) => ({
        label,
        value,
        multiline,
      })
    );
  } catch {
    overviewFields = [];
  }

  /* ========= MODULES ========= */
  let modules = [];
  try {
    modules = JSON.parse(body.modules || "[]").map((m) => ({
      num: m.num,
      label: m.label,
      title: m.title,
      content: m.content,
      subTitle: m.subTitle,
      listItems: m.listItems || [],
      twoCol: m.twoCol || false,
    }));
  } catch {
    modules = [];
  }

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
   GET ALL
========================= */
exports.get = async (req, res) => {
  try {
    const data = await Yoga300.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.getSingle = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Yoga300.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      data,
    });
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
      return res.status(404).json({
        success: false,
        message: "No record found",
      });
    }

    const parsedData = parseData(req, existing.heroImage);

    const updated = await Yoga300.findByIdAndUpdate(
      id,
      parsedData,
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
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Yoga300.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No record found",
      });
    }

    await Yoga300.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};