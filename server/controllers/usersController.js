const User = require("../models/Users");

// GET /api/users - Fetch all registered users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// Get a user by their ID
const userById = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from request params
        const user = await User.findById(userId).select("-password"); // Exclude password from the result

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("Error fetching user by ID:", err.message);
        res.status(500).send("Server error");
    }
};

//Update a user's information
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ msg: "Нууц үг эсвэл имэйл хаяг буруу байна." });
        }

        // Update user's information
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();

        res.json({ msg: "Хэрэглэгчийн мэдээлэл шинэчлэгдлээ.", user });
    } catch (error) {
        console.error("Error updating user: ", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

//Delete a user by ID 
const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ msg: "Хэрэглэгч олдсонгүй." });
        }

        res.json({ msg: "Хэрэглэгч устгагдлаа.", user });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getUsers,
    userById,
    updateUser,
    deleteUser
}