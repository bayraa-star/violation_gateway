const RequestLog = require("../models/requestLog");

const logger = async (req, res, next) => {
  const startTime = Date.now(); // Start time to calculate response time

  // Once the response has been sent, calculate the response time and save the log
  res.on("finish", async () => {
    const responseTime = Date.now() - startTime; // Calculate the response time
    const statusCode = res.statusCode;

    // Extract the User-Agent from the request headers
    const userAgent = req.get("User-Agent") || "Unknown device";

    // Construct the request log object
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: statusCode,
      responseTime: responseTime,
      ip: req.ip || req.connection.remoteAddress,
      requestBody: req.body,
      userId: req.user ? req.user.userId : null, // Extract the user ID from the request, if available
      device: userAgent,
    };

    try {
      const log = new RequestLog(logData);
      await log.save(); // Save the log to the database
      console.log("Request log saved:", logData);
    } catch (err) {
      console.error("Error saving request log:", err.message);
    }
  });

  next();
};

module.exports = logger;
