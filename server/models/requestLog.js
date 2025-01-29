const mongoose = require("mongoose");

// Define schema for logging requests
const requestLogSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: Number, // Response time in milliseconds
    required: true,
  },
  ip: {
    type: String, // IP address of the request
    required: true,
  },
  requestBody: {
    type: mongoose.Schema.Types.Mixed, // Store the request body (JSON or form data)
    default: {},
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // User ID from the JWT
    ref: "User", // Reference to the User model
    default: null, // Set default to null if there's no logged-in user
  },
  device: {
    type: String, // Store the device information (User-Agent)
    default: "Unknown device",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const RequestLog = mongoose.model("RequestLog", requestLogSchema);

module.exports = RequestLog;
