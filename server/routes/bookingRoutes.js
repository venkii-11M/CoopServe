const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  assignWorker,
  getPendingBookings,
} = require("../controllers/bookingController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.put("/assign", protect, adminOnly, assignWorker);
router.get( "/admin/pending", protect,adminOnly,getPendingBookings);


module.exports = router;