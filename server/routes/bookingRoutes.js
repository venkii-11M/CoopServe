const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  assignWorker,
  getPendingBookings,
  getWorkerBookings,
  updateWorkerBookingStatus,
} = require("../controllers/bookingController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.put("/assign", protect, adminOnly, assignWorker);
router.get( "/admin/pending", protect,adminOnly,getPendingBookings);
router.get("/worker/my", protect, getWorkerBookings);
router.put("/worker/status", protect, updateWorkerBookingStatus);


module.exports = router;