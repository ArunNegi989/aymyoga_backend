const express = require("express");
const router = express.Router();

const {
  createRegistration,
  getRegistrations,
  deleteRegistration,
  getSingleRegistration,
} = require("../controllers/registrationController");

/* =========================
   ROUTES
========================= */

// CREATE
router.post("/create", createRegistration);

// GET ALL (Admin Panel)
router.get("/get", getRegistrations);

// GET SINGLE
router.get("/get/:id", getSingleRegistration);

// DELETE
router.delete("/delete/:id", deleteRegistration);

module.exports = router;