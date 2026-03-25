const Model = require("../../models/courses/yoga300Content2model");

/* =========================
   PARSER FUNCTION
   Only called for full create/update (multipart/form-data).
   NOT called for status-only PATCH.
========================= */
const parseData = (req) => {
  const body = req.body;

  const getArray = (field) => {
    if (!body[field]) return [];
    return Array.isArray(body[field]) ? body[field] : [body[field]];
  };

  return {
    ...body,

    evolutionParas: JSON.parse(body.evolutionParas || "[]"),
    eligibilityParas: JSON.parse(body.eligibilityParas || "[]"),
    evaluationParas: JSON.parse(body.evaluationParas || "[]"),
    ethicsParas: JSON.parse(body.ethicsParas || "[]"),
    misconParas: JSON.parse(body.misconParas || "[]"),

    careerItems: getArray("careerItems"),
    feeCard1Items: getArray("feeCard1Items"),
    feeCard2Items: getArray("feeCard2Items"),
    luxuryFeatures: getArray("luxuryFeatures"),
    featuresList: getArray("featuresList"),
    learningItems: getArray("learningItems"),
    ethicsRules: getArray("ethicsRules"),
    misconItems: getArray("misconItems"),

    faqItems: JSON.parse(body.faqItems || "[]"),
    scheduleItems: JSON.parse(body.scheduleItems || "[]"),
    reviews: JSON.parse(body.reviews || "[]"),
    youtubeVideosMeta: JSON.parse(body.youtubeVideosMeta || "[]"),
  };
};

/* =========================
   FILE HELPERS
========================= */
const getFiles = (files, field) =>
  files
    .filter((f) => f.fieldname === field)
    .map((f) => "/uploads/" + f.filename);

const getSingleFile = (files, field) => {
  const file = files.find((f) => f.fieldname === field);
  return file ? "/uploads/" + file.filename : null;
};

/* =========================
   CREATE (ONLY ONE RECORD)
========================= */
exports.create = async (req, res) => {
  try {
    const existing = await Model.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Only one record allowed. Please edit or delete existing record.",
      });
    }

    const data = parseData(req);
    const files = req.files || [];

    // Carousel images
    data.accomImages = getFiles(files, "accomImages");
    data.foodImages = getFiles(files, "foodImages");
    data.luxuryImages = getFiles(files, "luxuryImages");
    data.scheduleImages = getFiles(files, "scheduleImages");

    // Single images
    data.diplomaImage = getSingleFile(files, "diplomaImage") || "";
    data.yogaGardenImage = getSingleFile(files, "yogaGardenImage") || "";

    // YouTube videos
    data.youtubeVideos = data.youtubeVideosMeta.map((yt) => {
      const file = files.find((f) => f.fieldname === `ytFile_${yt.id}`);
      return {
        id: yt.id,
        title: yt.title || "",
        type: yt.type || "url",
        videoId: yt.videoId || "",
        videoFile: file ? "/uploads/" + file.filename : "",
      };
    });

    const newData = await Model.create(data);
    res.json({ success: true, message: "Content created successfully", data: newData });
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE (ONLY ONE RECORD)
========================= */
exports.update = async (req, res) => {
  try {
    const existing = await Model.findOne();
    if (!existing) {
      return res.status(404).json({ success: false, message: "No record found to update" });
    }

    const data = parseData(req);
    const files = req.files || [];
    const body = req.body;

    // Carousel images: kept existing + newly uploaded
    const buildCarousel = (newField, keepField) => {
      const newFiles = getFiles(files, newField);
      const keepUrls = body[keepField]
        ? Array.isArray(body[keepField]) ? body[keepField] : [body[keepField]]
        : [];
      return [...keepUrls, ...newFiles];
    };

    data.accomImages = buildCarousel("accomImages", "accomImagesKeep");
    data.foodImages = buildCarousel("foodImages", "foodImagesKeep");
    data.luxuryImages = buildCarousel("luxuryImages", "luxuryImagesKeep");
    data.scheduleImages = buildCarousel("scheduleImages", "scheduleImagesKeep");

    // Single images
    const diploma = getSingleFile(files, "diplomaImage");
    if (diploma) {
      data.diplomaImage = diploma;
    } else if (body.diplomaImageKeep === "true") {
      data.diplomaImage = existing.diplomaImage;
    } else {
      data.diplomaImage = "";
    }

    const garden = getSingleFile(files, "yogaGardenImage");
    if (garden) {
      data.yogaGardenImage = garden;
    } else if (body.yogaGardenImageKeep === "true") {
      data.yogaGardenImage = existing.yogaGardenImage;
    } else {
      data.yogaGardenImage = "";
    }

    // YouTube videos
    data.youtubeVideos = data.youtubeVideosMeta.map((yt) => {
      const file = files.find((f) => f.fieldname === `ytFile_${yt.id}`);
      return {
        id: yt.id,
        title: yt.title || "",
        type: yt.type || "url",
        videoId: yt.videoId || "",
        videoFile: file
          ? "/uploads/" + file.filename
          : yt.existingFileUrl || "",
      };
    });

    const updated = await Model.findByIdAndUpdate(existing._id, data, { new: true });
    res.json({ success: true, message: "Updated successfully", data: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE STATUS ONLY
   FIX: Dedicated endpoint so the list page
   can toggle status without accidentally
   wiping all arrays via parseData.
========================= */
exports.updateStatus = async (req, res) => {
  try {
    const existing = await Model.findOne();
    if (!existing) {
      return res.status(404).json({ success: false, message: "No record found" });
    }

    const { status } = req.body;
    if (!status || !["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    await Model.findByIdAndUpdate(existing._id, { status });
    res.json({ success: true, message: "Status updated", status });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.getSingle = async (req, res) => {
  try {
    const data = await Model.findOne();
    if (!data) return res.status(404).json({ success: false, message: "No record found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE
========================= */
exports.remove = async (req, res) => {
  try {
    const existing = await Model.findOne();
    if (!existing) {
      return res.status(404).json({ success: false, message: "No record found" });
    }
    await Model.findByIdAndDelete(existing._id);
    res.json({ success: true, message: "Deleted successfully. Now you can add new record." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};