const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, "A plan must have a name"],
      unique: true,
      trim: true,
      maxlength: [30, "A plan name must have less or equal than 30 characters"],
      minlength: [3, "A plan name must have at least 3 characters"]
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
    // exercise: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Exercise"
    //   }
    // ]
  },
  { toJSON: { virtuals: ture }, toObject: { virtuals: ture } }
);

PlanSchema.virtual("exercise", {
  ref: "Exercise",
  foreignField: "plan",
  localField: "_id"
});

const Plan = mongoose.model("Plan", PlanSchema);

module.exports = Plan;
