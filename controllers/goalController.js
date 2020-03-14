const Goal = require("../models/goalModel");

exports.getGoalsController = (req, res, next) => {
  const goals = Goal.find();

  res.status(200).json({
    status: "success",
    message: "Succesfully got all goals",
    data: goals
  });
};
