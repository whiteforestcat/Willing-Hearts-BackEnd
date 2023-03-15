require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const VolunteerSlots = require("../models/VolunteerSlots");

// READ: Get volunteer slot details for a specific time period
async function getAvailabilityDetails(req, res) {
  try {
    // Modify date
    // const modified_date = new Date(req.body.date);
    // modified_date.setHours(modified_date.getHours() + 8);

    const data = await VolunteerSlots.find({ date: req.body.date });
    const orig_availability_details = data[0].orig_slots_available;
    const sign_ups_details = data[0].sign_ups;
    const response = [];

    // Create an object for each role-timing for the day
    orig_availability_details.forEach((item) => {
      const currentRole = item.role;
      const currentTiming = item.timing;
      const newItem = {
        role: item.role,
        timing: item.timing,
        orig_avail_qty: item.qty,
        sign_up_qty: 0,
        remaining_qty: 0,
      };

      // Calculate the number of sign up qty from sign_up_details array
      const slot = sign_ups_details.filter((item) => {
        return (
          [currentRole].indexOf(item.role) > -1 &&
          [currentTiming].indexOf(item.timing) > -1
        );
      });
      console.log(slot);
      for (let i = 0; i < slot.length; i++) {
        newItem.sign_up_qty += slot[i].qty;
      }

      // Calculate the remaining availability
      newItem.remaining_qty = newItem.orig_avail_qty - newItem.sign_up_qty;

      response.push(newItem);
    });

    return res.json(response);
  } catch (error) {
    console.error("GET /volunteer-slots/vacancies", error);
    return res
      .status(400)
      .json({ status: "error", message: "request to get slot details failed" });
  }
}

// CREATE: Create new record in db when volunteer signs up
async function createNewSignUp(req, res) {
  try {
    // Modify date
    const modified_date = new Date(req.body.date);
    modified_date.setHours(modified_date.getHours() + 8);

    // Check if volunteer has signed up for this date and timing
    const clashingSignUp = await VolunteerSlots.findOne({
      date: modified_date,
      sign_ups: {
        $elemMatch: { timing: req.body.timing, email: req.body.email },
      },
    });
    console.log(1);
    if (clashingSignUp) {
      return res.status(400).json({
        status: "error",
        message: "clashing sign up",
      });
    }
    console.log(2);
    // Create new record
    const newSignUp = {
      role: req.body.role,
      timing: req.body.timing,
      type_of_volunteer: req.body.type_of_volunteer,
      email: req.body.email,
      qty: req.body.qty,
    };

    await VolunteerSlots.updateOne(
      { date: modified_date },
      { $push: { sign_ups: newSignUp } }
    );

    return res.json({ status: "ok", message: "successfully created" });
  } catch (error) {
    console.error("PATCH /volunteer-slots/new-sign-up", error);
    return res.status(400).json({ status: "error", message: "request failed" });
  }
}

module.exports = {
  getAvailabilityDetails,
  createNewSignUp,
};
