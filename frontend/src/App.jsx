import { useEffect, useState } from "react";
import api from "./services/api";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutHistory from "./components/WorkoutHistory";
import PersonalRecords from "./components/PersonalRecords";
import "./App.css";

function App() {
  // --------------------------------------------------
  // DATA STATE
  // --------------------------------------------------

  const [workouts, setWorkouts] = useState([]);
  const [prs, setPrs] = useState([]);
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);

  // --------------------------------------------------
  // UI STATE
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // CREATE WORKOUT FORM
  // --------------------------------------------------

  const [workoutForm, setWorkoutForm] = useState({
    userId: "",
    exerciseId: "",
    sets: 3,
    reps: 10,
    weight: 0,
    duration: 30,
    fatigueLevel: 5,
    isPR: false,
    prType: "None",
  });

  // --------------------------------------------------
  // EDIT WORKOUT FORM
  // --------------------------------------------------

  const [editingWorkoutId, setEditingWorkoutId] =
    useState(null);

  const [editWorkoutForm, setEditWorkoutForm] = useState({
    exerciseId: "",
    sets: 3,
    reps: 10,
    weight: 0,
    duration: 30,
  });

  // --------------------------------------------------
  // LOAD WORKOUTS
  // --------------------------------------------------

  const loadWorkouts = async () => {
    try {
      const response = await api.get("/workouts");

      setWorkouts(response.data);
    } catch (err) {
      console.error(
        "LOAD WORKOUTS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load workouts."
      );
    }
  };

  // --------------------------------------------------
  // LOAD PERSONAL RECORDS
  // --------------------------------------------------

  const loadPRs = async () => {
    try {
      const response = await api.get(
        "/workouts/stats/prs"
      );

      setPrs(response.data);
    } catch (err) {
      console.error(
        "LOAD PRS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load personal records."
      );
    }
  };

  // --------------------------------------------------
  // LOAD USERS
  // --------------------------------------------------

  const loadUsers = async () => {
    try {
      const response = await api.get("/users");

      setUsers(response.data);
    } catch (err) {
      console.error(
        "LOAD USERS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load users."
      );
    }
  };

  // --------------------------------------------------
  // LOAD EXERCISES
  // --------------------------------------------------

  const loadExercises = async () => {
    try {
      const response = await api.get(
        "/exercises"
      );

      setExercises(response.data);
    } catch (err) {
      console.error(
        "LOAD EXERCISES ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load exercises."
      );
    }
  };

  // --------------------------------------------------
  // LOAD ALL DATA
  // --------------------------------------------------

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([
        loadWorkouts(),
        loadPRs(),
        loadUsers(),
        loadExercises(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------
  // CREATE FORM CHANGE
  // --------------------------------------------------

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setWorkoutForm((form) => ({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // --------------------------------------------------
  // CREATE WORKOUT
  // --------------------------------------------------

  const handleCreateWorkout = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await api.post(
        "/workouts",
        {
          userId: workoutForm.userId,

          exerciseId:
            workoutForm.exerciseId,

          sets: Number(
            workoutForm.sets
          ),

          reps: Number(
            workoutForm.reps
          ),

          weight: Number(
            workoutForm.weight
          ),

          duration: Number(
            workoutForm.duration
          ),

          fatigueLevel: Number(
            workoutForm.fatigueLevel
          ),

          isPR: workoutForm.isPR,

          prType: workoutForm.isPR
            ? workoutForm.prType
            : "None",
        }
      );

      const createdWorkout =
        response.data.workout;

      setWorkouts((currentWorkouts) => [
        createdWorkout,
        ...currentWorkouts,
      ]);

      setWorkoutForm({
        userId: "",
        exerciseId: "",
        sets: 3,
        reps: 10,
        weight: 0,
        duration: 30,
        fatigueLevel: 5,
        isPR: false,
        prType: "None",
      });

      setSuccess(
        "Workout created successfully!"
      );

      await loadWorkouts();
      await loadPRs();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "CREATE WORKOUT ERROR:",
        err
      );

      setSuccess("");

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create workout."
      );
    }
  };

  // --------------------------------------------------
  // EDIT FORM CHANGE
  // --------------------------------------------------

  const handleEditChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setEditWorkoutForm((form) => ({
      ...form,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // START EDITING WORKOUT
  // --------------------------------------------------

  const startEditingWorkout = (
    workout
  ) => {
    setEditingWorkoutId(workout._id);

    setEditWorkoutForm({
      exerciseId:
        workout.exerciseId?._id ||
        workout.exerciseId ||
        "",

      sets: workout.sets,

      reps: workout.reps,

      weight: workout.weight,

      duration:
        workout.duration || 30,
    });

    setError("");
    setSuccess("");
  };

  // --------------------------------------------------
  // CANCEL EDITING
  // --------------------------------------------------

  const cancelEditingWorkout = () => {
    setEditingWorkoutId(null);

    setEditWorkoutForm({
      exerciseId: "",
      sets: 3,
      reps: 10,
      weight: 0,
      duration: 30,
    });

    setError("");
  };

  // --------------------------------------------------
  // UPDATE WORKOUT
  // --------------------------------------------------

  const handleUpdateWorkout = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await api.put(
        `/workouts/${editingWorkoutId}`,
        {
          exerciseId:
            editWorkoutForm.exerciseId,

          sets: Number(
            editWorkoutForm.sets
          ),

          reps: Number(
            editWorkoutForm.reps
          ),

          weight: Number(
            editWorkoutForm.weight
          ),

          duration: Number(
            editWorkoutForm.duration
          ),
        }
      );

      const updatedWorkout =
        response.data.workout;

      setWorkouts((currentWorkouts) =>
        currentWorkouts.map(
          (workout) =>
            workout._id ===
            updatedWorkout._id
              ? updatedWorkout
              : workout
        )
      );

      setEditingWorkoutId(null);

      setEditWorkoutForm({
        exerciseId: "",
        sets: 3,
        reps: 10,
        weight: 0,
        duration: 30,
      });

      setSuccess(
        "Workout updated successfully!"
      );

      await loadWorkouts();
      await loadPRs();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "UPDATE WORKOUT ERROR:",
        err
      );

      setSuccess("");

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update workout."
      );
    }
  };

  // --------------------------------------------------
  // DELETE WORKOUT
  // --------------------------------------------------

  const handleDeleteWorkout = async (
    workout
  ) => {
    const exerciseName =
      workout.exerciseId?.name ||
      "this workout";

    const confirmed = window.confirm(
      `Are you sure you want to delete the ${exerciseName} workout? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.delete(
        `/workouts/${workout._id}`
      );

      setWorkouts((currentWorkouts) =>
        currentWorkouts.filter(
          (currentWorkout) =>
            currentWorkout._id !==
            workout._id
        )
      );

      setPrs((currentPRs) =>
        currentPRs.filter(
          (pr) =>
            pr._id !== workout._id
        )
      );

      setSuccess(
        "Workout deleted successfully!"
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "DELETE WORKOUT ERROR:",
        err
      );

      setSuccess("");

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete workout."
      );
    }
  };

  // --------------------------------------------------
  // LOADING SCREEN
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          Loading FitNote...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <div className="app">

      {/* HEADER */}
      <header className="app-header">
        <div>
          <h1>FitNote</h1>

          <p>
            Track your workouts, progress
            and personal records.
          </p>
        </div>
      </header>

      <main className="dashboard">

        {/* ERROR MESSAGE */}
        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="message success-message">
            {success}
          </div>
        )}

        {/* ADD WORKOUT */}
        <WorkoutForm
          workoutForm={workoutForm}
          users={users}
          exercises={exercises}
          handleChange={handleChange}
          handleCreateWorkout={
            handleCreateWorkout
          }
        />

        {/* WORKOUT HISTORY */}
        <WorkoutHistory
          workouts={workouts}
          exercises={exercises}
          editingWorkoutId={
            editingWorkoutId
          }
          editWorkoutForm={
            editWorkoutForm
          }
          handleEditChange={
            handleEditChange
          }
          startEditingWorkout={
            startEditingWorkout
          }
          cancelEditingWorkout={
            cancelEditingWorkout
          }
          handleUpdateWorkout={
            handleUpdateWorkout
          }
          handleDeleteWorkout={
            handleDeleteWorkout
          }
        />

        {/* PERSONAL RECORDS */}
        <PersonalRecords
          prs={prs}
        />

      </main>
    </div>
  );
}

export default App;