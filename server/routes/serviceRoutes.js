const express = require("express");
const router = express.Router();

const {
  getServices,
  createService,
} = require("../controllers/serviceController");

const { protect } = require("../middleware/authMiddleware");

// Public route: customers can browse services
router.get("/", getServices);

// Protected route: logged-in users can create services for now
router.post("/", protect, createService);

module.exports = router;