import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Trash2 } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("gymUser");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          age: "",
          height: "",
          weight: "",
          goal: "",
          activityLevel: "",
          workoutsPerWeek: "",
          calories: 0,
          progress: [],
          workouts: [],
        };
  });

  const [newWeight, setNewWeight] = useState("");
  const [editing, setEditing] = useState(false);
  const [unitSystem, setUnitSystem] = useState("metric"); // metric | imperial

  useEffect(() => {
    localStorage.setItem("gymUser", JSON.stringify(user));
  }, [user]);

  const calculateCalories = () => {
    if (!user.weight || !user.height || !user.age) return 0;
    const bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    const multiplier =
      {
        low: 1.2,
        moderate: 1.55,
        high: 1.75,
      }[user.activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  };

  const handleSave = () => {
    setUser({ ...user, calories: calculateCalories() });
    setEditing(false);
  };

  const addProgress = () => {
    if (!newWeight) return;
    const updatedProgress = [
      ...user.progress,
      { date: new Date().toLocaleDateString(), weight: parseFloat(newWeight) },
    ];
    setUser({ ...user, weight: newWeight, progress: updatedProgress });
    setNewWeight("");
  };

  const deleteWorkout = (index) => {
    const updated = {
      ...user,
      workouts: user.workouts.filter((_, i) => i !== index),
    };
    setUser(updated);
  };

  // unit conversions
  const convertWeight = (w) =>
    unitSystem === "imperial" ? (w * 2.20462).toFixed(1) : w;
  const convertHeight = (h) =>
    unitSystem === "imperial" ? (h / 2.54).toFixed(1) : h;

  const tips = [
    "Stay hydrated during your workouts 💧",
    "Consistency beats intensity — keep showing up!",
    "Track your sleep to boost recovery 😴",
    "Add 10 minutes of stretching daily to improve mobility 🧘‍♂️",
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10 text-white">
      {/* Hero Section */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            🏋️‍♂️ {user.name || "Your Gym Master Profile"}
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Manage your stats, track your goals, and monitor progress in one
            place.
          </p>
        </div>
        <div className="rounded-full bg-gradient-to-br from-blue-700/40 to-blue-500/20 p-4 ring-1 ring-blue-500/20">
          <div className="w-20 h-20 grid place-items-center rounded-full bg-blue-600/30 text-3xl font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : "👤"}
          </div>
        </div>
      </section>

      {/* Unit Switcher */}
      <section className="flex items-center justify-end gap-3">
        <p className="text-sm text-slate-400">Units:</p>
        <button
          onClick={() => setUnitSystem("metric")}
          className={`px-3 py-1 rounded-md text-sm ${
            unitSystem === "metric"
              ? "bg-blue-600 text-white"
              : "bg-white/10 text-slate-300"
          }`}
        >
          Metric (kg/cm)
        </button>
        <button
          onClick={() => setUnitSystem("imperial")}
          className={`px-3 py-1 rounded-md text-sm ${
            unitSystem === "imperial"
              ? "bg-blue-600 text-white"
              : "bg-white/10 text-slate-300"
          }`}
        >
          Imperial (lbs/in)
        </button>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/10 p-4 rounded-xl text-center">
          <h3 className="text-sm text-slate-400">Daily Calories</h3>
          <p className="text-2xl font-bold text-blue-400">
            {user.calories || "—"}
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl text-center">
          <h3 className="text-sm text-slate-400">Weekly Workouts</h3>
          <p className="text-2xl font-bold text-blue-400">
            {user.workoutsPerWeek || "—"}
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl text-center">
          <h3 className="text-sm text-slate-400">Current Weight</h3>
          <p className="text-2xl font-bold text-blue-400">
            {convertWeight(user.weight) || "—"}{" "}
            {unitSystem === "imperial" ? "lbs" : "kg"}
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl text-center">
          <h3 className="text-sm text-slate-400">Goal</h3>
          <p className="text-2xl font-bold text-blue-400">{user.goal || "—"}</p>
        </div>
      </section>

      {/* Edit / Profile Info */}
      <section className="bg-white/5 p-6 rounded-2xl space-y-4 ring-1 ring-white/10">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {editing ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="bg-white/10 border border-white/20 rounded-lg p-2"
            />
            <input
              placeholder="Age"
              type="number"
              value={user.age}
              onChange={(e) => setUser({ ...user, age: e.target.value })}
              className="bg-white/10 border border-white/20 rounded-lg p-2"
            />
            <input
              placeholder={`Height (${
                unitSystem === "imperial" ? "in" : "cm"
              })`}
              type="number"
              value={user.height}
              onChange={(e) => setUser({ ...user, height: e.target.value })}
              className="bg-white/10 border border-white/20 rounded-lg p-2"
            />
            <input
              placeholder={`Weight (${
                unitSystem === "imperial" ? "lbs" : "kg"
              })`}
              type="number"
              value={user.weight}
              onChange={(e) => setUser({ ...user, weight: e.target.value })}
              className="bg-white/10 border border-white/20 rounded-lg p-2"
            />
            <input
              placeholder="Goal"
              value={user.goal}
              onChange={(e) => setUser({ ...user, goal: e.target.value })}
              className="bg-white/10 border border-white/20 rounded-lg p-2"
            />
            <select
              className="bg-white/10 border border-white/20 rounded-lg p-2"
              value={user.activityLevel}
              onChange={(e) =>
                setUser({ ...user, activityLevel: e.target.value })
              }
            >
              <option value="">Activity Level</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
            <input
              placeholder="Workouts per week"
              type="number"
              value={user.workoutsPerWeek}
              onChange={(e) =>
                setUser({ ...user, workoutsPerWeek: e.target.value })
              }
              className="bg-white/10 border border-white/20 rounded-lg p-2"
            />
            <button
              onClick={handleSave}
              className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Age:</strong> {user.age}
            </p>
            <p>
              <strong>Height:</strong> {convertHeight(user.height)}{" "}
              {unitSystem === "imperial" ? "in" : "cm"}
            </p>
            <p>
              <strong>Weight:</strong> {convertWeight(user.weight)}{" "}
              {unitSystem === "imperial" ? "lbs" : "kg"}
            </p>
            <p>
              <strong>Goal:</strong> {user.goal}
            </p>
            <p>
              <strong>Activity:</strong> {user.activityLevel}
            </p>
            <p>
              <strong>Workouts/week:</strong> {user.workoutsPerWeek}
            </p>
            <p>
              <strong>Calories/day:</strong> {user.calories}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Edit
            </button>
          </div>
        )}
      </section>

      {/* Progress Tracker */}
      <section className="bg-white/5 p-6 rounded-2xl space-y-4 ring-1 ring-white/10">
        <h2 className="text-xl font-semibold">📈 Progress Tracker</h2>
        <div className="flex gap-2">
          <input
            placeholder={`Enter new weight (${
              unitSystem === "imperial" ? "lbs" : "kg"
            })`}
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2"
          />
          <button
            onClick={addProgress}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 rounded-lg"
          >
            Add
          </button>
        </div>
        {user.progress.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={user.progress}>
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "none" }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-400 text-sm">
            No progress data yet. Add your first entry above.
          </p>
        )}
      </section>

      {/* Saved Workouts */}
      <section className="bg-white/5 p-6 rounded-2xl ring-1 ring-white/10 space-y-3">
        <h2 className="text-xl font-semibold">🏋️ Saved Workouts</h2>
        {user.workouts && user.workouts.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[...user.workouts]
              .reverse()
              .slice(0, 6)
              .map((w, i) => (
                <div
                  key={i}
                  className="bg-white/10 p-4 rounded-xl relative ring-1 ring-white/10 shadow-lg"
                >
                  <button
                    onClick={() => deleteWorkout(i)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                    title="Delete workout"
                  >
                    <Trash2 size={16} />
                  </button>
                  <h3 className="text-lg font-semibold text-blue-400 mb-1">
                    {w.plan.title || "Workout Plan"}
                  </h3>
                  <p className="text-xs text-slate-400 mb-2">{w.date}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-slate-300">
                    {w.plan.exercises.slice(0, 6).map((ex, j) => (
                      <div
                        key={j}
                        className="bg-white/5 px-2 py-1 rounded-md truncate"
                        title={ex.name}
                      >
                        {ex.name} – {ex.sets}×{ex.reps}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">
            No workouts saved yet. Generate and save one in the Workout
            Generator.
          </p>
        )}
      </section>
    </div>
  );
}
