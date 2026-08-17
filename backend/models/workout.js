const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: [true, "Exercise ID is required"],
    },

    sets: {
      type: Number,
      required: [true, "Sets are required"],
      min: 1,
    },

    reps: {
      type: Number,
      required: [true, "Reps are required"],
      min: 1,
    },

    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: 0,
    },

    duration: {
      type: Number,
      required: [true, "Workout duration is required"],
      min: 1,
    },

    fatigueLevel: {
      type: Number,
      min: 1,
      max: 10,
    },

    isPR: {
      type: Boolean,
      default: false,
    },

    prType: {
      type: String,
      enum: ["Weight", "Reps", "Volume", "None"],
      default: "None",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    workoutDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workout", workoutSchema);