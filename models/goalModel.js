const mongoose = require("mongoose");

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
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: "createdAt" }
  }
);

// Populate plan info in goal doc
goalSchema.pre(/^find/, function(next) {
  this.populate({ path: "plan", select: "planName duration exercise" });
  next();
});

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
