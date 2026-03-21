const Model = require("../../models/homepage/classCampusAmenitiesModel");
const fs = require("fs");
const path = require("path");

/* =========================
   HELPER: DELETE FILE
========================= */
const deleteFile = (filePath) => {
  if (!filePath) return;
  const fileName = filePath.replace(/^\/uploads\//, "");
  const fullPath = path.join(__dirname, "../../uploads", fileName);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

/* =========================
   HELPER: IMAGE URL
   ✅ FIX: Use x-forwarded-proto so https works behind Nginx/load balancers on live
========================= */
const getFullUrl = (req, filePath) => {
  if (!filePath) return "";
  const cleanPath = filePath.startsWith("/") ? filePath : `/uploads/${filePath}`;
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  return `${protocol}://${req.get("host")}${cleanPath}`;
};

/* =========================
   HELPER: SINGLE RECORD GUARD
========================= */
const ensureSingleRecord = async () => {
  const exists = await Model.findOne();
  if (exists) {
    const err = new Error("Section already exists. Please edit or delete first.");
    err.statusCode = 400;
    throw err;
  }
};

/* =========================
   CREATE
========================= */
exports.create = async (req, res) => {
  try {
    // 🔥 SINGLE RECORD CHECK
    await ensureSingleRecord();

    const body = req.body;
    const files = req.files;

    const classSizeImage = files.classSizeImage?.[0]?.filename
      ? `/uploads/${files.classSizeImage[0].filename}`
      : "";

    const amenityImage = files.amenityImage?.[0]?.filename
      ? `/uploads/${files.amenityImage[0].filename}`
      : "";

    const campusImages = [];
    if (files["campusImage_0"]?.[0]?.filename) {
      campusImages.push(`/uploads/${files["campusImage_0"][0].filename}`);
    }

    let amenities = body.amenities;
    if (!Array.isArray(amenities)) amenities = [amenities];

    const data = await Model.create({
      ...body,
      amenities,
      classSizeImage,
      amenityImage,
      campusImages,
    });

    res.status(201).json({
      success: true,
      message: "Created successfully ✅",
      data: {
        ...data._doc,
        classSizeImage: getFullUrl(req, data.classSizeImage),
        amenityImage: getFullUrl(req, data.amenityImage),
        campusImages: data.campusImages.map((img) => getFullUrl(req, img)),
      },
    });

  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET ALL
========================= */
exports.getAll = async (req, res) => {
  try {
    const data = await Model.find().sort({ createdAt: -1 });

    const formatted = data.map((item) => ({
      ...item._doc,
      classSizeImage: getFullUrl(req, item.classSizeImage),
      amenityImage: getFullUrl(req, item.amenityImage),
      campusImages: item.campusImages.map((img) => getFullUrl(req, img)),
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    const { id } = req.body;
    const body = req.body;
    const files = req.files;

    const existing = await Model.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Data not found" });
    }

    let classSizeImage = existing.classSizeImage;
    if (files?.classSizeImage?.[0]) {
      deleteFile(existing.classSizeImage);
      classSizeImage = `/uploads/${files.classSizeImage[0].filename}`;
    }

    let amenityImage = existing.amenityImage;
    if (files?.amenityImage?.[0]) {
      deleteFile(existing.amenityImage);
      amenityImage = `/uploads/${files.amenityImage[0].filename}`;
    }

    let campusImages = [...existing.campusImages];
    if (files?.["campusImage_0"]?.[0]) {
      if (campusImages[0]) deleteFile(campusImages[0]);
      campusImages[0] = `/uploads/${files["campusImage_0"][0].filename}`;
    }

    let amenities = body.amenities;
    if (!Array.isArray(amenities)) amenities = [amenities];

    const updated = await Model.findByIdAndUpdate(
      id,
      {
        ...body,
        amenities,
        classSizeImage,
        amenityImage,
        campusImages,
      },
      { new: true }
    );

    // ✅ FIX: wrap image paths with getFullUrl — same as getOne/getAll
    res.json({
      success: true,
      message: "Updated successfully ✏️",
      data: {
        ...updated._doc,
        classSizeImage: getFullUrl(req, updated.classSizeImage),
        amenityImage:   getFullUrl(req, updated.amenityImage),
        campusImages:   updated.campusImages.map((img) => getFullUrl(req, img)),
      },
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET ONE
========================= */
exports.getOne = async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.json({
      success: true,
      data: {
        ...data._doc,
        classSizeImage: getFullUrl(req, data.classSizeImage),
        amenityImage:   getFullUrl(req, data.amenityImage),
        campusImages:   data.campusImages.map((img) => getFullUrl(req, img)),
      },
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
exports.remove = async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    deleteFile(data.classSizeImage);
    deleteFile(data.amenityImage);
    data.campusImages.forEach(deleteFile);

    await Model.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Deleted successfully 🗑️" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};