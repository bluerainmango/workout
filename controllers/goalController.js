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

exports.updateProgress = async (req, res, next) => {
  const { goalId, exerciseId } = req.params;

  // const updatedGoal = await Goal.findByIdAndUpdate(goalId,{
  //   progress:
  // },{new:true});

  const updatedGoal = await Goal.findByIdAndUpdate(
    goalId,
    { progress: req.body.progress },
    { new: true }
  );

  console.log("🐯", req.body, updatedGoal);

  // const exerciseToUpdate = goal.progress.filter(exerciseObj => {
  //   return exerciseObj._id === exerciseId;
  // });

  // exerciseToUpdate.isCompleted ? false : true

  res.status(200).json({
    status: "success",
    message: "Succesfully updated progress of the goal",
    data: updatedGoal
  });
};
