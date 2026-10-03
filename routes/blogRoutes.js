const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  create,
  getAll,
  getOne,
  getBySlug,
  getLatestPublished,
  update,
  remove,
} = require("../controllers/blogController");

/* CREATE */
router.post(
  "/create",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "contentImages", maxCount: 50 },
  ]),
  create,
);

/* GET ALL */
router.get("/get-all", getAll);

router.get("/latest-published", getLatestPublished);

router.get("/get-by-slug/:slug", getBySlug);

router.get("/get/:id", getOne);

router.put(
  "/update/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "contentImages", maxCount: 50 },
  ]),
  update,
);

router.delete("/delete/:id", remove);

module.exports = router;
