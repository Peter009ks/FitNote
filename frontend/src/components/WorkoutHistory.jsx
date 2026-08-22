function WorkoutHistory({
  workouts,
  exercises,
  editingWorkoutId,
  editWorkoutForm,
  handleEditChange,
  startEditingWorkout,
  cancelEditingWorkout,
  handleUpdateWorkout,
  handleDeleteWorkout,
  search,
  setSearch,
  exerciseFilter,
  setExerciseFilter,
}) {
  return (
    <section className="card history-card">
      <div className="section-header">
        <div>
          <h2>Workout History</h2>

          <p>
            Your latest recorded workouts.
          </p>
        </div>
      </div>

      {/* ==============================
          SEARCH + FILTER
      ============================== */}

      <div className="workout-filters">
        <input
          type="text"
          placeholder="Search workouts..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={exerciseFilter}
          onChange={(event) =>
            setExerciseFilter(event.target.value)
          }
        >
          <option value="">
            All exercises
          </option>

          {exercises.map((exercise) => (
            <option
              key={exercise._id}
              value={exercise._id}
            >
              {exercise.name}
            </option>
          ))}
        </select>
      </div>

      {/* ==============================
          WORKOUT LIST
      ============================== */}

      {workouts.length > 0 ? (
        <div className="history-list">
          {workouts.slice(0, 10).map((workout) => (
            <div
              className="history-item"
              key={workout._id}
            >
              {/* ==============================
                  EDIT MODE
              ============================== */}

              {editingWorkoutId === workout._id ? (
                <form
                  className="edit-workout-form"
                  onSubmit={handleUpdateWorkout}
                >
                  <h3>Edit Workout</h3>

                  {/* EXERCISE */}

                  <div className="form-group">
                    <label
                      htmlFor={`exercise-${workout._id}`}
                    >
                      Exercise
                    </label>

                    <select
                      id={`exercise-${workout._id}`}
                      name="exerciseId"
                      value={
                        editWorkoutForm.exerciseId
                      }
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">
                        Select exercise
                      </option>

                      {exercises.map((exercise) => (
                        <option
                          key={exercise._id}
                          value={exercise._id}
                        >
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SETS / REPS / WEIGHT / DURATION */}

                  <div className="form-row">
                    {/* SETS */}

                    <div className="form-group">
                      <label
                        htmlFor={`sets-${workout._id}`}
                      >
                        Sets
                      </label>

                      <input
                        id={`sets-${workout._id}`}
                        type="number"
                        name="sets"
                        min="1"
                        value={editWorkoutForm.sets}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    {/* REPS */}

                    <div className="form-group">
                      <label
                        htmlFor={`reps-${workout._id}`}
                      >
                        Reps
                      </label>

                      <input
                        id={`reps-${workout._id}`}
                        type="number"
                        name="reps"
                        min="1"
                        value={editWorkoutForm.reps}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    {/* WEIGHT */}

                    <div className="form-group">
                      <label
                        htmlFor={`weight-${workout._id}`}
                      >
                        Weight (kg)
                      </label>

                      <input
                        id={`weight-${workout._id}`}
                        type="number"
                        name="weight"
                        min="0"
                        value={
                          editWorkoutForm.weight
                        }
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    {/* DURATION */}

                    <div className="form-group">
                      <label
                        htmlFor={`duration-${workout._id}`}
                      >
                        Duration (minutes)
                      </label>

                      <input
                        id={`duration-${workout._id}`}
                        type="number"
                        name="duration"
                        min="1"
                        value={
                          editWorkoutForm.duration
                        }
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>

                  {/* EDIT BUTTONS */}

                  <div className="edit-actions">
                    <button
                      type="submit"
                      className="primary-button"
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="cancel-edit-button"
                      onClick={
                        cancelEditingWorkout
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* ==============================
                   NORMAL WORKOUT VIEW
                ============================== */

                <>
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
                      {workout.workoutDate
                        ? new Date(
                            workout.workoutDate
                          ).toLocaleDateString()
                        : "No date"}
                    </span>
                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="history-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() =>
                        startEditingWorkout(workout)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleDeleteWorkout(workout)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          {search || exerciseFilter ? (
            <>
              <strong>
                No workouts found.
              </strong>

              <span>
                Try changing your search or
                exercise filter.
              </span>
            </>
          ) : (
            <>
              <strong>
                No workouts recorded yet.
              </strong>

              <span>
                Add your first workout above.
              </span>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default WorkoutHistory;