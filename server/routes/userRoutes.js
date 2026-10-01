const express = require("express");
const router = express.Router();

const User = require("../models/User");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// Get logged-in user's profile
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user,
  });
});

// Get verified workers (admin only)
router.get(
  "/workers",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const workers = await User.find({
        role: "worker",
        isVerified: true,
      }).select("name phone email");

      res.status(200).json({
        count: workers.length,
        workers,
      });
    } catch (error) {
      console.error("Get workers error:", error.message);

      res.status(500).json({
        message: "Failed to fetch verified workers",
      });
    }
  }
);

module.exports = router;