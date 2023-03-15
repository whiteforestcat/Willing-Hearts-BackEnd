const express = require("express");
const router = express.Router();
const {
  createNewUserOrSignIn,
  createNewUser,
  login,
  getRefreshToken,
} = require("../controllers/users");

// Create new user or sign in
router.put("/create-new-user-or-sign-in", createNewUserOrSignIn);

// Create new user
router.put("/create-new-user", createNewUser);

// Login
router.post("/login", login);

// Refresh access_token
router.post("/refresh", getRefreshToken);

module.exports = router;
