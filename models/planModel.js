const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, "A plan must have a name"],
      trim: true,
      maxlength: [30, "A plan name must have less or equal than 30 characters"],
      minlength: [3, "A plan name must have at least 3 characters"],
      unique: [true, "A plan name should be unique"]
    },
    duration: {
      type: Number,
      required: [true, "A plan must have a duration"]
    },
    description: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual Referencing to exercise
planSchema.virtual("exercise", {
  ref: "Exercise",
  foreignField: "plan",
  localField: "_id"
});

// Populating exercise
planSchema.pre(/^find/, function(next) {
  this.populate({
    path: "exercise",
    select: "exerciseName description duration -plan"
  });

  next();
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
