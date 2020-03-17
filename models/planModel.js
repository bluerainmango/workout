const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, "A plan must have a name"],
      trim: true,
      maxlength: [30, "A plan name must have less or equal than 30 characters"]
      // minlength: [1, "A plan name must have at least 1 character"]
      // unique: [true, "A plan name should be unique"]
    },
    duration: {
      type: Number
    },
    description: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date
    }
    // createdAt: {
    //   type: Date,
    //   default: Date.now()
    // }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: "createdAt" }
  }
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
