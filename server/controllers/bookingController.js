const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");

// Create a booking
const createBooking = async (req, res) => {
  try {
    const {
      service,
      address,
      bookingDate,
      description,
    } = req.body;

    // Validate required fields
    if (!service || !address || !bookingDate || !description) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check if service exists and is active
    const selectedService = await Service.findOne({
      _id: service,
      isActive: true,
    });

    if (!selectedService) {
      return res.status(404).json({
        message: "Service not found or inactive",
      });
    }

    // Create booking
    const booking = await Booking.create({
      customer: req.user._id,
      service: selectedService._id,
      address,
      bookingDate,
      description,
      totalPrice: selectedService.basePrice,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error.message);

    return res.status(500).json({
      message: "Server error while creating booking",
    });
  }
};

// Get bookings of logged-in customer
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate("service", "name category basePrice")
      .populate("worker", "name phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching bookings",
    });
  }
};

// Assign a verified worker to a booking
const assignWorker = async (req, res) => {
  try {
    const { bookingId, workerId } = req.body;

    // Check required fields
    if (!bookingId || !workerId) {
      return res.status(400).json({
        message: "Booking ID and Worker ID are required",
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only pending bookings can be assigned
    if (booking.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending bookings can be assigned",
      });
    }

    // Find the worker
    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
      isVerified: true,
    });

    if (!worker) {
      return res.status(404).json({
        message: "Verified worker not found",
      });
    }

    // Assign worker and update booking status
    booking.worker = worker._id;
    booking.status = "Accepted";

    await booking.save();

    res.status(200).json({
      message: "Worker assigned successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error assigning worker",
      error: error.message,
    });
  }
};

// Get all pending bookings for admin
const getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: "Pending",
    })
      .populate("customer", "name phone email")
      .populate("service", "name category basePrice")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get pending bookings error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching pending bookings",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  assignWorker,
  getPendingBookings,
};