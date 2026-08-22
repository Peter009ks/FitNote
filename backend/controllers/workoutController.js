const mongoose = require("mongoose");
const Workout = require("../models/workout");

// ==================================================
// HELPER: HANDLE MONGOOSE / API ERRORS
// ==================================================

const handleError = (error, res, defaultMessage) => {
  console.error(error);

  // ----------------------------------------------
  // MONGOOSE VALIDATION ERROR
  // ----------------------------------------------

  if (error.name === "ValidationError") {
    const validationErrors = {};

    Object.keys(error.errors).forEach((field) => {
      validationErrors[field] =
        error.errors[field].message;
    });

    return res.status(400).json({
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  // ----------------------------------------------
  // INVALID OBJECT ID
  // ----------------------------------------------

  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
      field: error.path,
      value: error.value,
    });
  }

  // ----------------------------------------------
  // DUPLICATE KEY ERROR
  // ----------------------------------------------

  if (error.code === 11000) {
    return res.status(409).json({
      message: "Duplicate record",
      error: error.message,
    });
  }

  // ----------------------------------------------
  // DEFAULT SERVER ERROR
  // ----------------------------------------------

  return res.status(500).json({
    message: defaultMessage,
    error: error.message,
  });
};

// ==================================================
// GET ALL WORKOUTS
// ==================================================

const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate(
        "userId",
        "username email"
      )
      .populate(
        "exerciseId",
        "name muscleGroup"
      )
      .sort({
        workoutDate: -1,
      });

    res.status(200).json(workouts);
  } catch (error) {
    return handleError(
      error,
      res,
      "Failed to fetch workouts"
    );
  }
};

// ==================================================
// GET SINGLE WORKOUT
// ==================================================

const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(
      req.params.id
    )
      .populate(
        "userId",
        "username email"
      )
      .populate(
        "exerciseId",
        "name muscleGroup"
      );

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json(workout);
  } catch (error) {
    return handleError(
      error,
      res,
      "Failed to fetch workout"
    );
  }
};

// ==================================================
// CREATE WORKOUT
// ==================================================

const createWorkout = async (req, res) => {
  try {
    const {
      userId,
      exerciseId,
      sets,
      reps,
      weight,
      duration,
      fatigueLevel,
      isPR,
      prType,
      notes,
      workoutDate,
    } = req.body;

    // ----------------------------------------------
    // BASIC REQUEST VALIDATION
    // ----------------------------------------------

    if (!userId) {
      return res.status(400).json({
        message: "Validation failed",
        errors: {
          userId: "User ID is required",
        },
      });
    }

    if (!exerciseId) {
      return res.status(400).json({
        message: "Validation failed",
        errors: {
          exerciseId:
            "Exercise ID is required",
        },
      });
    }

    if (sets === undefined || sets === null) {
      return res.status(400).json({
        message: "Validation failed",
        errors: {
          sets: "Sets are required",
        },
      });
    }

    if (reps === undefined || reps === null) {
      return res.status(400).json({
        message: "Validation failed",
        errors: {
          reps: "Reps are required",
        },
      });
    }

    if (weight === undefined || weight === null) {
      return res.status(400).json({
        message: "Validation failed",
        errors: {
          weight: "Weight is required",
        },
      });
    }

    if (
      duration === undefined ||
      duration === null
    ) {
      return res.status(400).json({
        message: "Validation failed",
        errors: {
          duration:
            "Workout duration is required",
        },
      });
    }

    // ----------------------------------------------
    // CREATE WORKOUT
    // ----------------------------------------------

    const workout = await Workout.create({
      userId,
      exerciseId,
      sets,
      reps,
      weight,
      duration,
      fatigueLevel,
      isPR,
      prType,
      notes,
      workoutDate,
    });

    // ----------------------------------------------
    // RETURN POPULATED WORKOUT
    // ----------------------------------------------

    const populatedWorkout =
      await Workout.findById(
        workout._id
      )
        .populate(
          "userId",
          "username email"
        )
        .populate(
          "exerciseId",
          "name muscleGroup"
        );

    res.status(201).json({
      message:
        "Workout created successfully",
      workout: populatedWorkout,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "Failed to create workout"
    );
  }
};

// ==================================================
// UPDATE WORKOUT
// ==================================================

const updateWorkout = async (req, res) => {
  try {
    // ----------------------------------------------
    // CHECK THAT WORKOUT EXISTS
    // ----------------------------------------------

    const existingWorkout =
      await Workout.findById(
        req.params.id
      );

    if (!existingWorkout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    // ----------------------------------------------
    // UPDATE WORKOUT
    // ----------------------------------------------

    const updatedWorkout =
      await Workout.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "userId",
          "username email"
        )
        .populate(
          "exerciseId",
          "name muscleGroup"
        );

    // ----------------------------------------------
    // SAFETY CHECK
    // ----------------------------------------------

    if (!updatedWorkout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json({
      message:
        "Workout updated successfully",
      workout: updatedWorkout,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "Failed to update workout"
    );
  }
};

// ==================================================
// DELETE WORKOUT
// ==================================================

const deleteWorkout = async (req, res) => {
  try {
    const deletedWorkout =
      await Workout.findByIdAndDelete(
        req.params.id
      );

    if (!deletedWorkout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json({
      message:
        "Workout deleted successfully",
      workoutId: deletedWorkout._id,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "Failed to delete workout"
    );
  }
};

// ==================================================
// GET WORKOUTS BY USER
// ==================================================

const getUserWorkouts = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const workouts =
      await Workout.find({
        userId,
      })
        .populate(
          "userId",
          "username email"
        )
        .populate(
          "exerciseId",
          "name muscleGroup"
        )
        .sort({
          workoutDate: -1,
        });

    res.status(200).json(workouts);
  } catch (error) {
    return handleError(
      error,
      res,
      "Failed to fetch user workouts"
    );
  }
};

// ==================================================
// GET WORKOUTS WITH PRS ONLY
// ==================================================

const getPRWorkouts = async (
  req,
  res
) => {
  try {
    const prs = await Workout.find({
      isPR: true,
    })
      .populate(
        "userId",
        "username email"
      )
      .populate(
        "exerciseId",
        "name muscleGroup"
      )
      .sort({
        workoutDate: -1,
      });

    res.status(200).json(prs);
  } catch (error) {
    return handleError(
      error,
      res,
      "Failed to fetch PR workouts"
    );
  }
};

// ==================================================
// GET WORKOUT STATISTICS
// ==================================================

const getWorkoutStats = async (
  req,
  res
) => {
  try {
    const workouts =
      await Workout.find();

    const totalWorkouts =
      workouts.length;

    const totalVolume =
      workouts.reduce(
        (sum, workout) =>
          sum +
          workout.sets *
            workout.reps *
            workout.weight,
        0
      );

    const totalPRs =
      workouts.filter(
        (workout) =>
          workout.isPR === true
      ).length;

    const averageFatigue =
      workouts.length > 0
        ? (
            workouts.reduce(
              (sum, workout) =>
                sum +
                (workout.fatigueLevel ||
                  0),
              0
            ) / workouts.length
          ).toFixed(2)
        : 0;

    res.status(200).json({
      totalWorkouts,
      totalVolume,
      totalPRs,
      averageFatigue:
        Number(averageFatigue),
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "Failed to fetch workout statistics"
    );
  }
};

// ==================================================
// EXPORT CONTROLLERS
// ==================================================

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