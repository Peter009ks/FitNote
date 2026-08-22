function PersonalRecords({ prs }) {
  return (
    <section className="card personal-records">
      <h2>Personal Records</h2>

      <p>Your recorded personal records.</p>

      {prs.length === 0 ? (
        <p className="no-records">
          No personal records yet.
        </p>
      ) : (
        <div className="pr-list">
          {prs.map((pr) => {
            const exerciseName =
              pr.exerciseId?.name ||
              pr.exerciseName ||
              "Exercise";

            const type = pr.prType || "Weight";

            let value = pr.value ?? 0;
            let unit = "kg";

            if (type === "Weight") {
              value = pr.weight ?? pr.value ?? 0;
              unit = "kg";
            } else if (type === "Reps") {
              value = pr.reps ?? pr.value ?? 0;
              unit = "reps";
            } else if (type === "Volume") {
              value = pr.volume ?? pr.value ?? 0;
              unit = "kg";
            }

            return (
              <div
                className="pr-row"
                key={pr._id}
              >
                <div className="pr-info">
                  <strong>
                    {exerciseName}
                  </strong>

                  <span>
                    {type}
                  </span>
                </div>

                <strong className="pr-number">
                  {value} {unit}
                </strong>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default PersonalRecords;