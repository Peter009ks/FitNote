const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exercise name is required"],
      trim: true,
      minlength: 2,
    },

    muscleGroup: {
      type: String,
      required: true,
      enum: [
        "Chest",
        "Back",
        "Legs",
        "Shoulders",
        "Arms",
        "Core",
        "Full Body",
      ],
    },

    equipment: {
      type: String,
      required: true,
      enum: [
        "Barbell",
        "Dumbbell",
        "Machine",
        "Cable",
        "Bodyweight",
      ],
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    caloriesPerMinute: {
      type: Number,
      min: 1,
      max: 50,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exercise", exerciseSchema);