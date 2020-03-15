const Goal = require("../models/goalModel");

exports.getAllGoals = async (req, res, next) => {
  const goals = await Goal.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    message: "Succesfully got all goals",
    data: goals
  });
};

exports.createGoal = async (req, res, next) => {
  const newGoal = await Goal.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Succesfully created the new goal",
    data: newGoal
  });
};
