const express = require("express");
const router = express.Router();

const controller = require("../controllers/coursecontrollers/threeHundredBatch.controller");

/* =========================
   CREATE
========================= */
router.post("/create", controller.createBatch);

/* =========================
   READ
========================= */
router.get("/all", controller.getAllBatches);
router.get("/single/:id", controller.getSingleBatch);
router.get("/getBatch/:id", controller.getSingleBatch);

/* =========================
   UPDATE
========================= */
router.put("/update/:id", controller.updateBatch);

/* =========================
   BOOK SEAT
========================= */
router.patch("/bookSeat/:id", controller.bookSeat);

/* =========================
   DELETE
========================= */
router.delete("/delete/:id", controller.deleteBatch);

module.exports = router;