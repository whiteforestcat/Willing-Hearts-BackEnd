const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  role: { type: String, required: true },
  timing: { type: String, required: true },
  qty: { type: Number, required: true },
});

const SignUpSchema = new mongoose.Schema({
  role: { type: String, required: true },
  timing: { type: String, required: true },
  type_of_volunteer: { type: String, required: true },
  email: { type: String, required: true },
  qty: { type: Number, required: true },
});

const VolunteerSlotsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    orig_slots_available: [SlotSchema],
    sign_ups: [SignUpSchema],
  },
  {
    collection: "volunteerSlots",
  }
);

module.exports = mongoose.model("VolunteerSlots", VolunteerSlotsSchema);
