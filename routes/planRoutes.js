const express = require("express");
const planController = require("../controllers/planController");

const router = express.Router();

router.get("/:planId", planController.getOnePlan);
// router.route("/:id").get(planController.getOnePlan);

router
  .route("/")
  .get(planController.getAllPlans)
  .post(planController.createPlan);

module.exports = router;
