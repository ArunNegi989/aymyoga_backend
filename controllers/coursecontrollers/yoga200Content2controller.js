const Yoga200Content2 = require("../../models/courses/Yoga200Content2");
const fs = require("fs");
const path = require("path");

/* DELETE FILE */
const deleteFile = (filePath) => {
  try {
    const fullPath = path.join(__dirname, "../../", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.log(err);
  }
};

/* CREATE (ONLY ONE RECORD) */
exports.createContent = async (req, res) => {
  try {
    const existing = await Yoga200Content2.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Only one record allowed ❌",
      });
    }

    const body = req.body;

    const getPaths = (files) =>
      files ? files.map((f) => "/uploads/" + f.filename) : [];

    const data = new Yoga200Content2({
      ...body,

      accomImages: getPaths(req.files["accomImages"]),
      foodImages: getPaths(req.files["foodImages"]),
      luxImages: getPaths(req.files["luxImages"]),
      schedImages: getPaths(req.files["schedImages"]),

      reqImage: req.files["reqImage"]
        ? "/uploads/" + req.files["reqImage"][0].filename
        : "",

      programs: JSON.parse(body.programs || "[]"),
      reviews: JSON.parse(body.reviews || "[]"),
      inclFee: JSON.parse(body.inclFee || "[]"),
      notInclFee: JSON.parse(body.notInclFee || "[]"),
      luxFeatures: JSON.parse(body.luxFeatures || "[]"),
      whatIncl: JSON.parse(body.whatIncl || "[]"),
      instrLangs: JSON.parse(body.instrLangs || "[]"),
      indianFees: JSON.parse(body.indianFees || "[]"),
      schedRows: JSON.parse(body.schedRows || "[]"),
      faqItems: JSON.parse(body.faqItems || "[]"),
      knowQA: JSON.parse(body.knowQA || "[]"),
    });

    await data.save();

    res.json({ success: true, message: "Created ✅", data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* GET SINGLE (NO ID) */
exports.getContent = async (req, res) => {
  try {
    const data = await Yoga200Content2.findOne();
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false });
  }
};

/* UPDATE (NO ID) */
exports.updateContent = async (req, res) => {
  try {
    const existing = await Yoga200Content2.findOne();

    if (!existing) {
      return res.status(404).json({ success: false, message: "No record" });
    }

    const body = req.body;

    const getPaths = (files) =>
      files ? files.map((f) => "/uploads/" + f.filename) : [];

    let accomImages = existing.accomImages;
    if (req.files["accomImages"]) {
      accomImages.forEach(deleteFile);
      accomImages = getPaths(req.files["accomImages"]);
    }

    let foodImages = existing.foodImages;
    if (req.files["foodImages"]) {
      foodImages.forEach(deleteFile);
      foodImages = getPaths(req.files["foodImages"]);
    }

    let luxImages = existing.luxImages;
    if (req.files["luxImages"]) {
      luxImages.forEach(deleteFile);
      luxImages = getPaths(req.files["luxImages"]);
    }

    let schedImages = existing.schedImages;
    if (req.files["schedImages"]) {
      schedImages.forEach(deleteFile);
      schedImages = getPaths(req.files["schedImages"]);
    }

    let reqImage = existing.reqImage;
    if (req.files["reqImage"]) {
      if (reqImage) deleteFile(reqImage);
      reqImage = "/uploads/" + req.files["reqImage"][0].filename;
    }

    const updated = await Yoga200Content2.findByIdAndUpdate(
      existing._id,
      {
        ...body,
        accomImages,
        foodImages,
        luxImages,
        schedImages,
        reqImage,

        programs: JSON.parse(body.programs || "[]"),
        reviews: JSON.parse(body.reviews || "[]"),
      },
      { new: true }
    );

    res.json({ success: true, message: "Updated ✅", data: updated });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* DELETE */
exports.deleteContent = async (req, res) => {
  try {
    const existing = await Yoga200Content2.findOne();

    if (!existing) {
      return res.status(404).json({ success: false });
    }

    existing.accomImages?.forEach(deleteFile);
    existing.foodImages?.forEach(deleteFile);
    existing.luxImages?.forEach(deleteFile);
    existing.schedImages?.forEach(deleteFile);

    if (existing.reqImage) deleteFile(existing.reqImage);

    await existing.deleteOne();

    res.json({ success: true, message: "Deleted 🗑️" });
  } catch {
    res.status(500).json({ success: false });
  }
};