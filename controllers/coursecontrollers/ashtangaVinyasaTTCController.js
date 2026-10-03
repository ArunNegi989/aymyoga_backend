const Model = require("../../models/courses/ashtangaVinyasaTTCModel");

/* =========================
   HELPERS
========================= */

const parseJSON = (val) => {
  try {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return typeof val === "string" ? JSON.parse(val) : val;
  } catch {
    return [];
  }
};

const getFile = (files, key) => {
  if (!files || !files[key]) return null;
  return "/uploads/" + files[key][0].filename;
};

const buildData = (body, files) => {
  const data = {
    ...body,

    learnItems: parseJSON(body.learnItems),
    whoItems: parseJSON(body.whoItems),
    testimonials: parseJSON(body.testimonials),

    certTeachersParagraphs: parseJSON(body.certTeachersParagraphs),
    communityParagraphs: parseJSON(body.communityParagraphs),
    accommodationParagraphs: parseJSON(body.accommodationParagraphs),

    courseInfoCardTitle: body.courseInfoCardTitle || "COURSE DETAILS",
    courseInfoFeeLabel: body.courseInfoFeeLabel || "COURSE FEE",
    courseInfoFeeFromText: body.courseInfoFeeFromText || "starting from",
    courseInfoBookBtnText: body.courseInfoBookBtnText || "BOOK NOW",
    courseInfoUsdPrice: parseFloat(body.courseInfoUsdPrice) || 699,
    courseInfoInrPrice: parseFloat(body.courseInfoInrPrice) || 58000,
    courseInfoOriginalUsdPrice:
      parseFloat(body.courseInfoOriginalUsdPrice) || 1250,
    courseInfoOriginalInrPrice:
      parseFloat(body.courseInfoOriginalInrPrice) || 105000,
    courseInfoDetails: parseJSON(body.courseInfoDetails),

    courseDetailsImageAlt:
      body.courseDetailsImageAlt || "Ashtanga Vinyasa Yoga Teacher Training",
    certTeachersImageAlt:
      body.certTeachersImageAlt || "Certified Yoga Teachers Rishikesh",
    communityImageAlt: body.communityImageAlt || "Yoga Community Rishikesh",
    accommodationImageAlt:
      body.accommodationImageAlt || "Yoga Accommodation Rishikesh",
  };

  if (files?.heroImage) data.heroImage = getFile(files, "heroImage");
  if (files?.promoImage) data.promoImage = getFile(files, "promoImage");
  if (files?.courseDetailsImage)
    data.courseDetailsImage = getFile(files, "courseDetailsImage");
  if (files?.whoCanApplyVideo)
    data.whoCanApplyVideo = getFile(files, "whoCanApplyVideo");
  if (files?.certTeachersImage)
    data.certTeachersImage = getFile(files, "certTeachersImage");
  if (files?.communityImage)
    data.communityImage = getFile(files, "communityImage");
  if (files?.accommodationImage)
    data.accommodationImage = getFile(files, "accommodationImage");

  return data;
};

exports.create = async (req, res) => {
  try {
    const existing = await Model.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Record already exists. Please edit instead.",
      });
    }
    const data = buildData(req.body, req.files);
    const newData = new Model(data);
    await newData.save();
    res.json({ success: true, message: "Created successfully", data: newData });
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getSingle = async (req, res) => {
  try {
    const data = await Model.findOne();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Get error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await Model.findOne();
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No record found. Please create first.",
      });
    }
    const data = buildData(req.body, req.files);
    const updated = await Model.findByIdAndUpdate(existing._id, data, {
      new: true,
    });
    res.json({ success: true, message: "Updated successfully", data: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const existing = await Model.findOne();
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No record to delete",
      });
    }
    await Model.findByIdAndDelete(existing._id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
};
