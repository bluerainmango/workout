const Exercise = require("../models/exerciseModel");

exports.getAllExercise = async (req, res, next) => {
  const exercises = await Exercise.find();

  res.status(200).json({
    status: "success",
    message: "Successfully got all exercises",
    data: exercises
  });
};

exports.createExercise = async (req, res, next) => {
  const { exerciseName, duration, description, plan } = req.body;

  const doc = await Exercise.create({
    exerciseName,
    duration,
    description,
    plan
  });

  res.status(201).json({
    status: "success",
    message: "Successfully created exercise",
    data: doc
  });
};

exports.updateExercise = async (req, res, next) => {
  const updatedDoc = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    message: "Successfully updated excercise in the plan",
    data: updatedDoc
  });
};
