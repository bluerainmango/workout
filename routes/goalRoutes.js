const express = require("express");
const goalController = require("../controllers/goalController");

const router = express.Router();

router
  .route("/")
  .get(goalController.getAllGoals)
  .post(goalController.createGoal);

router
  .route("/goalId/:goalId/exerciseId/:exerciseId")
  .patch(goalController.updateProgress);

module.exports = router;
