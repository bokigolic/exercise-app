import { useEffect, useState } from "react";

function App() {
  const [bodyPart, setBodyPart] = useState("waist"); // default (abs = waist)
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExercises = async () => {
    try {
      setLoading(true);

      let param = "";
      if (search.trim() !== "") {
        param = `name=${search}`;
      } else {
        param = `bodyPart=${bodyPart}`;
      }

      const res = await fetch(`/.netlify/functions/getExercises?${param}`);
      const data = await res.json();

      console.log("👉 API Response data:", data);

      if (Array.isArray(data)) {
        setExercises(data);
      } else {
        setExercises([]);
      }
    } catch (err) {
      console.error("❌ Greška pri dohvaćanju vežbi:", err);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [bodyPart]);

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
          <option value="waist">Abs (waist)</option>
          <option value="back">Back</option>
          <option value="chest">Chest</option>
          <option value="lower arms">Lower arms</option>
          <option value="lower legs">Lower legs</option>
          <option value="neck">Neck</option>
          <option value="shoulders">Shoulders</option>
          <option value="upper arms">Upper arms</option>
          <option value="upper legs">Upper legs</option>
          <option value="cardio">Cardio</option>
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
      {loading ? (
        <p>Loading exercises...</p>
      ) : exercises.length === 0 ? (
        <p>No exercises found.</p>
      ) : (
        <div>
          {exercises.map((exercise, i) => (
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
              <h2>{exercise.name}</h2>
              <p>
                <strong>Body Part:</strong> {exercise.bodyPart}
              </p>
              <p>
                <strong>Equipment:</strong> {exercise.equipment}
              </p>
              <p>
                <strong>Target:</strong> {exercise.target}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
