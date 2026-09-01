// FILE: src/routes/onlineSeatsRoutes.js

const express = require("express");
const router = express.Router();

const controller = require("../controllers/coursecontrollers/Onlineseatscontroller");

/* =========================
   CREATE NEW BATCH
========================= */
router.post("/create-batch", controller.create);

/* =========================
   GET ALL BATCHES
   (future + today only)
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

/* =========================
   BOOK SEAT
   (registration form se call hoga)
========================= */
router.patch("/book-seat/:id", controller.bookSeat);

module.exports = router;