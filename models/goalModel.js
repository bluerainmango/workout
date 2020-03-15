const mongoose = require("mongoose");
const Plan = require("../models/planModel");

const goalSchema = new mongoose.Schema(
  {
    // date: {
    //   type: Date,
    //   required: [true, "A daily goal must have a date"]
    // },
    plan: {
      type: mongoose.Schema.ObjectId,
      ref: "Plan",
      required: [true, "A daily goal must have a plan"]
    },
    isComplished: {
      type: Boolean,
      default: false,
      required: true
    },
    progress: [{ exerciseId: String, isCompleted: Boolean }]
    // progress: {
    //   type: Map,
    //   of: String
    // }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: "createdAt" }
  }
);

//! Save progress prop to doc
goalSchema.pre(/^save/, async function(next) {
  //* 1. Get exercise arr with this goal doc's plan id
  const { exercise } = await Plan.findById(this.plan);
  const exerciseIdArr = exercise.map(el => el._id);

  //* 2. Add this exercise arr to doc.progress prop
  this.recordProgress(exerciseIdArr);

  // console.log("🙉 Added progress prop to this goal doc: ", this.progress);

  next();
});

//! Instance method for goal doc to add a progress prop
// format : [{id:"", isCompleted:true },{}...]
goalSchema.methods.recordProgress = function(exerciseIdArr) {
  this.progress = exerciseIdArr.map((exerciseId, i) => {
    return {
      exerciseId,
      isCompleted: false
    };
  });
};

// Populate plan info in goal doc
goalSchema.pre(/^find/, function(next) {
  this.populate({ path: "plan", select: "planName duration exercise" });
  next();
});

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
