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
  // const { goalId, exerciseId } = req.params;
  const { subDocId, isChecked } = req.params;

  // Goal.findOne({})

  // const findGoal = await Goal.findOne({ "progress._id": subDocId });
  console.log("🐼", isChecked);
  const updatedGoal = await Goal.findOneAndUpdate(
    { "progress._id": subDocId },
    { $set: { "progress.$.isCompleted": isChecked } },
    { new: true }
  );

  console.log("🐷", updatedGoal);
  // const { progress } = await Goal.findById(goalId);

  // const index = progress.findIndex(el => el.exerciseId === exerciseId);
  // progress[index];

  // const updatedGoal = await Goal.findByIdAndUpdate(
  //   goalId,
  //   {
  //     // $set: { "progress.$[].isCompleted": true }
  //     $set: { "progress.exerciseId": "" }
  //   },
  //   { new: true }
  // );

  // const exerciseToUpdate = goal.progress.filter(exerciseObj => {
  //   return exerciseObj._id === exerciseId;
  // });

  // exerciseToUpdate.isCompleted ? false : true

  //!
  // const updatedGoal = await Goal.findByIdAndUpdate(
  //   goalId,
  //   { progress: req.body.progress },
  //   { new: true }
  // );

  // console.log("🐯", req.body, updatedGoal);

  res.status(200).json({
    status: "success",
    message: "Succesfully updated progress of the goal",
    data: updatedGoal
  });
};
