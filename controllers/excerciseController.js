exports.getAllExercise = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "from excercise"
  });
};
