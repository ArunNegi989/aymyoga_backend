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
router.use("/class-campus-amenities", require("./classCampusAmenitiesRoutes"));

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
   TESTIMONIAL ROUTES
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

/* =========================
   EMAIL ROUTES
========================= */
router.use("/email", require("./emailRoutes"));

/* =========================
   200HR SEATS ROUTES
========================= */
router.use("/200hr-seats", require("./twoHundredBatchRoutes"));

/* =========================
   200HR CONTENT PART 1
========================= */
router.use("/yoga-200hr/content1", require("./yoga200Content1.routes"));

/* =========================
   🔥 200HR CONTENT PART 2 (ADD THIS)
========================= */
router.use("/yoga-200hr/content2", require("./yoga200Content2routes"));

/* =========================
   300HR SEATS ROUTES
========================= */
router.use("/300hr-seats", require("./threeHundredBatchRoutes"));

/* =========================
   300HR CONTENT PART 1
========================= */
router.use("/yoga-300hr/content1", require("./yoga300Content1routes"));

/* =========================
   🔥 300HR CONTENT PART 2 (ADD THIS)
========================= */
router.use("/yoga-300hr/content2", require("./yoga300Content2routes"));
/* =========================
   500HR SEATS ROUTES
========================= */
router.use("/500hr-seats", require("./fiveHundredBatchRoutes"));

/* =========================
   🌍 WORLDWIDE CONTENT ROUTES
========================= */
router.use("/worldwide/content", require("./worldwideroutes"));
/* =========================
   REGISTRATION ROUTES
========================= */
router.use("/registration", require("./registrationRoutes"));

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
