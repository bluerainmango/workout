exports.getPlans = (req, res, next) => {
  console.log("🍓inside");
  res.status(200).json({
    status: "success"
  });
};
