const Plan = require("../models/planModel");

exports.getAllPlans = async (req, res, next) => {
  const plans = await Plan.find();
  console.log("🍑", plans);

  res.status(200).json({
    status: "success",
    message: "Successfully got all plans",
    data: plans
  });
};

exports.createPlan = async (req, res, next) => {
  const { planName, duration, description, startDate } = req.body;

  const doc = await Plan.create({
    planName,
    duration,
    description,
    startDate: 1583919306581
  });

  res.status(201).json({
    status: "success",
    message: "create a plan",
    data: doc
  });
};

exports.updateExercise = async (req, res, next) => {
  const updatedDoc = await Plan.findByIdAndUpdate(req.params.planId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    message: "Successfully updated excercise in the plan",
    data: updatedDoc
  });
};
