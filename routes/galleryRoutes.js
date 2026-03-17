const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createGallerySection,
  getGallerySections,
  getSingleGallerySection,
  updateGallerySection,
  deleteGallerySection,
  deleteImage,
  reorderSections,
} = require("../controllers/galleryController");

/* ===========================
   GALLERY ROUTES
=========================== */

router.post("/create", upload.array("images", 20), createGallerySection);

router.get("/", getGallerySections);

router.get("/:id", getSingleGallerySection);

router.put("/update/:id", upload.array("images", 20), updateGallerySection);

router.delete("/delete/:id", deleteGallerySection);

router.delete("/delete-image", deleteImage);

router.post("/reorder", reorderSections);

module.exports = router;