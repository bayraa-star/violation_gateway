const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies.token; // Get token from header or cookie

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Invalid token and not matching with userID!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    req.user = { userId: decoded.userId}; // Attach userId directly to request object
    //console.log("Extracted User ID: ", req.userId); // Debugging line
    next();
  } catch (error) {
    console.error("Error for get token:", error.message);
    res.status(401).json({ msg: "Invalid token." });
  }
};

module.exports = authMiddleware;
