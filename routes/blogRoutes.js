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
  create
);

/* GET ALL */
router.get("/get-all", getAll);

/* LATEST PUBLISHED — keep above any dynamic ":id" or ":slug" routes */
router.get("/latest-published", getLatestPublished);

/* GET BY SLUG — must be BEFORE /get/:id so ":slug" doesn't get caught by ":id" */
router.get("/get-by-slug/:slug", getBySlug);

/* GET BY ID */
router.get("/get/:id", getOne);

/* UPDATE */
router.put(
  "/update/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "contentImages", maxCount: 50 },
  ]),
  update
);

/* DELETE */
router.delete("/delete/:id", remove);

module.exports = router;