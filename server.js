require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const volunteerSlots = require("./routers/volunteerSlots");
const users = require("./routers/users");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB(process.env.MONGODB_URI);

// Route to all volunteer endpoints
app.use("/volunteer-slots", volunteerSlots);

// Route to all user endpoints
app.use("/users", users);

// Seed data:

const seed = require("./models/SeedData");
const VolunteerSlots = require("./models/VolunteerSlots");

app.get("/seed", async (req, res) => {
  seed.forEach((item) => {
    const newItem = {
      date: item.date,
      orig_slots_available: item.orig_slots_available,
      sign_ups: item.sign_ups,
    };
  });
  console.log(seed);
  await VolunteerSlots.create(seed, (err, createdUsers) => {
    if (err) {
      console.log(err);
      res.status(400).json({ status: "error", message: "seeding error" });
    } else {
      // logs created users
      console.log(createdUsers);
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`server started on Port ${process.env.PORT}`);
});
