const Model = require("../../models/courses/bestYogaSchoolModelrishikesh");

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

/* =========================
   EXTRACT FILES
========================= */
const extractImages = (files) => {
  const hero = "";
  const accredImages = {};
  const courseImages = {};
  const specialtyImages = {};

  let heroImage = "";

  files.forEach((file) => {
    if (file.fieldname === "heroImage") {
      heroImage = "/uploads/" + file.filename;
    }

    if (file.fieldname.startsWith("accredImg_")) {
      const id = file.fieldname.replace("accredImg_", "");
      accredImages[id] = "/uploads/" + file.filename;
    }

    if (file.fieldname.startsWith("courseImg_")) {
      const id = file.fieldname.replace("courseImg_", "");
      courseImages[id] = "/uploads/" + file.filename;
    }

    if (file.fieldname.startsWith("specialtyImg_")) {
      const id = file.fieldname.replace("specialtyImg_", "");
      specialtyImages[id] = "/uploads/" + file.filename;
    }
  });

  return { heroImage, accredImages, courseImages, specialtyImages };
};

/* =========================
   CREATE (ONLY ONE)
========================= */
exports.create = async (req, res) => {
  try {
    const exists = await Model.findOne();
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Only one record allowed. Use update.",
      });
    }

    const { heroImage, accredImages, courseImages, specialtyImages } =
      extractImages(req.files || []);

    let accredBadges = parseJSON(req.body.accredBadges);
    let courseCards = parseJSON(req.body.courseCards);
    let specialtyCourses = parseJSON(req.body.specialtyCourses);

    // map images
    accredBadges = accredBadges.map((item) => ({
      ...item,
      imgUrl: accredImages[item.id] || item.imgUrl || "",
    }));

    courseCards = courseCards.map((item) => ({
      ...item,
      imgUrl: courseImages[item.id] || item.imgUrl || "",
    }));

    specialtyCourses = specialtyCourses.map((item) => ({
      ...item,
      imgUrl: specialtyImages[item.id] || item.imgUrl || "",
    }));

    const data = {
      status: req.body.status,
      heroTitle: req.body.heroTitle,
      heroImage,

      accrSectionTitle: req.body.accrSectionTitle,
      coursesSectionTitle: req.body.coursesSectionTitle,
      specialtySectionTitle: req.body.specialtySectionTitle,

      bodyParagraphs1: parseJSON(req.body.bodyParagraphs1),
      bodyParagraphs2: parseJSON(req.body.bodyParagraphs2),

      accredBadges,
      courseCards,
      specialtyCourses,

      inlineLinks: parseJSON(req.body.inlineLinks),
      inlineLinks2: parseJSON(req.body.inlineLinks2),
    };

    const created = await Model.create(data);

    res.json({
      success: true,
      message: "Created successfully",
      data: created,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET
========================= */
exports.get = async (req, res) => {
  try {
    const data = await Model.findOne();

    res.json({
      success: true,
      data: data || null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
        success: false,
        message: "No record found",
      });
    }

    const { heroImage, accredImages, courseImages, specialtyImages } =
      extractImages(req.files || []);

    let accredBadges = parseJSON(req.body.accredBadges);
    let courseCards = parseJSON(req.body.courseCards);
    let specialtyCourses = parseJSON(req.body.specialtyCourses);

    accredBadges = accredBadges.map((item) => ({
      ...item,
      imgUrl: accredImages[item.id] || item.imgUrl || "",
    }));

    courseCards = courseCards.map((item) => ({
      ...item,
      imgUrl: courseImages[item.id] || item.imgUrl || "",
    }));

    specialtyCourses = specialtyCourses.map((item) => ({
      ...item,
      imgUrl: specialtyImages[item.id] || item.imgUrl || "",
    }));

    const updateData = {
      status: req.body.status,
      heroTitle: req.body.heroTitle,

      accrSectionTitle: req.body.accrSectionTitle,
      coursesSectionTitle: req.body.coursesSectionTitle,
      specialtySectionTitle: req.body.specialtySectionTitle,

      bodyParagraphs1: parseJSON(req.body.bodyParagraphs1),
      bodyParagraphs2: parseJSON(req.body.bodyParagraphs2),

      accredBadges,
      courseCards,
      specialtyCourses,

      inlineLinks: parseJSON(req.body.inlineLinks),
      inlineLinks2: parseJSON(req.body.inlineLinks2),
    };

    if (heroImage) {
      updateData.heroImage = heroImage;
    }

    const updated = await Model.findByIdAndUpdate(
      existing._id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const existing = await Model.findOne();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No record found",
      });
    }

    await Model.findByIdAndDelete(existing._id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};