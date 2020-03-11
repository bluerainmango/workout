const express = require("express");
const exerciseController = require("../controllers/excerciseController");

const router = express.Router();

router.get("/", exerciseController.getAllExercise);

module.exports = router;
