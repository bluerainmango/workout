const express = require("express");
const planController = require("../controllers/planController");

const router = express.Router();

router
  .route("/")
  .get(planController.getAllPlans)
  .post(planController.createPlan);

router.route("/:planId").put(planController.updateExercise);

module.exports = router;
