const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

const Plan = require("../models/planModel");
const Exercise = require("../models/exerciseModel");
const Goal = require("../models/goalModel");

mongoose
  .connect(process.env.DB_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB is successfully connected!");
  });

// READ JSON FILE
const plans = JSON.parse(fs.readFileSync(`${__dirname}/plans.json`, "utf-8"));
const exercises = JSON.parse(
  fs.readFileSync(`${__dirname}/exercises.json`, "utf-8")
);
const goals = JSON.parse(fs.readFileSync(`${__dirname}/goals.json`, "utf-8"));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Plan.create(plans);
    await Exercise.create(exercises);
    await Goal.create(goals);

    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Plan.deleteMany();
    await Exercise.deleteMany();
    await Goal.deleteMany();

    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

console.log("🍉 Command: ", process.argv);

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
