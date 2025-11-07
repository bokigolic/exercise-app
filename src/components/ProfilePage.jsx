// src/components/ProfilePage.jsx
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Trash2,
  CloudUpload,
  LogOut,
  LogIn,
  Trophy,
  Settings,
  Activity,
  Flame,
} from "lucide-react";
import { auth, loginWithGoogle, logout, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [firebaseUser, setFirebaseUser] = useState(null);
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
  const [unitSystem, setUnitSystem] = useState("metric");
  const [quote, setQuote] = useState("");

  // 🔹 Motivational quote generator
  const quotes = [
    "Discipline beats motivation every time.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "If it doesn’t challenge you, it doesn’t change you.",
    "A one-hour workout is 4% of your day — no excuses.",
    "Train hard, stay humble, and be consistent.",
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // 🔹 Firebase Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setUser(snap.data());
          localStorage.setItem("gymUser", JSON.stringify(snap.data()));
        }
      }
    });
    return () => unsub();
  }, []);

  // 🔹 Local autosave
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
    setUser({
      ...user,
      workouts: user.workouts.filter((_, i) => i !== index),
    });
  };

  const syncToCloud = async () => {
    if (!firebaseUser) return alert("Please sign in first!");
    try {
      await setDoc(doc(db, "users", firebaseUser.uid), user);
      localStorage.setItem("lastSynced", "true"); // ✅ dodaj ovu liniju
      alert("✅ Profile synced to cloud!");
    } catch (err) {
      console.error(err);
      alert("❌ Error syncing data.");
    }
  };

  const convertWeight = (w) =>
    unitSystem === "imperial" ? (w * 2.20462).toFixed(1) : w;
  const convertHeight = (h) =>
    unitSystem === "imperial" ? (h / 2.54).toFixed(1) : h;

  // 🔹 Quick tips
  const tips = [
    "Stay hydrated during workouts 💧",
    "Track your progress weekly 📊",
    "Prioritize recovery and sleep 😴",
    "Keep your form clean and consistent 🏋️",
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white space-y-10">
      {/* 🔹 HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {user.name
              ? `${user.name}'s Fitness Profile`
              : "🏋️‍♂️ Gym Master Profile"}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Personal dashboard • Goals • Progress • Achievements
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          {firebaseUser ? (
            <>
              <img
                src={firebaseUser.photoURL}
                alt="User Avatar"
                className="w-16 h-16 rounded-full ring-2 ring-blue-600"
              />
              <p className="text-sm">{firebaseUser.displayName}</p>
              <div className="flex gap-2">
                <button
                  onClick={syncToCloud}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <CloudUpload size={16} /> Sync
                </button>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <LogIn size={18} /> Sign in with Google
            </button>
          )}
        </div>
      </header>

      {/* 🔹 MOTIVATION CARD */}
      <section className="bg-gradient-to-br from-blue-800/30 to-purple-700/20 border border-blue-600/30 rounded-2xl p-6 shadow-lg">
        <p className="text-lg italic text-center text-slate-300">“{quote}”</p>
      </section>

      {/* 🔹 QUICK STATS */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Daily Calories"
          value={user.calories || "—"}
          icon={<Flame />}
        />
        <StatCard
          title="Workouts/Week"
          value={user.workoutsPerWeek || "—"}
          icon={<Activity />}
        />
        <StatCard
          title="Current Weight"
          value={`${convertWeight(user.weight) || "—"} ${
            unitSystem === "imperial" ? "lbs" : "kg"
          }`}
          icon={<Trophy />}
        />
        <StatCard title="Goal" value={user.goal || "—"} icon={<Settings />} />
      </section>

      {/* 🔹 UNIT SWITCHER */}
      <div className="flex justify-end gap-3">
        <p className="text-sm text-slate-400">Units:</p>
        <button
          onClick={() => setUnitSystem("metric")}
          className={`px-3 py-1 rounded-md text-sm ${
            unitSystem === "metric"
              ? "bg-blue-600"
              : "bg-white/10 text-slate-300"
          }`}
        >
          Metric
        </button>
        <button
          onClick={() => setUnitSystem("imperial")}
          className={`px-3 py-1 rounded-md text-sm ${
            unitSystem === "imperial"
              ? "bg-blue-600"
              : "bg-white/10 text-slate-300"
          }`}
        >
          Imperial
        </button>
      </div>

      {/* 🔹 PERSONAL INFO */}
      <section className="bg-white/5 rounded-2xl p-6 ring-1 ring-white/10 space-y-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {editing ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {["name", "age", "height", "weight", "goal"].map((field) => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                type={
                  ["age", "height", "weight"].includes(field)
                    ? "number"
                    : "text"
                }
                value={user[field]}
                onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg p-2"
              />
            ))}
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
              className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-300">
            <Info label="Name" value={user.name} />
            <Info label="Age" value={user.age} />
            <Info
              label="Height"
              value={`${convertHeight(user.height)} ${
                unitSystem === "imperial" ? "in" : "cm"
              }`}
            />
            <Info
              label="Weight"
              value={`${convertWeight(user.weight)} ${
                unitSystem === "imperial" ? "lbs" : "kg"
              }`}
            />
            <Info label="Goal" value={user.goal} />
            <Info label="Activity" value={user.activityLevel} />
            <Info label="Workouts/week" value={user.workoutsPerWeek} />
            <button
              onClick={() => setEditing(true)}
              className="col-span-2 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-white"
            >
              Edit
            </button>
          </div>
        )}
      </section>

      {/* 🔹 PROGRESS TRACKER */}
      <section className="bg-white/5 p-6 rounded-2xl ring-1 ring-white/10 space-y-4">
        <h2 className="text-xl font-semibold">Progress Tracker</h2>
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg"
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

      {/* 🔹 WORKOUT HISTORY */}
      <section className="bg-white/5 p-6 rounded-2xl ring-1 ring-white/10">
        <h2 className="text-xl font-semibold mb-3">Saved Workouts</h2>
        {user.workouts?.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {user.workouts
              .slice(-6)
              .reverse()
              .map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`p-4 rounded-xl text-center border ${
                    badge.unlocked
                      ? "border-blue-500 bg-blue-600/20 text-white"
                      : "border-slate-700 bg-slate-800/40 text-slate-500"
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h3 className="font-semibold">{badge.title}</h3>
                  <p className="text-xs mt-1">{badge.desc}</p>
                </motion.div>
              ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">
            No workouts saved yet. Generate and save one in the Workout
            Generator.
          </p>
        )}
      </section>

      {/* 🔹 ACHIEVEMENTS */}
      <section className="bg-gradient-to-br from-blue-800/30 to-purple-800/20 p-6 rounded-2xl ring-1 ring-white/10 space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          🏆 Achievements & Badges
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {generateAchievements(user).map((badge, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl text-center border ${
                badge.unlocked
                  ? "border-blue-500 bg-blue-600/20 text-white"
                  : "border-slate-700 bg-slate-800/40 text-slate-500"
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h3 className="font-semibold">{badge.title}</h3>
              <p className="text-xs mt-1">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 FOOTER */}
      <footer className="text-center text-slate-500 text-sm pt-8">
        <p>© 2025 Gym Master – All rights reserved.</p>
      </footer>
    </div>
  );
}

// 🧩 Reusable Subcomponents
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white/10 p-4 rounded-xl flex flex-col items-center justify-center gap-2 ring-1 ring-white/10 shadow">
    <div className="text-blue-400">{icon}</div>
    <h3 className="text-sm text-slate-400">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Info = ({ label, value }) => (
  <p>
    <strong className="text-slate-400">{label}: </strong>
    {value || "—"}
  </p>
);

// 🎯 Dynamic Achievement Generator
const generateAchievements = (user) => {
  const achievements = [];

  const weightLoss =
    user.progress.length >= 2
      ? user.progress[0].weight - user.progress[user.progress.length - 1].weight
      : 0;

  const completedProfile =
    user.name && user.age && user.height && user.weight && user.goal;

  achievements.push({
    title: "Getting Started",
    desc: "Added your first progress entry!",
    icon: "🏁",
    unlocked: user.progress.length > 0,
  });

  achievements.push({
    title: "7-Day Streak",
    desc: "Logged progress on 7 different days.",
    icon: "💪",
    unlocked: user.progress.length >= 7,
  });

  achievements.push({
    title: "Consistency King",
    desc: "Saved 5 or more workouts!",
    icon: "🔥",
    unlocked: user.workouts && user.workouts.length >= 5,
  });

  achievements.push({
    title: "Cloud Synced",
    desc: "Synced your profile to the cloud.",
    icon: "☁️",
    unlocked: localStorage.getItem("lastSynced") === "true",
  });

  achievements.push({
    title: "Weight Warrior",
    desc: "Lost more than 3 kg since starting.",
    icon: "⚖️",
    unlocked: weightLoss >= 3,
  });

  achievements.push({
    title: "Profile Completed",
    desc: "Filled in all profile fields.",
    icon: "🌟",
    unlocked: completedProfile,
  });

  return achievements;
};
