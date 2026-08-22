import { useEffect, useState } from "react";
import api from "./services/api";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutHistory from "./components/WorkoutHistory";
import PersonalRecords from "./components/PersonalRecords";
import "./App.css";

function App() {
  // ==================================================
  // DATA STATE
  // ==================================================

  const [workouts, setWorkouts] = useState([]);
  const [prs, setPrs] = useState([]);
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);

  // ==================================================
  // UI STATE
  // ==================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Workout search + filter
  const [workoutSearch, setWorkoutSearch] = useState("");
  const [exerciseFilter, setExerciseFilter] = useState("");

  // ==================================================
  // CREATE USER FORM
  // ==================================================

  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    fitnessGoal: "Strength",
  });

  // ==================================================
  // CREATE WORKOUT FORM
  // ==================================================

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

  // ==================================================
  // EDIT WORKOUT FORM
  // ==================================================

  const [editingWorkoutId, setEditingWorkoutId] = useState(null);

  const [editWorkoutForm, setEditWorkoutForm] = useState({
    exerciseId: "",
    sets: 3,
    reps: 10,
    weight: 0,
    duration: 30,
  });

  // ==================================================
  // CLEAR ERRORS
  // ==================================================

  const clearErrors = () => {
    setError("");
    setValidationErrors({});
  };

  // ==================================================
  // HANDLE API ERROR
  // ==================================================

  const handleApiError = (err, fallbackMessage) => {
    console.error(err);

    setSuccess("");

    const responseData = err.response?.data;

    if (
      responseData?.errors &&
      typeof responseData.errors === "object"
    ) {
      setError(
        responseData.message ||
          "Please correct the following errors."
      );

      setValidationErrors(responseData.errors);

      return;
    }

    setValidationErrors({});

    setError(
      responseData?.message ||
        responseData?.error ||
        fallbackMessage
    );
  };

  // ==================================================
  // LOAD WORKOUTS
  // ==================================================

  const loadWorkouts = async () => {
    try {
      const response = await api.get("/workouts");

      setWorkouts(response.data);
    } catch (err) {
      handleApiError(
        err,
        "Failed to load workouts."
      );
    }
  };

  // ==================================================
  // LOAD PERSONAL RECORDS
  // ==================================================

  const loadPRs = async () => {
    try {
      const response = await api.get(
        "/workouts/stats/prs"
      );

      setPrs(response.data);
    } catch (err) {
      handleApiError(
        err,
        "Failed to load personal records."
      );
    }
  };

  // ==================================================
  // LOAD USERS
  // ==================================================

  const loadUsers = async () => {
    try {
      const response = await api.get("/users");

      setUsers(response.data);
    } catch (err) {
      handleApiError(
        err,
        "Failed to load users."
      );
    }
  };

  // ==================================================
  // LOAD EXERCISES
  // ==================================================

  const loadExercises = async () => {
    try {
      const response = await api.get("/exercises");

      setExercises(response.data);
    } catch (err) {
      handleApiError(
        err,
        "Failed to load exercises."
      );
    }
  };

  // ==================================================
  // LOAD ALL DATA
  // ==================================================

  const loadData = async () => {
    setLoading(true);
    clearErrors();

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

  // ==================================================
  // FILTER WORKOUTS
  // ==================================================

  const filteredWorkouts = workouts.filter(
    (workout) => {
      const exerciseName =
        workout.exerciseId?.name || "";

      const matchesSearch =
        exerciseName
          .toLowerCase()
          .includes(
            workoutSearch.toLowerCase()
          );

      const workoutExerciseId =
        workout.exerciseId?._id ||
        workout.exerciseId ||
        "";

      const matchesExercise =
        !exerciseFilter ||
        workoutExerciseId === exerciseFilter;

      return (
        matchesSearch &&
        matchesExercise
      );
    }
  );

  // ==================================================
  // CREATE USER FORM CHANGE
  // ==================================================

  const handleUserChange = (event) => {
    const { name, value } = event.target;

    clearErrors();

    setUserForm((form) => ({
      ...form,
      [name]: value,
    }));
  };

  // ==================================================
  // CREATE USER
  // ==================================================

  const handleCreateUser = async (event) => {
    event.preventDefault();

    clearErrors();

    try {
      const response = await api.post("/users", {
        username: userForm.username.trim(),
        email: userForm.email.trim(),
        fitnessGoal: userForm.fitnessGoal,
      });

      const createdUser = response.data.user;

      setUsers((currentUsers) => [
        ...currentUsers,
        createdUser,
      ]);

      setUserForm({
        username: "",
        email: "",
        fitnessGoal: "Strength",
      });

      setWorkoutForm((form) => ({
        ...form,
        userId: createdUser._id,
      }));

      setSuccess(
        "User created successfully!"
      );

      await loadUsers();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      handleApiError(
        err,
        "Failed to create user."
      );
    }
  };

  // ==================================================
  // CREATE WORKOUT FORM CHANGE
  // ==================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    clearErrors();

    setWorkoutForm((form) => ({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==================================================
  // CREATE WORKOUT
  // ==================================================

  const handleCreateWorkout = async (event) => {
    event.preventDefault();

    clearErrors();

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
      handleApiError(
        err,
        "Failed to create workout."
      );
    }
  };

  // ==================================================
  // EDIT FORM CHANGE
  // ==================================================

  const handleEditChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    clearErrors();

    setEditWorkoutForm((form) => ({
      ...form,
      [name]: value,
    }));
  };

  // ==================================================
  // START EDITING WORKOUT
  // ==================================================

  const startEditingWorkout = (workout) => {
    clearErrors();

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
  };

  // ==================================================
  // CANCEL EDITING
  // ==================================================

  const cancelEditingWorkout = () => {
    clearErrors();

    setEditingWorkoutId(null);

    setEditWorkoutForm({
      exerciseId: "",
      sets: 3,
      reps: 10,
      weight: 0,
      duration: 30,
    });
  };

  // ==================================================
  // UPDATE WORKOUT
  // ==================================================

  const handleUpdateWorkout = async (event) => {
    event.preventDefault();

    clearErrors();

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
      handleApiError(
        err,
        "Failed to update workout."
      );
    }
  };

  // ==================================================
  // DELETE WORKOUT
  // ==================================================

  const handleDeleteWorkout = async (workout) => {
    const exerciseName =
      workout.exerciseId?.name ||
      "this workout";

    const confirmed = window.confirm(
      `Are you sure you want to delete the ${exerciseName} workout? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    clearErrors();

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
      handleApiError(
        err,
        "Failed to delete workout."
      );
    }
  };

  // ==================================================
  // LOADING SCREEN
  // ==================================================

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          Loading FitNote...
        </div>
      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="app">

      {/* ==========================================
          HEADER
      ========================================== */}

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

        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}

        {error && (
          <div className="message error-message">
            <strong>{error}</strong>

            {Object.keys(
              validationErrors
            ).length > 0 && (
              <ul>
                {Object.entries(
                  validationErrors
                ).map(
                  ([
                    field,
                    message,
                  ]) => (
                    <li key={field}>
                      <strong>
                        {field}:
                      </strong>{" "}
                      {message}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        )}

        {/* ==========================================
            SUCCESS MESSAGE
        ========================================== */}

        {success && (
          <div className="message success-message">
            {success}
          </div>
        )}

        {/* ==========================================
            CREATE USER
        ========================================== */}

        <section className="card create-user-card">
          <h2>Add User</h2>

          <p>
            Create a new user for FitNote.
          </p>

          <form
            onSubmit={handleCreateUser}
          >
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              name="username"
              value={userForm.username}
              onChange={handleUserChange}
              placeholder="Enter username"
              minLength={3}
              maxLength={20}
              required
            />

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={userForm.email}
              onChange={handleUserChange}
              placeholder="Enter email"
              required
            />

            <label htmlFor="fitnessGoal">
              Fitness Goal
            </label>

            <select
              id="fitnessGoal"
              name="fitnessGoal"
              value={userForm.fitnessGoal}
              onChange={handleUserChange}
            >
              <option value="Strength">
                Strength
              </option>

              <option value="Muscle Gain">
                Muscle Gain
              </option>

              <option value="Weight Loss">
                Weight Loss
              </option>

              <option value="Endurance">
                Endurance
              </option>
            </select>

            <button type="submit">
              Create User
            </button>
          </form>
        </section>

        {/* ==========================================
            ADD WORKOUT
        ========================================== */}

        <WorkoutForm
          workoutForm={workoutForm}
          users={users}
          exercises={exercises}
          handleChange={handleChange}
          handleCreateWorkout={
            handleCreateWorkout
          }
        />

        {/* ==========================================
            WORKOUT HISTORY
        ========================================== */}

        <WorkoutHistory
          workouts={filteredWorkouts}
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
          search={workoutSearch}
          setSearch={setWorkoutSearch}
          exerciseFilter={exerciseFilter}
          setExerciseFilter={
            setExerciseFilter
          }
        />

        {/* ==========================================
            PERSONAL RECORDS
        ========================================== */}

        <PersonalRecords
          prs={prs}
        />

      </main>
    </div>
  );
}

export default App;