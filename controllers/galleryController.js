const GallerySection = require("../models/GallerySection");

/* ===========================
   CREATE
=========================== */
const createGallerySection = async (req, res) => {
  try {
    const { tabLabel, heading, cols } = req.body;

    let images = [];

    // FILE IMAGES
    if (req.files && req.files.length > 0) {
      const fileImages = req.files.map((file) => ({
        src: `/uploads/${file.filename}`,
        label: file.originalname,
      }));
      images = [...images, ...fileImages];
    }

    // URL IMAGES
    if (req.body.imagesData) {
      try {
        const urlImages = JSON.parse(req.body.imagesData);
        images = [...images, ...urlImages];
      } catch (err) {
        console.log("URL parse error:", err);
      }
    }

    const last = await GallerySection.findOne().sort({ order: -1 });

    const section = new GallerySection({
      tabLabel,
      heading,
      cols,
      images,
      order: last ? last.order + 1 : 1,
    });

    await section.save();

    res.status(201).json({ success: true, data: section });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   GET ALL
=========================== */
const getGallerySections = async (req, res) => {
  try {
    const data = await GallerySection.find().sort({ order: 1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   GET SINGLE
=========================== */
const getSingleGallerySection = async (req, res) => {
  try {
    const data = await GallerySection.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   UPDATE
=========================== */
const updateGallerySection = async (req, res) => {
  try {
    const { tabLabel, heading, cols } = req.body;

    const section = await GallerySection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    let images = [];

    // EXISTING IMAGES (frontend se bhej)
    if (req.body.existingImages) {
      try {
        const existing = JSON.parse(req.body.existingImages);
        images = [...images, ...existing];
      } catch (err) {}
    }

    // FILE IMAGES
    if (req.files && req.files.length > 0) {
      const fileImages = req.files.map((file) => ({
        src: `/uploads/${file.filename}`,
        label: file.originalname,
      }));
      images = [...images, ...fileImages];
    }

    // URL IMAGES
    if (req.body.imagesData) {
      try {
        const urlImages = JSON.parse(req.body.imagesData);
        images = [...images, ...urlImages];
      } catch (err) {}
    }

    section.tabLabel = tabLabel || section.tabLabel;
    section.heading = heading || section.heading;
    section.cols = cols || section.cols;
    section.images = images;

    await section.save();

    res.json({ success: true, data: section });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE SECTION
=========================== */
const deleteGallerySection = async (req, res) => {
  try {
    const section = await GallerySection.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE SINGLE IMAGE
=========================== */
const deleteImage = async (req, res) => {
  try {
    const { sectionId, imageIndex } = req.body;

    const section = await GallerySection.findById(sectionId);
    if (!section) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    section.images.splice(imageIndex, 1);
    await section.save();

    res.json({ success: true, data: section });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   REORDER
=========================== */
const reorderSections = async (req, res) => {
  try {
    const { items } = req.body;

    await Promise.all(
      items.map((item) =>
        GallerySection.findByIdAndUpdate(item.id, {
          order: item.order,
        })
      )
    );

    res.json({ success: true, message: "Reordered" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createGallerySection,
  getGallerySections,
  getSingleGallerySection,
  updateGallerySection,
  deleteGallerySection,
  deleteImage,
  reorderSections,
};