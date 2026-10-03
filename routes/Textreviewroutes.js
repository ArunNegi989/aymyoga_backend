const express = require("express");
const router  = express.Router();
const upload  = require("../middleware/upload");

const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/homepage/Textreviewcontroller");

router.post("/create-review", upload.single("avatar"), create);

router.get("/all-reviews", getAll);

router.get("/review/:id", getOne);

router.put("/update-review/:id", upload.single("avatar"), update);

router.delete("/delete-review/:id", remove);

module.exports = router;