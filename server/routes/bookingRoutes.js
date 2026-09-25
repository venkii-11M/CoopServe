const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  assignWorker,
} = require("../controllers/bookingController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.put("/assign", protect, adminOnly, assignWorker);

module.exports = router;