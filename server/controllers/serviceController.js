const Service = require("../models/Service");

// Get all active services
const getServices = async (req, res) => {
  try {
    const services = await Service.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching services",
    });
  }
};

// Create a new service
const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      estimatedDuration,
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      basePrice === undefined ||
      estimatedDuration === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const service = await Service.create({
      name,
      description,
      category,
      basePrice,
      estimatedDuration,
    });

    return res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error.message);

    return res.status(400).json({
      message: "Could not create service",
      error: error.message,
    });
  }
};

module.exports = {
  getServices,
  createService,
};