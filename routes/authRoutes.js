const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  checkAdmin,
} = require("../controllers/authController");

const {
  sendOTP,
  verifyOTP,
  resetPassword,
} = require("../controllers/Forgotpasswordcontroller");

const { changePassword } = require("../controllers/Changepasswordcontroller");
const { protect } = require("../middleware/Authmiddleware");

// ── Public auth routes ───────────────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

// ── Forgot password (public, 3-step) ────────────────────────
router.post("/forgot-password", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// ── Change password (protected — must be logged in) ─────────
router.post("/change-password", protect, changePassword);
router.get("/check-admin", checkAdmin);

module.exports = router;