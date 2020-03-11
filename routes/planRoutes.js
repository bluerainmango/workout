const express = require("express");
const planController = require("../controllers/planController");

const router = express.Router();

router
  .route("/")
  .get(planController.getAllPlans)
  .post(planController.createPlan);

module.exports = router;
