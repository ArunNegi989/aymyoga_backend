const Model = require("../../models/homepage/whyAYMModel");
const fs = require("fs");
const path = require("path");

/* =========================
   CREATE (ONLY ONE)
========================= */
exports.create = async (req, res, next) => {
  try {
    const exists = await Model.findOne();

    if (exists) {
      return res.status(400).json({
        success: false,
        message:
          "Why AYM section already exists. You can only update or delete it.",
      });
    }

    /* IMAGE PATH */
    let imagePath = "";
    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;
    }

    /* PARSE ARRAY DATA */
    const data = {
      ...req.body,
      sideFeatures: JSON.parse(req.body.sideFeatures || "[]"),
      bottomFeatures: JSON.parse(req.body.bottomFeatures || "[]"),
      imageSrc: imagePath,
    };

    const newData = await Model.create(data);

    res.status(201).json({
      success: true,
      message: "Why AYM created successfully",
      data: newData,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET (SINGLE RECORD ONLY)
========================= */
exports.getAll = async (req, res, next) => {
  try {
    const data = await Model.findOne();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET SINGLE
========================= */
exports.getOne = async (req, res, next) => {
  try {
    const data = await Model.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res, next) => {
  try {
    const existing = await Model.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    let imagePath = existing.imageSrc;

    /* IF NEW IMAGE UPLOADED */
    if (req.file) {
      // delete old image
      if (existing.imageSrc) {
        const oldPath = path.join(
          __dirname,
          "../../",
          existing.imageSrc
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      imagePath = "/uploads/" + req.file.filename;
    }

    const updatedData = {
      ...req.body,
      sideFeatures: JSON.parse(req.body.sideFeatures || "[]"),
      bottomFeatures: JSON.parse(req.body.bottomFeatures || "[]"),
      imageSrc: imagePath,
    };

    const updated = await Model.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Why AYM updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE (WITH IMAGE DELETE)
========================= */
exports.remove = async (req, res, next) => {
  try {
    const existing = await Model.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    /* DELETE IMAGE */
    if (existing.imageSrc) {
      const filePath = path.join(
        __dirname,
        "../../",
        existing.imageSrc
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await existing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Why AYM deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};