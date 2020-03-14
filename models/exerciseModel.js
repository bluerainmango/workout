const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema(
  {
    exerciseName: {
      type: String,
      required: [true, "A exercise must have a name"],
      trim: true,
      maxlength: [
        30,
        "A exercise name must have less or equal than 30 characters"
      ],
      minlength: [3, "A exercise name must have at least 3 characters"]
    },
    duration: {
      type: Number,
      required: [true, "a exercise must have a duration"]
    },
    plan: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Plan",
        required: [true, "Exercise must belong to a plan"]
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: "createdAt" }
  }
);

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
