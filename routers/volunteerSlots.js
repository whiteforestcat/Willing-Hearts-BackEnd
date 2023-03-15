const express = require("express");
const router = express.Router();
const {
  getAvailabilityDetails,
  createNewSignUp,
} = require("../controllers/volunteerSlots");

// READ: Get slot vacancies for the month
router.post("/availability", getAvailabilityDetails);

// CREATE:
router.patch("/new-sign-up", createNewSignUp);

module.exports = router;
