const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

const Plan = require("../models/planModel");
const Exercise = require("../models/exerciseModel");

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

// IMPORT DATA INTO DB
// Model.create()는 인자로 배열도 받기에 아래 가능.
const importData = async () => {
  try {
    await Plan.create(plans);
    await Exercise.create(exercises);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    // Model.deleteMany() : 인자 없으면 모든 documents 삭제. mongoDB와 mongoose 같은 이름
    await Plan.deleteMany();
    await Exercise.deleteMany();
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
