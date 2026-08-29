const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/Soundhealingcontroller");

/* ── Multer storage config ── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Same 7 image fields the controller reads from req.files
const imageUploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "introImage", maxCount: 1 },
  { name: "bowl1Image", maxCount: 1 },
  { name: "bowl2Image", maxCount: 1 },
  { name: "bowl3Image", maxCount: 1 },
  { name: "aimImage", maxCount: 1 },
  { name: "benefitsImage", maxCount: 1 },
]);

/* ── Routes ── */
router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", imageUploadFields, create);
router.put("/:id", imageUploadFields, update);
router.delete("/:id", remove);

module.exports = router;