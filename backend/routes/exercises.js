const router = require("express").Router();
const Exercise = require("../models/Exercise");


// GET all exercises
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find();

    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch exercises",
      error: error.message,
    });
  }
});


// GET single exercise by ID
router.get("/:id", async (req, res) => {
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
});


// CREATE new exercise
router.post("/", async (req, res) => {
  try {
    const {
      name,
      muscleGroup,
      equipment,
      difficulty,
      caloriesPerMinute,
    } = req.body;

    const newExercise = new Exercise({
      name,
      muscleGroup,
      equipment,
      difficulty,
      caloriesPerMinute,
    });

    const savedExercise = await newExercise.save();

    res.status(201).json({
      message: "Exercise created successfully",
      exercise: savedExercise,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create exercise",
      error: error.message,
    });
  }
});


// UPDATE exercise
router.put("/:id", async (req, res) => {
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
});


// DELETE exercise
router.delete("/:id", async (req, res) => {
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
});


module.exports = router;