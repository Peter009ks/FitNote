const router = require("express").Router();

const {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/exerciseController");

// GET all exercises
router.get("/", getExercises);

// GET single exercise
router.get("/:id", getExercise);

// CREATE exercise
router.post("/", createExercise);

// UPDATE exercise
router.put("/:id", updateExercise);

// DELETE exercise
router.delete("/:id", deleteExercise);

module.exports = router;