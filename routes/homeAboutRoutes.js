const express = require("express");
const router = express.Router();

const {
  createHomeAbout,
  getHomeAbout,
  updateHomeAbout,
  deleteHomeAbout
} = require("../controllers/homepage/homeAboutController");

router.post("/create-home-about", createHomeAbout);

router.get("/get-home-about", getHomeAbout);

router.put("/update-home-about", updateHomeAbout);

router.delete("/delete-home-about", deleteHomeAbout);

module.exports = router;