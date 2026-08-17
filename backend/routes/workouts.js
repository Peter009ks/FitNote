const router = require("express").Router();

const {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getUserWorkouts,
  getPRWorkouts,
  getWorkoutStats,
} = require("../controllers/workoutController");

// ==============================
// GET Routes
// ==============================

// GET all workouts
router.get("/", getWorkouts);

// GET workout statistics
router.get("/stats", getWorkoutStats);

// GET all PR workouts
router.get("/stats/prs", getPRWorkouts);

// GET workouts for a specific user
router.get("/user/:userId", getUserWorkouts);

// GET single workout
router.get("/:id", getWorkout);

// ==============================
// POST Routes
// ==============================

// CREATE workout
router.post("/", createWorkout);

// ==============================
// PUT Routes
// ==============================

// UPDATE workout
router.put("/:id", updateWorkout);

// ==============================
// DELETE Routes
// ==============================

// DELETE workout
router.delete("/:id", deleteWorkout);

module.exports = router;