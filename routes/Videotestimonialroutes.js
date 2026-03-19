const express = require("express");
const router = express.Router();

const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/homepage/videoTestimonialController");

/* =========================
   VIDEO TESTIMONIAL ROUTES
========================= */

// CREATE VIDEO TESTIMONIAL
router.post("/create-video", create);

// GET ALL VIDEO TESTIMONIALS
router.get("/all-videos", getAll);

// GET SINGLE VIDEO TESTIMONIAL
router.get("/video/:id", getOne);

// UPDATE VIDEO TESTIMONIAL
router.put("/update-video/:id", update);

// DELETE VIDEO TESTIMONIAL
router.delete("/delete-video/:id", remove);

module.exports = router;