const express = require("express");
const router = express.Router();
const controller = require("../controllers/coursecontrollers/kundaliniSeatsController");

/* =========================
   CREATE
========================= */
router.post("/createBatch", controller.createBatch);

/* =========================
   GET ALL
========================= */
router.get("/", controller.getAll);

/* =========================
   GET ONE
========================= */
router.get("/:id", controller.getOne);

/* =========================
   UPDATE
========================= */
router.put("/:id", controller.update);

/* =========================
   DELETE
========================= */
router.delete("/:id", controller.remove);

module.exports = router;