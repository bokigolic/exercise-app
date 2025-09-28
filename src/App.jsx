import { useState } from "react";
import data from "./data/exercises.json"; // tvoj JSON fajl

function App() {
  const [bodyPart, setBodyPart] = useState("waist");
  const [search, setSearch] = useState("");

  // filtriranje vežbi
  const filteredExercises = data.filter((exercise) => {
    if (!exercise || !exercise.name || !exercise.primaryMuscles) return false;

    if (search.trim() !== "") {
      return exercise.name.toLowerCase().includes(search.toLowerCase());
    }

    return (
      exercise.primaryMuscles[0] &&
      exercise.primaryMuscles[0].toLowerCase().includes(bodyPart.toLowerCase())
    );
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>BokiGym 💪</h1>

      {/* Kontrole */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={bodyPart}
          onChange={(e) => {
            setSearch("");
            setBodyPart(e.target.value);
          }}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="abdominals">Abs</option>
          <option value="back">Back</option>
          <option value="chest">Chest</option>
          <option value="biceps">Biceps</option>
          <option value="triceps">Triceps</option>
          <option value="legs">Legs</option>
          <option value="shoulders">Shoulders</option>
        </select>

        <input
          type="text"
          placeholder="Unesi ime vežbe (npr. curl)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />
      </div>

      {/* Lista vežbi */}
      {filteredExercises.length === 0 ? (
        <p>No exercises found.</p>
      ) : (
        <div>
          {filteredExercises.map((exercise, i) => (
            <div
              key={i}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #eee",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              {/* Slika iz public/exercises */}
              {exercise.images && exercise.images.length > 0 && (
                <img
                  src={`/exercises/${exercise.images[0]}`}
                  alt={exercise.name}
                  style={{ width: "250px", borderRadius: "10px" }}
                />
              )}

              <h2>{exercise.name}</h2>
              <p>
                <strong>Primary Muscles:</strong>{" "}
                {exercise.primaryMuscles?.join(", ")}
              </p>
              <p>
                <strong>Secondary Muscles:</strong>{" "}
                {exercise.secondaryMuscles?.join(", ")}
              </p>
              <p>
                <strong>Equipment:</strong> {exercise.equipment}
              </p>
              <p>
                <strong>Level:</strong> {exercise.level}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
