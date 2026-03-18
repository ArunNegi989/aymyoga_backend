const Model = require("../../models/homepage/aymFullPageModel");

/* HELPERS */

// Safe JSON parse
const safeParse = (val, def) => {
  try {
    return val ? JSON.parse(val) : def;
  } catch {
    return def;
  }
};

// File path generator
const getFilePath = (file) => {
  if (!file) return null;
  return `/uploads/${file.filename}`;
};

// Required field validation
const validateFields = (body) => {
  const required = [
    "alignTitle",
    "salutation",
    "alignPara1",
    "alignPara2",
    "alignPara3",
    "planesPara",
    "highlight1",
    "highlight2",
    "campusTitle",
    "ctaHeading",
    "ctaSubtext",
    "whatsappLink",
    "masterQuote",
    "masterAttrib",
    "namesteText",
  ];

  for (let field of required) {
    if (!body[field] || body[field].trim() === "") {
      return `${field} is required`;
    }
  }

  return null;
};

/* =========================
   CREATE (ONLY ONE RECORD)
========================= */
exports.create = async (req, res) => {
  try {
    const exists = await Model.findOne();

    if (exists) {
      return res.status(400).json({
        message: "Only one record allowed. Use update API.",
      });
    }

    const body = req.body;

    /* VALIDATION */
    const error = validateFields(body);
    if (error) return res.status(400).json({ message: error });

    /* PARSE JSON */
    body.bodyPlanes = safeParse(body.bodyPlanes, []);
    body.campusFacilities = safeParse(body.campusFacilities, []);
    body.journeyParas = safeParse(body.journeyParas, []);
    body.promoCard1 = safeParse(body.promoCard1, {});
    body.promoCard2 = safeParse(body.promoCard2, {});

    /* IMAGES */
    if (req.files?.bodyPlanesImage) {
      body.bodyPlanesImage = getFilePath(req.files.bodyPlanesImage[0]);
    }

    if (req.files?.outdoorImage) {
      body.outdoorImage = getFilePath(req.files.outdoorImage[0]);
    }

    const data = await Model.create(body);

    res.status(201).json({
      success: true,
      message: "Created successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.get = async (req, res) => {
  try {
    const data = await Model.findOne();

    res.status(200).json({
      success: true,
      data: data || null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    const existing = await Model.findOne();

    if (!existing) {
      return res.status(404).json({
        message: "No record found",
      });
    }

    const body = req.body;

    /* VALIDATION */
    const error = validateFields(body);
    if (error) return res.status(400).json({ message: error });

    /* PARSE JSON */
    body.bodyPlanes = safeParse(body.bodyPlanes, []);
    body.campusFacilities = safeParse(body.campusFacilities, []);
    body.journeyParas = safeParse(body.journeyParas, []);
    body.promoCard1 = safeParse(body.promoCard1, {});
    body.promoCard2 = safeParse(body.promoCard2, {});

    /* IMAGE UPDATE */
    body.bodyPlanesImage = req.files?.bodyPlanesImage
      ? getFilePath(req.files.bodyPlanesImage[0])
      : existing.bodyPlanesImage;

    body.outdoorImage = req.files?.outdoorImage
      ? getFilePath(req.files.outdoorImage[0])
      : existing.outdoorImage;

    const updated = await Model.findByIdAndUpdate(existing._id, body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   DELETE
========================= */
exports.delete = async (req, res) => {
  try {
    const data = await Model.findOne();

    if (!data) {
      return res.status(404).json({
        message: "No record found",
      });
    }

    await Model.findByIdAndDelete(data._id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};