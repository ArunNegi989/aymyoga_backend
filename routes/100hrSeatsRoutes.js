const express = require("express");
const router = express.Router();

const controller = require("../controllers/coursecontrollers/100hrSeatsController");

/* =========================
   CREATE NEW BATCH
========================= */
router.post("/create-batch", controller.create);

/* =========================
   GET ALL BATCHES
========================= */
router.get("/get-all-batches", controller.getAll);

/* =========================
   GET SINGLE BATCH
========================= */
router.get("/get-batch/:id", controller.getOne);

/* =========================
   UPDATE BATCH
========================= */
router.put("/update-batch/:id", controller.update);

/* =========================
   DELETE BATCH
========================= */
router.delete("/delete-batch/:id", controller.remove);




module.exports = router;