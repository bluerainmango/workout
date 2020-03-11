const express = require("express");
const exerciseController = require("../controllers/excerciseController");

const router = express.Router();

router
  .route("/")
  .get(exerciseController.getAllExercise)
  .post(exerciseController.createExercise);

router.route("/:id").patch(exerciseController.updateExercise);

module.exports = router;
