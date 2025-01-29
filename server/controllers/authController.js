const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const JWT_SECRET = process.env.JWT_SECRET;

//Register user api
const auth = async ( req, res ) => {
    const { username, email, password } = req.body;

    try {
        //Cehck if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "Email is registered already." });
        }

        //Create a new user
        user = new User({
            username,
            email,
            password,
        });

        // Save the user to the database
        await user.save();

        res.status(201).json({ msg: "User registered." });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Oops! We don't understand your request.");
    } 
};

//Login user api
const login = async (req, res ) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found with email:", email);
            return res.status(401).json({ msg: "Not found user." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch for user:", user.email);
            return res
                .status(401)
                .json({ msg: "Invalid username or password." });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "24h",
        });

        console.log("User logged in:", user._id);
        res.json({ token, msg: "Login success." });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = { auth, login }