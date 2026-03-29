const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createPage,
  getPage,
  updatePage,
  deletePage,
} = require("../controllers/coursecontrollers/goaYogaController");

/* 🔥 IMPORTANT */
router.post("/create", upload.any(), createPage);
router.get("/get", getPage);
router.put("/update", upload.any(), updatePage);
router.delete("/delete", deletePage);

module.exports = router;