const express = require("express");
const router = express.Router();
const { 
  getUsers,
  userById,
  updateUser,
  deleteUser
 } = require("../controllers/usersController");

// GET /api/users - Fetch all registered users
router.get("/users", getUsers);

// Endpoint to fetch a user by their ID
router.get("/users/:id", userById);

// PUT /api/users/:id - Update a user's information, with JWT authentication
router.put("/users/:id", updateUser);

// DELETE /api/users/:id - Delete a user by ID with JWT authentication
router.delete("/users/:id", deleteUser);

module.exports = router;
