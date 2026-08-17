const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
  type: String,
  required: [true, "Email is required"],
  unique: true,
  trim: true,
  lowercase: true,
  match: [
    /^\S+@\S+\.\S+$/,
    "Please enter a valid email address",
  ],
},

    fitnessGoal: {
      type: String,
      enum: ["Strength", "Muscle Gain", "Weight Loss", "Endurance"],
      default: "Strength",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);