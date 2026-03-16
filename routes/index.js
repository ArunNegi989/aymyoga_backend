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
   API HEALTH CHECK
=========================== */
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API working 🚀"
  });
});

module.exports = router;