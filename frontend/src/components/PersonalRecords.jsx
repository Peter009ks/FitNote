function PersonalRecords({ prs }) {
  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>Personal Records</h2>

          <p>
            Your recorded personal records.
          </p>
        </div>
      </div>

      {prs.length > 0 ? (
        <div className="pr-list">
          {prs.map((pr) => (
            <div
              className="pr-item"
              key={pr._id}
            >
              <div>
                <strong>
                  {pr.exerciseId?.name ||
                    "Exercise"}
                </strong>

                <span>
                  {pr.prType ||
                    "Personal Record"}
                </span>
              </div>

              <strong>
                {pr.weight} kg
              </strong>
            </div>
          ))}
        </div>
      ) : (
        <p>
          No personal records yet.
        </p>
      )}
    </section>
  );
}

export default PersonalRecords;