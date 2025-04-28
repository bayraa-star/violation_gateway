const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const rateLimiterMiddleware = require("./middlewares/rateLimiter");
const logger = require("./middlewares/logger"); 
const authMiddleware = require("./middlewares/authMiddleware");
const cors = require('cors');

const app = express();


//Middleware 
app.use(cors({
    origin: [
        'http://localhost:3890',
        'http://103.9.90.140:3880'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies to be sent along with requests if necessary
}));
app.use(logger);
app.use(rateLimiterMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

// Unprotected routes
app.use("/api", require("./routes/auth"));
app.use("/api/v1/violation", require("./routes/violation"));



module.exports = app;