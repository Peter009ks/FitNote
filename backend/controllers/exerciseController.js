const Exercise = require("../models/exercise");

// GET all exercises
const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();

    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch exercises",
      error: error.message,
    });
  }
};

// GET single exercise
const getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch exercise",
      error: error.message,
    });
  }
};

// CREATE exercise
const createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);

    res.status(201).json({
      message: "Exercise created successfully",
      exercise,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create exercise",
      error: error.message,
    });
  }
};

// UPDATE exercise
const updateExercise = async (req, res) => {
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedExercise) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      message: "Exercise updated successfully",
      exercise: updatedExercise,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update exercise",
      error: error.message,
    });
  }
};

// DELETE exercise
const deleteExercise = async (req, res) => {
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);

    if (!deletedExercise) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete exercise",
      error: error.message,
    });
  }
};

module.exports = {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
};