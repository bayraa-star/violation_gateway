const { RateLimiterMemory } = require("rate-limiter-flexible");

// Create a rate limiter instance
const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of requests
  duration: 1, // Per second
});

// Middleware function
const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next(); // Allow request to proceed
    })
    .catch(() => {
      res.status(429).send("Too Many Requests"); // Send a 429 if rate limit is exceeded
    });
};

// Export the middleware for use in other files
module.exports = rateLimiterMiddleware;
