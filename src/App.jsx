import { useEffect, useState } from "react";

function App() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch("/.netlify/functions/getExercises")
      .then((res) => res.json())
      .then((data) => setExercises(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>BokiGym 💪</h1>
      <p>First 5 exercises from API:</p>
      <ul>
        {exercises.slice(0, 5).map((ex, i) => (
          <li key={i}>{ex.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
