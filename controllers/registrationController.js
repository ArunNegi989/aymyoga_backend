const Registration = require("../models/registrationModel");

/* =========================
   CREATE REGISTRATION
========================= */
exports.createRegistration = async (req, res) => {
  try {
    const data = req.body;

    const newRegistration = new Registration(data);
    await newRegistration.save();

    res.status(201).json({
      success: true,
      message: "Registration saved successfully ✅",
      data: newRegistration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving registration ❌",
      error: error.message,
    });
  }
};

/* =========================
   GET ALL REGISTRATIONS (ADMIN)
========================= */
exports.getRegistrations = async (req, res) => {
  try {
    const data = await Registration.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching data ❌",
    });
  }
};

/* =========================
   DELETE REGISTRATION
========================= */
exports.deleteRegistration = async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

/* =========================
   GET SINGLE REGISTRATION
========================= */
exports.getSingleRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Registration.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found ❌",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching record ❌",
    });
  }
};