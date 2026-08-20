import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  // ==============================
  // DATA
  // ==============================

  const [workouts, setWorkouts] = useState([]);
  const [prs, setPrs] = useState([]);
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==============================
  // WORKOUT FORM
  // ==============================

  const [workoutForm, setWorkoutForm] = useState({
    userId: "",
    exerciseId: "",
    sets: 3,
    reps: 10,
    weight: 0,
  });

  // ==============================
  // EXERCISE FORM
  // ==============================

  const [showExerciseForm, setShowExerciseForm] = useState(false);

  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    muscleGroup: "",
    equipment: "",
    difficulty: "Beginner",
    caloriesPerMinute: 0,
  });

  // ==============================
  // LOAD DATA
  // ==============================

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          workoutsResponse,
          prsResponse,
          usersResponse,
          exercisesResponse,
        ] = await Promise.all([
          axios.get(`${API_URL}/workouts`),
          axios.get(`${API_URL}/workouts/stats/prs`),
          axios.get(`${API_URL}/users`),
          axios.get(`${API_URL}/exercises`),
        ]);

        setWorkouts(workoutsResponse.data);
        setPrs(prsResponse.data);
        setUsers(usersResponse.data);
        setExercises(exercisesResponse.data);

        // Automatically select first user
        if (usersResponse.data.length > 0) {
          setWorkoutForm((form) => ({
            ...form,
            userId: usersResponse.data[0]._id,
          }));
        }

        // Automatically select first exercise
        if (exercisesResponse.data.length > 0) {
          setWorkoutForm((form) => ({
            ...form,
            exerciseId: exercisesResponse.data[0]._id,
          }));
        }
      } catch (err) {
        console.error("LOAD DATA ERROR:", err);

        setError(
          "Unable to connect to FitNote. Make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==============================
  // WORKOUT FORM CHANGE
  // ==============================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setWorkoutForm((form) => ({
      ...form,
      [name]: value,
    }));
  };

  // ==============================
  // EXERCISE FORM CHANGE
  // ==============================

  const handleExerciseChange = (event) => {
    const { name, value } = event.target;

    setExerciseForm((form) => ({
      ...form,
      [name]: value,
    }));
  };

  // ==============================
  // CREATE WORKOUT
  // ==============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/workouts`, {
        ...workoutForm,
        sets: Number(workoutForm.sets),
        reps: Number(workoutForm.reps),
        weight: Number(workoutForm.weight),

        // Required/default fields
        duration: 30,
        fatigueLevel: 5,
        isPR: false,
        prType: "None",
        notes: "",
        workoutDate: new Date().toISOString(),
      });

      console.log("Workout created:", response.data);

      const newWorkout = response.data.workout;

      setWorkouts((current) => [newWorkout, ...current]);

      // Show success message
      setSuccess("Workout saved successfully!");
      setError("");

      // Automatically hide success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);

      // Reset workout fields
      setWorkoutForm((form) => ({
        ...form,
        sets: 3,
        reps: 10,
        weight: 0,
      }));
    } catch (err) {
      console.error("CREATE WORKOUT ERROR:", err);

      console.error("Backend response:", err.response?.data);

      setSuccess("");

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create workout."
      );
    }
  };

  // ==============================
  // CREATE EXERCISE
  // ==============================

  const handleAddExercise = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/exercises`, {
        name: exerciseForm.name,
        muscleGroup: exerciseForm.muscleGroup,
        equipment: exerciseForm.equipment,
        difficulty: exerciseForm.difficulty,
        caloriesPerMinute: Number(exerciseForm.caloriesPerMinute),
      });

      console.log("Exercise created:", response.data);

      const newExercise = response.data.exercise;

      // Add new exercise to the list
      setExercises((current) => [...current, newExercise]);

      // Automatically select the new exercise
      setWorkoutForm((form) => ({
        ...form,
        exerciseId: newExercise._id,
      }));

      // Reset exercise form
      setExerciseForm({
        name: "",
        muscleGroup: "",
        equipment: "",
        difficulty: "Beginner",
        caloriesPerMinute: 0,
      });

      // Close exercise form
      setShowExerciseForm(false);

      // Clear error
      setError("");

      // Show success message
      setSuccess("Exercise added successfully!");

      // Automatically hide success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("CREATE EXERCISE ERROR:", err);

      console.error("Backend response:", err.response?.data);

      setSuccess("");

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create exercise."
      );
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading FitNote...</h2>
      </div>
    );
  }

  // ==============================
  // IMPORTANT DATA
  // ==============================

  const latestWorkout = workouts[0];
  const latestPR = prs[0];

  // ==============================
  // UI
  // ==============================

  return (
    <div className="app">
      {/* ==========================
          HEADER
      ========================== */}

      <header className="header">
        <div>
          <span className="eyebrow">FITNESS TRACKER</span>

          <h1>FitNote</h1>

          <p>Your fitness progress, simplified.</p>
        </div>

        <div className="stats">
          <div>
            <strong>{workouts.length}</strong>
            <span>Workouts</span>
          </div>

          <div>
            <strong>{prs.length}</strong>
            <span>PRs</span>
          </div>
        </div>
      </header>

      {/* ==========================
          ERROR MESSAGE
      ========================== */}

      {error && <div className="error">{error}</div>}

      {/* ==========================
          SUCCESS MESSAGE
      ========================== */}

      {success && <div className="success">{success}</div>}

      {/* ==========================
          DASHBOARD
      ========================== */}

      <main className="dashboard">
        {/* ========================
            LOG WORKOUT
        ======================== */}

        <section className="card log-card">
          <span className="section-label">LOG WORKOUT</span>

          <h2>Record your workout</h2>

          <form onSubmit={handleSubmit}>
            {/* Exercise selector */}

            <label>
              Exercise

              <select
                name="exerciseId"
                value={workoutForm.exerciseId}
                onChange={handleChange}
                required
              >
                <option value="">Select exercise</option>

                {exercises.map((exercise) => (
                  <option key={exercise._id} value={exercise._id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Add Exercise */}

            <button
              type="button"
              className="add-exercise-button"
              onClick={() =>
                setShowExerciseForm(!showExerciseForm)
              }
            >
              {showExerciseForm
                ? "− Cancel"
                : "+ Add Exercise"}
            </button>

            {/* ======================
                NEW EXERCISE FORM
            ====================== */}

            {showExerciseForm && (
              <div className="exercise-form">
                <h3>Add New Exercise</h3>

                <label>
                  Exercise Name

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Deadlift"
                    value={exerciseForm.name}
                    onChange={handleExerciseChange}
                    required
                  />
                </label>

                <label>
                  Muscle Group

                  <input
                    type="text"
                    name="muscleGroup"
                    placeholder="e.g. Legs, Back"
                    value={exerciseForm.muscleGroup}
                    onChange={handleExerciseChange}
                    required
                  />
                </label>

                <label>
                  Equipment

                  <input
                    type="text"
                    name="equipment"
                    placeholder="e.g. Barbell"
                    value={exerciseForm.equipment}
                    onChange={handleExerciseChange}
                    required
                  />
                </label>

                <label>
                  Difficulty

                  <select
                    name="difficulty"
                    value={exerciseForm.difficulty}
                    onChange={handleExerciseChange}
                  >
                    <option value="Beginner">
                      Beginner
                    </option>

                    <option value="Intermediate">
                      Intermediate
                    </option>

                    <option value="Advanced">
                      Advanced
                    </option>
                  </select>
                </label>

                <label>
                  Calories / Minute

                  <input
                    type="number"
                    name="caloriesPerMinute"
                    min="0"
                    value={exerciseForm.caloriesPerMinute}
                    onChange={handleExerciseChange}
                  />
                </label>

                <button
                  type="button"
                  className="save-exercise-button"
                  onClick={handleAddExercise}
                >
                  Add Exercise
                </button>
              </div>
            )}

            {/* ======================
                WORKOUT FIELDS
            ====================== */}

            <div className="small-fields">
              <label>
                Sets

                <input
                  type="number"
                  name="sets"
                  min="1"
                  value={workoutForm.sets}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Reps

                <input
                  type="number"
                  name="reps"
                  min="1"
                  value={workoutForm.reps}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Weight (kg)

                <input
                  type="number"
                  name="weight"
                  min="0"
                  value={workoutForm.weight}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            {/* Save Workout */}

            <button
              type="submit"
              className="save-workout-button"
            >
              Save Workout
            </button>
          </form>
        </section>

        {/* ========================
            PERSONAL RECORD
        ======================== */}

        <section className="card pr-card">
          <span className="section-label">
            PERSONAL RECORD
          </span>

          <h2>Your latest PR</h2>

          {latestPR ? (
            <div className="pr-display">
              <strong>
                {latestPR.exerciseId?.name ||
                  "Exercise"}
              </strong>

              <span className="pr-weight">
                {latestPR.weight} kg
              </span>

              <span>{latestPR.prType} PR</span>
            </div>
          ) : (
            <p>No personal records yet.</p>
          )}
        </section>

        {/* ========================
            RECENT WORKOUT
        ======================== */}

        <section className="card recent-card">
          <span className="section-label">
            RECENT WORKOUT
          </span>

          <h2>Latest activity</h2>

          {latestWorkout ? (
            <div className="recent-workout">
              <div>
                <strong>
                  {latestWorkout.exerciseId?.name ||
                    "Exercise"}
                </strong>

                <span>
                  {latestWorkout.sets} sets ×{" "}
                  {latestWorkout.reps} reps
                </span>
              </div>

              <strong className="recent-weight">
                {latestWorkout.weight} kg
              </strong>
            </div>
          ) : (
            <p>No workouts recorded yet.</p>
          )}
        </section>

        {/* ========================
            WORKOUT HISTORY
        ======================== */}

        <section className="card history-card">
          <span className="section-label">
            WORKOUT HISTORY
          </span>

          <h2>Recent workouts</h2>

          {workouts.length > 0 ? (
            <div className="history-list">
              {workouts.slice(0, 10).map((workout) => (
                <div
                  className="history-item"
                  key={workout._id}
                >
                  <div className="history-main">
                    <strong>
                      {workout.exerciseId?.name ||
                        "Exercise"}
                    </strong>

                    <span>
                      {workout.sets} sets ×{" "}
                      {workout.reps} reps
                    </span>
                  </div>

                  <div className="history-details">
                    <strong>
                      {workout.weight} kg
                    </strong>

                    <span>
                      {new Date(
                        workout.workoutDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No workouts recorded yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;