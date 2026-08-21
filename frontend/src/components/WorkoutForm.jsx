function WorkoutForm({
  workoutForm,
  users,
  exercises,
  handleChange,
  handleCreateWorkout,
}) {
  return (
    <section className="card">
      <h2>Add Workout</h2>

      <form
        className="workout-form"
        onSubmit={handleCreateWorkout}
      >
        {/* USER */}
        <div className="form-group">
          <label htmlFor="userId">
            User
          </label>

          <select
            id="userId"
            name="userId"
            value={workoutForm.userId}
            onChange={handleChange}
            required
          >
            <option value="">
              Select user
            </option>

            {users.map((user) => (
              <option
                key={user._id}
                value={user._id}
              >
                {user.username}
              </option>
            ))}
          </select>
        </div>

        {/* EXERCISE */}
        <div className="form-group">
          <label htmlFor="exerciseId">
            Exercise
          </label>

          <select
            id="exerciseId"
            name="exerciseId"
            value={workoutForm.exerciseId}
            onChange={handleChange}
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
            <label htmlFor="sets">
              Sets
            </label>

            <input
              id="sets"
              type="number"
              name="sets"
              min="1"
              value={workoutForm.sets}
              onChange={handleChange}
              required
            />
          </div>

          {/* REPS */}
          <div className="form-group">
            <label htmlFor="reps">
              Reps
            </label>

            <input
              id="reps"
              type="number"
              name="reps"
              min="1"
              value={workoutForm.reps}
              onChange={handleChange}
              required
            />
          </div>

          {/* WEIGHT */}
          <div className="form-group">
            <label htmlFor="weight">
              Weight (kg)
            </label>

            <input
              id="weight"
              type="number"
              name="weight"
              min="0"
              value={workoutForm.weight}
              onChange={handleChange}
              required
            />
          </div>

          {/* DURATION */}
          <div className="form-group">
            <label htmlFor="duration">
              Duration (minutes)
            </label>

            <input
              id="duration"
              type="number"
              name="duration"
              min="1"
              value={workoutForm.duration}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* FATIGUE */}
        <div className="form-group">
          <label htmlFor="fatigueLevel">
            Fatigue Level:{" "}
            {workoutForm.fatigueLevel}
          </label>

          <input
            id="fatigueLevel"
            type="range"
            name="fatigueLevel"
            min="1"
            max="10"
            value={workoutForm.fatigueLevel}
            onChange={handleChange}
          />
        </div>

        {/* PERSONAL RECORD */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isPR"
              checked={workoutForm.isPR}
              onChange={handleChange}
            />

            Personal Record
          </label>
        </div>

        {/* PR TYPE */}
        {workoutForm.isPR && (
          <div className="form-group">
            <label htmlFor="prType">
              PR Type
            </label>

            <select
              id="prType"
              name="prType"
              value={workoutForm.prType}
              onChange={handleChange}
              required
            >
              <option value="">
                Select PR type
              </option>

              <option value="Weight">
                Weight
              </option>

              <option value="Reps">
                Reps
              </option>

              <option value="Volume">
                Volume
              </option>
            </select>
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          className="primary-button"
        >
          Add Workout
        </button>
      </form>
    </section>
  );
}

export default WorkoutForm;