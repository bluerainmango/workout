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
    isAccomplished: {
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

//! Instance method for goal doc to check all exercises are completed
goalSchema.methods.checkAccomplished = function() {
  // console.log("😡Check funci nside", this.progress);
  const isAllAccomplished = this.progress.every(el => el.isCompleted === true);
  // console.log("😡All accomplished: ", isAllAccomplished);

  return isAllAccomplished;
};

//! Instance method for goal doc to add a progress prop
// format : [{exerciseId:"", isCompleted:true },{}...]
goalSchema.methods.recordProgress = function(exerciseIdArr) {
  this.progress = exerciseIdArr.map(exerciseId => {
    return {
      exerciseId,
      isCompleted: false
    };
  });
};

//! Pre Save Hook : save progress prop to doc
goalSchema.pre(/^save/, async function(next) {
  // This pre hook Works when create(), save().
  // If triggered when save() is called, not create(), skip this middleware.
  if (!this.isNew) return next();

  //* 1. Get exercise arr with this goal doc's plan id
  const { exercise } = await Plan.findById(this.plan);
  const exerciseIdArr = exercise.map(el => el._id);

  //* 2. Add this exercise arr to doc.progress prop
  this.recordProgress(exerciseIdArr);

  console.log("🙉 Added progress prop to this goal doc: ", this.progress);

  next();
});

//! Pre Save Hook : update isAccomplished prop
goalSchema.pre(/^save/, async function(next) {
  console.log("🥶 is Accomplished before", this.isAccomplished);
  this.isAccomplished = this.checkAccomplished();
  console.log("🥵  is Accomplished after", this.isAccomplished);

  next();
  // [How to access doc in pre query hook]
  // const docToUpdate = await this.model.findOne(this.getQuery());
  // console.log(
  //   "😨 docToUpdate",
  //   docToUpdate.isAccomplished,
  //   docToUpdate.checkAccomplished()
  // );
  // docToUpdate.set({ isAccomplished: docToUpdate.checkAccomplished() });
});

//! Pre Query Hook : populate plan info in goal doc
goalSchema.pre(/^find/, function(next) {
  this.populate({ path: "plan", select: "planName duration exercise" });

  next();
});

//! Post Save Hook : populate plan info in goal doc(returned doc after creating, updating)
goalSchema.post(/^save/, async function(doc, next) {
  await this.populate({
    path: "plan",
    select: "planName duration exercise"
  }).execPopulate();

  next();
});

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
