import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Ruler, Camera, Dumbbell } from "lucide-react";

function FitnessHub() {
  const [activeTab, setActiveTab] = useState("calories");

  const tabs = [
    { id: "calories", label: "Calories", icon: <Flame /> },
    { id: "measurements", label: "Measurements", icon: <Ruler /> },
    { id: "posture", label: "Posture", icon: <Camera /> },
    { id: "plans", label: "Plans", icon: <Dumbbell /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Header */}
      <section className="text-center py-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg rounded-xl mb-8">
        <h1 className="text-4xl font-extrabold tracking-wide">
          🏋️ Advanced Fitness Hub
        </h1>
        <p className="mt-2 opacity-90">
          All-in-one: calories, body tracking, posture analysis & goal-based
          plans
        </p>
      </section>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-10 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto">
        {activeTab === "calories" && <CaloriesTab />}
        {activeTab === "measurements" && <MeasurementsTab />}
        {activeTab === "posture" && <PostureTab />}
        {activeTab === "plans" && <PlansTab />}
      </div>
    </div>
  );
}

//
// 🔹 1. Calories Calculator
//
function CaloriesTab() {
  const [activity, setActivity] = useState("running");
  const [duration, setDuration] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const activities = {
    running: 9.8,
    cycling: 7.5,
    swimming: 8,
    football: 10,
    yoga: 3,
    hiit: 12,
    walking: 3.5,
  };

  const calculate = () => {
    if (!duration || !weight) return;
    const met = activities[activity];
    const calories = (met * weight * (duration / 60)).toFixed(0);
    setResult(calories);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold mb-4">
        🔥 Activity Calories Calculator
      </h2>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        Calculate how many calories you burn during common activities using the{" "}
        <strong>MET formula</strong>:
        <br />
        <code>Calories = MET × weight(kg) × duration(h)</code>
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
        >
          {Object.keys(activities).map((a) => (
            <option key={a} value={a}>
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Duration (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
        />
      </div>
      <button
        onClick={calculate}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Calculate
      </button>
      {result && (
        <div className="mt-6 bg-green-100 dark:bg-green-900/40 p-4 rounded-xl">
          <p className="text-lg font-medium">
            You burned approximately <span className="font-bold">{result}</span>{" "}
            kcal ⚡
          </p>
          <p className="text-sm opacity-80">
            Equivalent to ~{Math.round(result / 100)} bananas 🍌
          </p>
        </div>
      )}
    </motion.div>
  );
}

//
// 🔹 2. Measurements Tracker
//
function MeasurementsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold mb-4">📏 Body Measurements Tracker</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Track progress in key measurements:{" "}
        <strong>waist, chest, biceps, thighs, hips</strong>. Combine with photos
        or charts for visual progress 📊.
      </p>
      <p className="italic opacity-70">
        (Future enhancement: save data, show graphs, compare months)
      </p>
    </motion.div>
  );
}

//
// 🔹 3. Posture Analysis
//
function PostureTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold mb-4">🤸 Posture & Pose Analysis</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Upload an image or use your camera for AI-based posture detection.
        <br />
        Feedback example: ✅ “Great squat form” or ⚠️ “Your knee is moving too
        far forward”.
      </p>
      <p className="italic opacity-70 mt-3">
        (Prototype mode – AI integration can be added later)
      </p>
    </motion.div>
  );
}

//
// 🔹 4. Plans Generator
//
function PlansTab() {
  const [goal, setGoal] = useState("fat-loss");
  const [level, setLevel] = useState("beginner");
  const [weeks, setWeeks] = useState("4");
  const [frequency, setFrequency] = useState("3");
  const [plan, setPlan] = useState(null);

  const generatePlan = () => {
    const trainingTemplates = {
      "fat-loss": {
        beginner: [
          "3x Full-body circuit (10–12 reps, 3 rounds)",
          "2x Cardio (20–30 min brisk walk/jog)",
        ],
        intermediate: [
          "Upper/Lower split + cardio finishers",
          "HIIT 2x week (20 min intervals)",
        ],
        advanced: [
          "Push/Pull/Legs split 5–6x week",
          "HIIT finishers + steady-state cardio",
        ],
      },
      "muscle-gain": {
        beginner: [
          "3x Full-body (8–10 reps, progressive overload)",
          "Optional cardio 1x week",
        ],
        intermediate: ["Upper/Lower split 4x week", "Accessory isolation work"],
        advanced: ["Push/Pull/Legs 6x week", "High volume compound lifts"],
      },
      endurance: {
        beginner: ["Jog 20 min", "Bike 30 min", "Walk 30 min"],
        intermediate: ["Run intervals + long run 1x", "Swim 2x", "Bike 1x"],
        advanced: ["5x training: long runs, swim drills, cycling intervals"],
      },
      health: {
        beginner: ["2x Strength full-body", "2x Light cardio (30 min)"],
        intermediate: ["3x Strength (split)", "2x Cardio (40 min)"],
        advanced: ["4x Strength", "3x Cardio mix"],
      },
    };

    const nutritionTemplates = {
      "fat-loss": {
        desc: "Stay in a calorie deficit. Focus on high protein, low sugar.",
        protein: "1.8–2.2 g/kg",
        carbs: "30–40%",
        fats: "20–25%",
      },
      "muscle-gain": {
        desc: "Eat in a slight calorie surplus. Prioritize protein & carbs.",
        protein: "2 g/kg",
        carbs: "45–55%",
        fats: "20–25%",
      },
      endurance: {
        desc: "Carb-rich diet for energy. Moderate protein.",
        protein: "1.5 g/kg",
        carbs: "55–65%",
        fats: "15–20%",
      },
      health: {
        desc: "Balanced macros. Focus on whole foods.",
        protein: "1.6 g/kg",
        carbs: "45–55%",
        fats: "20–30%",
      },
    };

    // Generate schedule
    const days = [];
    const totalWeeks = parseInt(weeks);
    const freq = parseInt(frequency);
    for (let w = 1; w <= totalWeeks; w++) {
      for (let d = 1; d <= freq; d++) {
        days.push({
          week: w,
          day: d,
          workout:
            trainingTemplates[goal][level][
              (d - 1) % trainingTemplates[goal][level].length
            ],
        });
      }
    }

    setPlan({
      goal,
      level,
      weeks,
      frequency,
      training: trainingTemplates[goal][level],
      nutrition: nutritionTemplates[goal],
      days,
      milestones: [
        "Week 1–2: Adaptation – build consistency 💪",
        "Midway: Increase intensity/volume 🔥",
        totalWeeks >= 8 ? "Reassess progress, adjust macros 📊" : null,
        totalWeeks >= 12 ? "Final push – peak training 🚀" : null,
      ].filter(Boolean),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold mb-4">📅 Goal-Based Plans</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Generate structured workout + nutrition plans based on your{" "}
        <strong>goal, level, weeks, and frequency</strong>. Plans are based on
        proven templates (not AI).
      </p>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
        >
          <option value="fat-loss">Fat Loss</option>
          <option value="muscle-gain">Muscle Gain</option>
          <option value="endurance">Endurance</option>
          <option value="health">General Health</option>
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={weeks}
          onChange={(e) => setWeeks(e.target.value)}
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
        >
          <option value="4">4 weeks</option>
          <option value="8">8 weeks</option>
          <option value="12">12 weeks</option>
        </select>

        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
        >
          <option value="3">3 sessions/week</option>
          <option value="4">4 sessions/week</option>
          <option value="5">5 sessions/week</option>
          <option value="6">6 sessions/week</option>
        </select>
      </div>

      <button
        onClick={generatePlan}
        className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Generate Plan
      </button>

      {/* Results */}
      {plan && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-green-100 dark:bg-green-900/40 p-6 rounded-xl shadow-inner"
        >
          <h3 className="text-lg font-bold mb-2">
            {plan.weeks}-week {plan.goal.replace("-", " ")} plan ({plan.level})
          </h3>
          <p className="mb-2">
            <span className="font-semibold">Frequency:</span> {plan.frequency}
            x/week
          </p>

          {/* Training */}
          <p className="mb-1 font-semibold">Training focus:</p>
          <ul className="list-disc list-inside mb-3 text-sm">
            {plan.training.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          {/* Nutrition */}
          <p className="mb-1 font-semibold">Nutrition guidelines:</p>
          <p className="text-sm mb-1">{plan.nutrition.desc}</p>
          <ul className="list-disc list-inside text-sm">
            <li>Protein: {plan.nutrition.protein}</li>
            <li>Carbs: {plan.nutrition.carbs}</li>
            <li>Fats: {plan.nutrition.fats}</li>
          </ul>

          {/* Milestones */}
          <p className="mt-4 font-semibold">Milestones:</p>
          <ul className="list-disc list-inside text-sm">
            {plan.milestones.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>

          {/* Day-by-Day */}
          <p className="mt-4 font-semibold">Sample Week Schedule:</p>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full text-sm border">
              <thead className="bg-blue-200 dark:bg-blue-800">
                <tr>
                  <th className="p-2 border">Week</th>
                  <th className="p-2 border">Day</th>
                  <th className="p-2 border">Workout</th>
                </tr>
              </thead>
              <tbody>
                {plan.days.slice(0, 7).map((d, i) => (
                  <tr key={i} className="text-center">
                    <td className="p-2 border">{d.week}</td>
                    <td className="p-2 border">Day {d.day}</td>
                    <td className="p-2 border">{d.workout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs opacity-70 mt-2">
            * Week 1 shown. Following weeks gradually increase difficulty.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default FitnessHub;
