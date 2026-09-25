const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Plumbing",
        "Electrical",
        "Carpentry",
        "Cleaning",
        "Painting",
        "Gardening",
        "Home Care",
        "Driving",
        "Appliance Repair",
      ],
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    estimatedDuration: {
      type: Number,
      required: true,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);