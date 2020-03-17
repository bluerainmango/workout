const Goal = require("../models/goalModel");

exports.getAllGoals = async (req, res, next) => {
  const goals = await Goal.find()
    .sort({ createdAt: -1 })
    .limit(7);

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
  const { subDocId, isChecked } = req.params;

  //* findOneAndUpdate() version instead of using findOne(), save()
  // const updatedGoal = await Goal.findOneAndUpdate(
  //   { "progress._id": subDocId },
  //   { $set: { "progress.$.isCompleted": isChecked } },
  //   { new: true }
  // );

  const goal = await Goal.findOne({ "progress._id": subDocId });

  const index = goal.progress.findIndex(el => {
    return el._id == subDocId;
  });

  const progressTarget = goal.progress[index];
  const changedProgress = Object.assign(progressTarget, {
    isCompleted: isChecked
  });

  goal.progress.set(index, changedProgress);

  goal.markModified(`progress[index]`);
  const updatedGoal = await goal.save();

  console.log("🥱changed goal", updatedGoal);

  res.status(200).json({
    status: "success",
    message: "Succesfully updated progress of the goal",
    data: updatedGoal
  });
};
