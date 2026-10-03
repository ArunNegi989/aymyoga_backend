const Model = require("../../models/courses/yoga300Content2model");

/* =========================
   PARSER FUNCTION
========================= */
const parseData = (req) => {
  const body = req.body;

  const getArray = (field) => {
    if (!body[field]) return [];
    return Array.isArray(body[field]) ? body[field] : [body[field]];
  };

  return {
    ...body,

    evolutionH2: body.evolutionH2 || "",
    evolutionRightImageAlt: body.evolutionRightImageAlt || "",
    evolutionBadgeText: body.evolutionBadgeText || "Yoga Alliance",
    evolutionBadgeSubtext: body.evolutionBadgeSubtext || "RYT 500 Certified",

    learningImage1Alt: body.learningImage1Alt || "",
    learningImage1Label: body.learningImage1Label || "",
    learningImage2Alt: body.learningImage2Alt || "",
    learningImage2Label: body.learningImage2Label || "",
    learningImage3Alt: body.learningImage3Alt || "",
    learningImage3Label: body.learningImage3Label || "",

    eligibilityImageAlt: body.eligibilityImageAlt || "",

    evaluationMainImageAlt: body.evaluationMainImageAlt || "",
    evaluationSmallImageAlt: body.evaluationSmallImageAlt || "",
    evaluationBadgeLine1: body.evaluationBadgeLine1 || "",
    evaluationBadgeLine2: body.evaluationBadgeLine2 || "",

    ethicsImage1Alt: body.ethicsImage1Alt || "",
    ethicsImage1Label: body.ethicsImage1Label || "",
    ethicsImage2Alt: body.ethicsImage2Alt || "",
    ethicsImage2Label: body.ethicsImage2Label || "",
    diplomaBadgeLine1: body.diplomaBadgeLine1 || "",
    diplomaBadgeLine2: body.diplomaBadgeLine2 || "",

    evolutionParas: JSON.parse(body.evolutionParas || "[]"),
    eligibilityParas: JSON.parse(body.eligibilityParas || "[]"),
    evaluationParas: JSON.parse(body.evaluationParas || "[]"),
    ethicsParas: JSON.parse(body.ethicsParas || "[]"),
    misconParas: JSON.parse(body.misconParas || "[]"),

    careerItems: JSON.parse(body.careerItems || "[]"),

    feeCard1Items: JSON.parse(body.feeCard1Items || "[]"),

    feeCard2Items: JSON.parse(body.feeCard2Items || "[]"),

    luxuryFeatures: JSON.parse(body.luxuryFeatures || "[]"),

    featuresList: JSON.parse(body.featuresList || "[]"),
    learningItems: JSON.parse(body.learningItems || "[]"),

    ethicsRules: JSON.parse(body.ethicsRules || "[]"),

    misconItems: JSON.parse(body.misconItems || "[]"),

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

// Helper to handle image updates
const handleImageUpdate = (
  files,
  body,
  existingImage,
  imageField,
  keepField,
) => {
  const newImage = getSingleFile(files, imageField);
  if (newImage) {
    return newImage;
  } else if (body[keepField] === "true") {
    return existingImage;
  }
  return "";
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
        message:
          "Only one record allowed. Please edit or delete existing record.",
      });
    }

    const data = parseData(req);
    const files = req.files || [];

    data.evolutionRightImage =
      getSingleFile(files, "evolutionRightImage") || "";

    data.learningImage1 = getSingleFile(files, "learningImage1") || "";
    data.learningImage2 = getSingleFile(files, "learningImage2") || "";
    data.learningImage3 = getSingleFile(files, "learningImage3") || "";

    data.eligibilityImage = getSingleFile(files, "eligibilityImage") || "";

    data.evaluationMainImage =
      getSingleFile(files, "evaluationMainImage") || "";
    data.evaluationSmallImage =
      getSingleFile(files, "evaluationSmallImage") || "";

    data.ethicsImage1 = getSingleFile(files, "ethicsImage1") || "";
    data.ethicsImage2 = getSingleFile(files, "ethicsImage2") || "";

    data.accomImages = getFiles(files, "accomImages");
    data.foodImages = getFiles(files, "foodImages");
    data.luxuryImages = getFiles(files, "luxuryImages");
    data.scheduleImages = getFiles(files, "scheduleImages");

    data.diplomaImage = getSingleFile(files, "diplomaImage") || "";
    data.yogaGardenImage = getSingleFile(files, "yogaGardenImage") || "";

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
    res.json({
      success: true,
      message: "Content created successfully",
      data: newData,
    });
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
      return res
        .status(404)
        .json({ success: false, message: "No record found to update" });
    }

    const data = parseData(req);
    const files = req.files || [];
    const body = req.body;

    data.evolutionRightImage = handleImageUpdate(
      files,
      body,
      existing.evolutionRightImage,
      "evolutionRightImage",
      "evolutionRightImageKeep",
    );

    data.learningImage1 = handleImageUpdate(
      files,
      body,
      existing.learningImage1,
      "learningImage1",
      "learningImage1Keep",
    );
    data.learningImage2 = handleImageUpdate(
      files,
      body,
      existing.learningImage2,
      "learningImage2",
      "learningImage2Keep",
    );
    data.learningImage3 = handleImageUpdate(
      files,
      body,
      existing.learningImage3,
      "learningImage3",
      "learningImage3Keep",
    );

    data.eligibilityImage = handleImageUpdate(
      files,
      body,
      existing.eligibilityImage,
      "eligibilityImage",
      "eligibilityImageKeep",
    );

    data.evaluationMainImage = handleImageUpdate(
      files,
      body,
      existing.evaluationMainImage,
      "evaluationMainImage",
      "evaluationMainImageKeep",
    );
    data.evaluationSmallImage = handleImageUpdate(
      files,
      body,
      existing.evaluationSmallImage,
      "evaluationSmallImage",
      "evaluationSmallImageKeep",
    );

    data.ethicsImage1 = handleImageUpdate(
      files,
      body,
      existing.ethicsImage1,
      "ethicsImage1",
      "ethicsImage1Keep",
    );
    data.ethicsImage2 = handleImageUpdate(
      files,
      body,
      existing.ethicsImage2,
      "ethicsImage2",
      "ethicsImage2Keep",
    );

    const buildCarousel = (newField, keepField) => {
      const newFiles = getFiles(files, newField);
      const keepUrls = body[keepField]
        ? Array.isArray(body[keepField])
          ? body[keepField]
          : [body[keepField]]
        : [];
      return [...keepUrls, ...newFiles];
    };

    data.accomImages = buildCarousel("accomImages", "accomImagesKeep");
    data.foodImages = buildCarousel("foodImages", "foodImagesKeep");
    data.luxuryImages = buildCarousel("luxuryImages", "luxuryImagesKeep");
    data.scheduleImages = buildCarousel("scheduleImages", "scheduleImagesKeep");

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

    const updated = await Model.findByIdAndUpdate(existing._id, data, {
      new: true,
    });
    res.json({ success: true, message: "Updated successfully", data: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE STATUS ONLY
========================= */
exports.updateStatus = async (req, res) => {
  try {
    const existing = await Model.findOne();
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "No record found" });
    }

    const { status } = req.body;
    if (!status || !["Active", "Inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
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
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "No record found" });
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
      return res
        .status(404)
        .json({ success: false, message: "No record found" });
    }
    await Model.findByIdAndDelete(existing._id);
    res.json({
      success: true,
      message: "Deleted successfully. Now you can add new record.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
