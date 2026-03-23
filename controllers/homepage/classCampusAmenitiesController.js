const Model = require("../../models/homepage/classCampusAmenitiesModel");
const fs = require("fs");
const path = require("path");

/* =========================
   DELETE FILE HELPER
========================= */
const deleteFile = (filePath) => {
  if (!filePath) return;

  const fileName = filePath.replace("/uploads/", "");
  const fullPath = path.join(__dirname, "../../uploads", fileName);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

/* =========================
   CREATE
========================= */
exports.create = async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || {};

    /* IMAGE PATHS */
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

    /* ARRAY FIX */
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
   GET ALL
========================= */
exports.getAll = async (req, res) => {
  try {
    const data = await Model.find().sort({ createdAt: -1 });

    res.json({
      success: true,
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
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    const { id } = req.body;
    const body = req.body;
    const files = req.files || {};

    const existing = await Model.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    /* IMAGE UPDATE */

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

    let campusImages = [...(existing.campusImages || [])];
    if (files?.["campusImage_0"]?.[0]) {
      if (campusImages[0]) deleteFile(campusImages[0]);
      campusImages[0] = `/uploads/${files["campusImage_0"][0].filename}`;
    }

    /* ARRAY FIX */
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

    res.json({
      success: true,
      message: "Updated successfully ✏️",
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
exports.remove = async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    /* DELETE FILES */
    deleteFile(data.classSizeImage);
    deleteFile(data.amenityImage);
    data.campusImages?.forEach(deleteFile);

    await Model.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully 🗑️",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};