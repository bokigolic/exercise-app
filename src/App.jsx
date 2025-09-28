import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import exercisesData from "./data/exercises.json";

function App() {
  const [bodyPart, setBodyPart] = useState("abdominals");
  const [level, setLevel] = useState("all"); // novi filter
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [splash, setSplash] = useState(true); // splash screen
  const [loading, setLoading] = useState(false); // loader za pretragu

  // Splash screen duži (3s)
  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Filtriranje vežbi
  const fetchExercises = () => {
    setLoading(true);
    setTimeout(() => {
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

      if (level !== "all") {
        filtered = filtered.filter(
          (ex) => ex.level.toLowerCase() === level.toLowerCase()
        );
      }

      setExercises(filtered);
      setLoading(false);
    }, 1200); // simulacija vremena za loader
  };

  useEffect(() => {
    fetchExercises();
  }, [bodyPart, level]);

  // Splash screen
  if (splash) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-4xl font-extrabold text-blue-600 dark:text-blue-400"
        >
          🏋️ FitMotion
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -20, 20, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-3xl"
            >
              🏋️
            </motion.div>
            <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
              FitMotion
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex gap-6 text-gray-700 dark:text-gray-200">
            <a href="#" className="hover:text-blue-500">
              Home
            </a>
            <a href="#exercises" className="hover:text-blue-500">
              Exercises
            </a>
            <a href="#about" className="hover:text-blue-500">
              About
            </a>
          </nav>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white dark:from-blue-700 dark:to-indigo-800">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl font-extrabold mb-4"
        >
          Train Smarter, Not Harder
        </motion.h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto">
          Explore 1000+ exercises with detailed steps, images, and categories.
        </p>
      </section>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 my-10 px-4">
        {/* Body Part */}
        <select
          value={bodyPart}
          onChange={(e) => {
            setSearch("");
            setBodyPart(e.target.value);
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
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

        {/* Level */}
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search exercise (e.g. curl)"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 w-64 focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={fetchExercises}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Loader for search */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="text-6xl"
          >
            🏋️
          </motion.div>
        </div>
      ) : exercises.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No exercises found.
        </p>
      ) : (
        <div
          id="exercises"
          className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
        >
          {exercises.map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition flex flex-col"
            >
              {/* Slike */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {ex.images && ex.images.length > 0 ? (
                  ex.images.map((img, idx) => (
                    <motion.img
                      key={idx}
                      src={`/exercises/${img}`}
                      alt={`${ex.name} step ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/no-image.png";
                      }}
                    />
                  ))
                ) : (
                  <p className="italic text-gray-400">No images available</p>
                )}
              </div>

              {/* Info */}
              <h2 className="text-lg font-semibold mb-1">{ex.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Primary Muscles:</span>{" "}
                {ex.primaryMuscles.join(", ")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Equipment:</span> {ex.equipment}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Level:</span> {ex.level}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Category:</span> {ex.category}
              </p>

              {/* Instructions toggle */}
              {ex.instructions && ex.instructions.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm"
                  >
                    {expanded === i ? "Hide Instructions" : "Show Instructions"}
                  </button>

                  {expanded === i && (
                    <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside text-sm">
                      {ex.instructions.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 py-6 bg-gray-100 dark:bg-gray-900 text-center text-gray-600 dark:text-gray-400">
        <p>
          © 2025 FitMotion – Designed & Developed by{" "}
          <span className="font-semibold text-blue-600">BG</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
