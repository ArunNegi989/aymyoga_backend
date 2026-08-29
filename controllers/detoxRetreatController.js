// controllers/detoxRetreatController.js
const DetoxRetreatSection = require("../models/DetoxRetreatSection");
const fs = require("fs");
const path = require("path");

// Helper to delete image
const deleteImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, "../uploads", path.basename(imagePath));
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// @desc    Create new detox retreat section
// @route   POST /api/detox-retreat-section
exports.createSection = async (req, res) => {
  try {
    const data = req.body;

    // Parse JSON fields
    let benefits = [];
    let steps = [];
    let badges = [];
    let systems = [];
    let packages = [];

    try {
      benefits = data.benefits ? JSON.parse(data.benefits) : [];
    } catch (e) {
      benefits = [];
    }

    try {
      steps = data.steps ? JSON.parse(data.steps) : [];
    } catch (e) {
      steps = [];
    }

    try {
      badges = data.badges ? JSON.parse(data.badges) : [];
    } catch (e) {
      badges = [];
    }

    try {
      systems = data.systems ? JSON.parse(data.systems) : [];
    } catch (e) {
      systems = [];
    }

    try {
      packages = data.packages ? JSON.parse(data.packages) : [];
    } catch (e) {
      packages = [];
    }

    // Handle image uploads
    const heroImage = req.files?.heroImage ? req.files.heroImage[0].filename : "";
    const s1Image = req.files?.s1Image ? req.files.s1Image[0].filename : "";
    const massageImage = req.files?.massageImage ? req.files.massageImage[0].filename : "";

    const section = await DetoxRetreatSection.create({
      heroImage,
      heroImageAlt: data.heroImageAlt || "Yoga Students Group",
      mainTitle: data.mainTitle || "DETOXIFICATION RETREAT THROUGH HERBS, YOGA, AYURVEDA, AND NUTRITION",

      s1Para1: data.s1Para1 || "",
      s1HighlightText: data.s1HighlightText || "",
      s1Para2: data.s1Para2 || "",
      s1Image,
      s1ImageBadge: data.s1ImageBadge || "Ayurveda Detox",
      s1ConclusionQuote: data.s1ConclusionQuote || "",

      s2Label: data.s2Label || "Holistic Healing",
      s2Title: data.s2Title || "HOW TO CORRECT THIS PROBLEM?",
      s2Body: data.s2Body || "",
      benefits,

      s3Label: data.s3Label || "Our Method",
      s3Title: data.s3Title || "COMPLETE METHOD TO DETOXIFICATION THROUGH YOGA, AYURVEDA, AND DIET",
      s3Body: data.s3Body || "",
      steps,
      finalStepTitle: data.finalStepTitle || "Complete Detox",
      finalStepDesc: data.finalStepDesc || "",

      s4Label: data.s4Label || "Experience",
      s4Title: data.s4Title || "AYURVEDA MASSAGE THERAPY",
      badges,
      massageImage,
      overlayQuote: data.overlayQuote || "Healing begins where toxins end.",

      s5Label: data.s5Label || "Our Approach",
      s5Title: data.s5Title || "WE HAVE TWO SYSTEMS FOR DETOXIFICATION AT AYM DETOX SCHOOL IN RISHIKESH",
      systems,

      s6Label: data.s6Label || "Plans",
      s6Title: data.s6Title || "PRICE AND PACKAGES",
      packages,
      priceNote: data.priceNote || "Price will let you know after consultation with our Ayurveda Doctor (by Email)",
    });

    // Return with full image URLs
    const sectionObj = section.toObject();
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (sectionObj.heroImage) {
      sectionObj.heroImage = `${baseUrl}/uploads/${sectionObj.heroImage}`;
    }
    if (sectionObj.s1Image) {
      sectionObj.s1Image = `${baseUrl}/uploads/${sectionObj.s1Image}`;
    }
    if (sectionObj.massageImage) {
      sectionObj.massageImage = `${baseUrl}/uploads/${sectionObj.massageImage}`;
    }

    res.status(201).json({
      success: true,
      data: sectionObj,
      message: "Detox retreat section created successfully",
    });
  } catch (error) {
    console.error("Create Section Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create detox retreat section",
    });
  }
};

// @desc    Get all detox retreat sections
// @route   GET /api/detox-retreat-section
exports.getAllSections = async (req, res) => {
  try {
    const sections = await DetoxRetreatSection.find().sort({ createdAt: -1 });

    const sectionsWithUrls = sections.map((section) => {
      const sectionObj = section.toObject();
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      if (sectionObj.heroImage) {
        sectionObj.heroImage = `${baseUrl}/uploads/${sectionObj.heroImage}`;
      }
      if (sectionObj.s1Image) {
        sectionObj.s1Image = `${baseUrl}/uploads/${sectionObj.s1Image}`;
      }
      if (sectionObj.massageImage) {
        sectionObj.massageImage = `${baseUrl}/uploads/${sectionObj.massageImage}`;
      }

      return sectionObj;
    });

    res.status(200).json({
      success: true,
      count: sections.length,
      data: sectionsWithUrls,
    });
  } catch (error) {
    console.error("Get All Sections Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch detox retreat sections",
    });
  }
};

// @desc    Get single detox retreat section
// @route   GET /api/detox-retreat-section/:id
exports.getSectionById = async (req, res) => {
  try {
    const section = await DetoxRetreatSection.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Detox retreat section not found",
      });
    }

    const sectionObj = section.toObject();
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (sectionObj.heroImage) {
      sectionObj.heroImage = `${baseUrl}/uploads/${sectionObj.heroImage}`;
    }
    if (sectionObj.s1Image) {
      sectionObj.s1Image = `${baseUrl}/uploads/${sectionObj.s1Image}`;
    }
    if (sectionObj.massageImage) {
      sectionObj.massageImage = `${baseUrl}/uploads/${sectionObj.massageImage}`;
    }

    res.status(200).json({
      success: true,
      data: sectionObj,
    });
  } catch (error) {
    console.error("Get Section Error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Detox retreat section not found",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch detox retreat section",
    });
  }
};

// @desc    Get active/single detox retreat section (frontend)
// @route   GET /api/detox-retreat-section/active
exports.getActiveSection = async (req, res) => {
  try {
    const section = await DetoxRetreatSection.findOne().sort({ createdAt: -1 });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "No detox retreat section found",
      });
    }

    const sectionObj = section.toObject();
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (sectionObj.heroImage) {
      sectionObj.heroImage = `${baseUrl}/uploads/${sectionObj.heroImage}`;
    }
    if (sectionObj.s1Image) {
      sectionObj.s1Image = `${baseUrl}/uploads/${sectionObj.s1Image}`;
    }
    if (sectionObj.massageImage) {
      sectionObj.massageImage = `${baseUrl}/uploads/${sectionObj.massageImage}`;
    }

    res.status(200).json({
      success: true,
      data: sectionObj,
    });
  } catch (error) {
    console.error("Get Active Section Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch active detox retreat section",
    });
  }
};

// @desc    Update detox retreat section
// @route   PUT /api/detox-retreat-section/:id
exports.updateSection = async (req, res) => {
  try {
    let section = await DetoxRetreatSection.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Detox retreat section not found",
      });
    }

    const data = req.body;

    // Parse JSON fields
    let benefits = [];
    let steps = [];
    let badges = [];
    let systems = [];
    let packages = [];

    try {
      benefits = data.benefits ? JSON.parse(data.benefits) : section.benefits;
    } catch (e) {
      benefits = section.benefits;
    }

    try {
      steps = data.steps ? JSON.parse(data.steps) : section.steps;
    } catch (e) {
      steps = section.steps;
    }

    try {
      badges = data.badges ? JSON.parse(data.badges) : section.badges;
    } catch (e) {
      badges = section.badges;
    }

    try {
      systems = data.systems ? JSON.parse(data.systems) : section.systems;
    } catch (e) {
      systems = section.systems;
    }

    try {
      packages = data.packages ? JSON.parse(data.packages) : section.packages;
    } catch (e) {
      packages = section.packages;
    }

    // Handle image uploads - keep existing if no new file
    let heroImage = section.heroImage;
    let s1Image = section.s1Image;
    let massageImage = section.massageImage;

    if (req.files?.heroImage) {
      deleteImage(section.heroImage);
      heroImage = req.files.heroImage[0].filename;
    }

    if (req.files?.s1Image) {
      deleteImage(section.s1Image);
      s1Image = req.files.s1Image[0].filename;
    }

    if (req.files?.massageImage) {
      deleteImage(section.massageImage);
      massageImage = req.files.massageImage[0].filename;
    }

    section = await DetoxRetreatSection.findByIdAndUpdate(
      req.params.id,
      {
        heroImage,
        heroImageAlt: data.heroImageAlt || section.heroImageAlt,
        mainTitle: data.mainTitle || section.mainTitle,

        s1Para1: data.s1Para1 ?? section.s1Para1,
        s1HighlightText: data.s1HighlightText ?? section.s1HighlightText,
        s1Para2: data.s1Para2 ?? section.s1Para2,
        s1Image,
        s1ImageBadge: data.s1ImageBadge || section.s1ImageBadge,
        s1ConclusionQuote: data.s1ConclusionQuote ?? section.s1ConclusionQuote,

        s2Label: data.s2Label || section.s2Label,
        s2Title: data.s2Title || section.s2Title,
        s2Body: data.s2Body ?? section.s2Body,
        benefits,

        s3Label: data.s3Label || section.s3Label,
        s3Title: data.s3Title || section.s3Title,
        s3Body: data.s3Body ?? section.s3Body,
        steps,
        finalStepTitle: data.finalStepTitle || section.finalStepTitle,
        finalStepDesc: data.finalStepDesc ?? section.finalStepDesc,

        s4Label: data.s4Label || section.s4Label,
        s4Title: data.s4Title || section.s4Title,
        badges,
        massageImage,
        overlayQuote: data.overlayQuote || section.overlayQuote,

        s5Label: data.s5Label || section.s5Label,
        s5Title: data.s5Title || section.s5Title,
        systems,

        s6Label: data.s6Label || section.s6Label,
        s6Title: data.s6Title || section.s6Title,
        packages,
        priceNote: data.priceNote || section.priceNote,
      },
      { new: true, runValidators: true }
    );

    const sectionObj = section.toObject();
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (sectionObj.heroImage) {
      sectionObj.heroImage = `${baseUrl}/uploads/${sectionObj.heroImage}`;
    }
    if (sectionObj.s1Image) {
      sectionObj.s1Image = `${baseUrl}/uploads/${sectionObj.s1Image}`;
    }
    if (sectionObj.massageImage) {
      sectionObj.massageImage = `${baseUrl}/uploads/${sectionObj.massageImage}`;
    }

    res.status(200).json({
      success: true,
      data: sectionObj,
      message: "Detox retreat section updated successfully",
    });
  } catch (error) {
    console.error("Update Section Error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Detox retreat section not found",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update detox retreat section",
    });
  }
};

// @desc    Delete detox retreat section
// @route   DELETE /api/detox-retreat-section/:id
exports.deleteSection = async (req, res) => {
  try {
    const section = await DetoxRetreatSection.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Detox retreat section not found",
      });
    }

    // Delete associated images
    deleteImage(section.heroImage);
    deleteImage(section.s1Image);
    deleteImage(section.massageImage);

    await section.deleteOne();

    res.status(200).json({
      success: true,
      message: "Detox retreat section deleted successfully",
    });
  } catch (error) {
    console.error("Delete Section Error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Detox retreat section not found",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete detox retreat section",
    });
  }
};