const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createAccreditation,
  getAll,
  getOne,
  updateAccreditation,
  deleteAccreditation,
} = require("../controllers/homepage/accreditationController");

/* =========================
   MULTI FILE UPLOAD
========================= */
const multiUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "certImages", maxCount: 6 },
]);

router.post("/", multiUpload, createAccreditation);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", multiUpload, updateAccreditation);
router.delete("/:id", deleteAccreditation);

module.exports = router;