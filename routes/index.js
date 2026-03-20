const express = require("express");
const router = express.Router();

/* ===========================
   AUTH ROUTES
=========================== */
router.use("/auth", require("./authRoutes"));

/* ===========================
   BANNER ROUTES
=========================== */
router.use("/banners", require("./bannerRoutes"));

/* ===========================
   HOME ABOUT ROUTES
=========================== */
router.use("/home-about", require("./homeAboutRoutes"));

/* ===========================
   GALLERY ROUTES
=========================== */
router.use("/gallery-sections", require("./galleryRoutes"));

/* =========================
   ACCREDITATION ROUTES
========================= */
router.use("/accreditation", require("./accreditationRoutes"));

/* =========================
   YOGA COURSES ROUTES
========================= */
router.use("/yoga-courses", require("./yogaCoursesRoutes"));

/* =========================
   CLASS CAMPUS AMENITIES
========================= */
router.use(
  "/class-campus-amenities",
  require("./classCampusAmenitiesRoutes")
);

/* ===========================
   AYM FULL PAGE ROUTES
=========================== */
router.use("/aym-full-page", require("./aymFullPageRoutes"));

/* =========================
   OUR MISSION ROUTES
========================= */
router.use("/our-mission", require("./ourMissionRoutes"));

/* =========================
   WHY AYM ROUTES
========================= */
router.use("/why-aym", require("./whyAYMRoutes"));

/* =========================
   TESTIMONIAL ROUTES (🔥 CLEAN STRUCTURE)
========================= */
router.use("/testimonials/videos", require("./Videotestimonialroutes"));
router.use("/testimonials/text", require("./Textreviewroutes"));


/* =========================
   FOUNDER ROUTES
========================= */
router.use("/founder", require("./founderRoutes"));
/* =========================
   TEACHERS ROUTES
========================= */
router.use("/teachers", require("./teacherRoutes"));

/* =========================
   GUEST TEACHER ROUTES 
========================= */
router.use("/guest-teachers", require("./guestTeacherRoutes"));
/* =========================
   BLOG ROUTES
========================= */
router.use("/blogs", require("./blogRoutes"));

/* =========================
   100HR SEATS ROUTES
========================= */
router.use("/100hr-seats", require("./100hrSeatsRoutes"));
/* =========================
   100HR CONTENT ROUTES
========================= */
router.use("/100hr-content", require("./100hrContentRoutes"));

/* ✅ ADD THIS */
router.use("/email", require("./emailRoutes"));
/* ===========================
   API HEALTH CHECK
=========================== */
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API working 🚀",
  });
});

module.exports = router;