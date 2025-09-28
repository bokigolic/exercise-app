import { useEffect, useState } from "react";
import exercisesData from "../data/exercises.json";
import Loader from "../components/Loader";
import { motion } from "framer-motion";

function Home() {
  const [bodyPart, setBodyPart] = useState("abdominals");
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filtriranje
  const fetchExercises = () => {
    setLoading(true);

    let filtered = exercisesData;

    if (search.trim() !== "") {
      filtered = filtered.filter((ex) =>
        ex.name.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      filtered = filtered.filter((ex) =>
        ex.primaryMuscles.some((m) =>
          m.toLowerCase().includes(bodyPart.toLowerCase())
        )
      );
    }

    if (level) {
      filtered = filtered.filter(
        (ex) => ex.level.toLowerCase() === level.toLowerCase()
      );
    }

    setTimeout(() => {
      setExercises(filtered);
      setLoading(false);
    }, 1200); // simulacija loading animacije
  };

  useEffect(() => {
    fetchExercises();
  }, [bodyPart, level]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative text-center py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold"
        >
          Welcome to GymMaster 💪
        </motion.h1>
        <p className="mt-3 text-lg opacity-90">
          Your interactive exercise guide with animations, images & filters
        </p>
      </section>

      {/* Kontrole */}
      <div className="flex flex-wrap justify-center gap-4 p-6">
        {/* Body part */}
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
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Advanced</option>
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

      {/* Exercises Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {loading ? (
          <Loader />
        ) : exercises.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No exercises found.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition flex flex-col"
              >
                {/* Slike (po dve) */}
                <div className="flex gap-3 mb-4">
                  {ex.images && ex.images.length > 0 ? (
                    ex.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`/exercises/${img}`}
                        alt={ex.name}
                        className="w-1/2 rounded-lg object-cover"
                      />
                    ))
                  ) : (
                    <p className="italic text-gray-400">No images</p>
                  )}
                </div>

                {/* Info */}
                <h2 className="text-xl font-semibold mb-2">{ex.name}</h2>
                <p>
                  <span className="font-medium">Primary Muscles:</span>{" "}
                  {ex.primaryMuscles.join(", ")}
                </p>
                <p>
                  <span className="font-medium">Equipment:</span> {ex.equipment}
                </p>
                <p>
                  <span className="font-medium">Level:</span> {ex.level}
                </p>
                <p>
                  <span className="font-medium">Category:</span> {ex.category}
                </p>

                {/* Instructions toggle */}
                {ex.instructions && ex.instructions.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      {expanded === i
                        ? "Hide Instructions"
                        : "Show Instructions"}
                    </button>

                    {expanded === i && (
                      <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
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
      </div>
    </div>
  );
}

export default Home;
