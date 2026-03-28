const express = require("express");
const router = express.Router();
const controller = require("../controllers/coursecontrollers/prenatalSeatsController");

router.post("/createBatch", controller.createBatch);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put("/:id", controller.updateBatch);
router.delete("/:id", controller.deleteBatch);

/* 🔥 seat booking */
router.post("/book-seat", controller.bookSeat);

module.exports = router;