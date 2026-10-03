const express = require("express");
const router = express.Router();

const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/homepage/ourMissionController");


router.post("/add-our-mission", create);

router.get("/get-our-mission", getAll);

router.get("/get-our-mission/:id", getOne);

router.put("/update-our-mission/:id", update);

router.delete("/delete-our-mission/:id", remove);

module.exports = router;