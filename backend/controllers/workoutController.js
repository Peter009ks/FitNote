const Workout = require("../models/workout");

// GET all workouts
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate("userId", "username email")
      .populate("exerciseId", "name muscleGroup");

    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch workouts",
      error: error.message,
    });
  }
};

// GET single workout
const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate("userId", "username email")
      .populate("exerciseId", "name muscleGroup");

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch workout",
      error: error.message,
    });
  }
};

// CREATE workout
const createWorkout = async (req, res) => {
  try {
    const workout = await Workout.create(req.body);

    res.status(201).json({
      message: "Workout created successfully",
      workout,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create workout",
      error: error.message,
    });
  }
};

// UPDATE workout
const updateWorkout = async (req, res) => {
  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("userId", "username email")
      .populate("exerciseId", "name muscleGroup");

    if (!updatedWorkout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json({
      message: "Workout updated successfully",
      workout: updatedWorkout,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update workout",
      error: error.message,
    });
  }
};

// DELETE workout
const deleteWorkout = async (req, res) => {
  try {
    const deletedWorkout = await Workout.findByIdAndDelete(
      req.params.id
    );

    if (!deletedWorkout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json({
      message: "Workout deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete workout",
      error: error.message,
    });
  }
};

// GET workouts by user
const getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.params.userId,
    })
      .populate("userId", "username email")
      .populate("exerciseId", "name muscleGroup");

    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user workouts",
      error: error.message,
    });
  }
};

// GET workouts with PRs only
const getPRWorkouts = async (req, res) => {
  try {
    const prs = await Workout.find({
      isPR: true,
    })
      .populate("userId", "username")
      .populate("exerciseId", "name");

    res.status(200).json(prs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch PR workouts",
      error: error.message,
    });
  }
};

// GET workout statistics
const getWorkoutStats = async (req, res) => {
  try {
    const workouts = await Workout.find();

    const totalWorkouts = workouts.length;

    const totalVolume = workouts.reduce(
      (sum, workout) =>
        sum +
        workout.sets *
          workout.reps *
          workout.weight,
      0
    );

    const totalPRs = workouts.filter(
      (workout) => workout.isPR
    ).length;

    const averageFatigue =
      workouts.length > 0
        ? (
            workouts.reduce(
              (sum, workout) =>
                sum +
                (workout.fatigueLevel || 0),
              0
            ) / workouts.length
          ).toFixed(2)
        : 0;

    res.status(200).json({
      totalWorkouts,
      totalVolume,
      totalPRs,
      averageFatigue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch workout statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getUserWorkouts,
  getPRWorkouts,
  getWorkoutStats,
};