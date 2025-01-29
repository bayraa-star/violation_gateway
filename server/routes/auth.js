require("dotenv").config();
const express = require("express");
const basicAuth = require("../middlewares/basicAuth");
const { auth, login } = require("../controllers/authController")

const router = express.Router();



//Post /api/register
router.post("/register", basicAuth, auth);

// User login route to generate JWT
router.post("/login", login);


module.exports = router;
