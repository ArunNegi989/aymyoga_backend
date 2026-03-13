const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} = require("../controllers/homepage/bannerController");

/* CREATE */
router.post("/create", upload.single("image"), createBanner);

/* GET ALL */
router.get("/", getAllBanners);

/* GET ONE */
router.get("/:id", getBannerById);

/* UPDATE */
router.put("/update/:id", upload.single("image"), updateBanner);

/* DELETE */
router.delete("/delete/:id", deleteBanner);

module.exports = router;