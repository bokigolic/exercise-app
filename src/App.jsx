import { useEffect, useState } from "react";
import exercisesData from "./data/exercises.json"; // lokalni JSON

function App() {
  const [bodyPart, setBodyPart] = useState("abdominals"); // default
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [openInstructions, setOpenInstructions] = useState({}); // prati otvorene instrukcije

  // Funkcija za filtriranje vežbi
  const fetchExercises = () => {
    let filtered = exercisesData;

    if (search.trim() !== "") {
      filtered = filtered.filter((ex) =>
        ex.name.toLowerCase().includes(search.toLowerCase())
      );
    } else if (bodyPart.trim() !== "") {
      filtered = filtered.filter((ex) =>
        ex.primaryMuscles.some((m) =>
          m.toLowerCase().includes(bodyPart.toLowerCase())
        )
      );
    }

    setExercises(filtered);
  };

  useEffect(() => {
    fetchExercises();
  }, [bodyPart]);

  const toggleInstructions = (id) => {
    setOpenInstructions((prev) => ({
      ...prev,
      [id]: !prev[id], // menja stanje za tu vežbu
    }));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>BokiGym 💪</h1>

      {/* Kontrole za pretragu */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={bodyPart}
          onChange={(e) => {
            setSearch("");
            setBodyPart(e.target.value);
          }}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        >
          <option value="abdominals">Abs</option>
          <option value="biceps">Biceps</option>
          <option value="triceps">Triceps</option>
          <option value="chest">Chest</option>
          <option value="back">Back</option>
          <option value="shoulders">Shoulders</option>
          <option value="quadriceps">Quads</option>
          <option value="hamstrings">Hamstrings</option>
          <option value="glutes">Glutes</option>
          <option value="calves">Calves</option>
        </select>

        <input
          type="text"
          placeholder="Unesi ime vežbe (npr. curl)"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />

        <button
          onClick={fetchExercises}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "none",
            background: "#0077ff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* Lista vežbi */}
      {exercises.length === 0 ? (
        <p>No exercises found.</p>
      ) : (
        <div>
          {exercises.map((ex, i) => (
            <div
              key={i}
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: "1px solid #eee",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <h2>{ex.name}</h2>
              <p>
                <strong>Primary Muscles:</strong> {ex.primaryMuscles.join(", ")}
              </p>
              {ex.secondaryMuscles && ex.secondaryMuscles.length > 0 && (
                <p>
                  <strong>Secondary Muscles:</strong>{" "}
                  {ex.secondaryMuscles.join(", ")}
                </p>
              )}
              <p>
                <strong>Equipment:</strong> {ex.equipment}
              </p>
              <p>
                <strong>Level:</strong> {ex.level}
              </p>
              <p>
                <strong>Category:</strong> {ex.category}
              </p>

              {/* Dugme za otvaranje/zatvaranje instrukcija */}
              {ex.instructions && ex.instructions.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleInstructions(ex.id)}
                    style={{
                      marginTop: "10px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #0077ff",
                      background: openInstructions[ex.id] ? "#0077ff" : "white",
                      color: openInstructions[ex.id] ? "white" : "#0077ff",
                      cursor: "pointer",
                    }}
                  >
                    {openInstructions[ex.id]
                      ? "Hide Instructions"
                      : "Show Instructions"}
                  </button>

                  {openInstructions[ex.id] && (
                    <ul style={{ marginTop: "10px" }}>
                      {ex.instructions.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Slike */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {ex.images && ex.images.length > 0 ? (
                  ex.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`/exercises/${img}`}
                      alt={ex.name}
                      style={{
                        width: "200px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/no-image.png"; // fallback
                      }}
                    />
                  ))
                ) : (
                  <p style={{ fontStyle: "italic", color: "#777" }}>
                    No images available
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
