// src/components/WorkoutGenerator.jsx
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Flame,
  Target,
  Clock,
  Home,
  Activity,
  RefreshCcw,
  Clipboard,
  X,
  CheckCircle2,
} from "lucide-react";
import programsData from "../data/programs.json";

/* ---------- small utils ---------- */
const cn = (...c) => c.filter(Boolean).join(" ");
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleBySeed = (arr) => {
  // why: razbijanje tie-ova bez menjanja logike
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ---------- option sets ---------- */
const GOALS = [
  { key: "weight_loss", label: "Weight Loss", icon: Flame },
  { key: "muscle_gain", label: "Muscle Gain", icon: Dumbbell },
  { key: "strength", label: "Strength", icon: Target },
  { key: "endurance", label: "Endurance", icon: Clock },
];

const LEVELS = ["beginner", "intermediate", "advanced"];
const LOCATIONS = [
  { key: "home", label: "Home", icon: Home },
  { key: "gym", label: "Gym", icon: Dumbbell },
  { key: "outdoor", label: "Outdoor", icon: Activity },
];

const EQUIPMENT = [
  "none",
  "dumbbell",
  "barbell",
  "bands",
  "machines",
  "kettlebell",
];
const MUSCLES = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
  "glutes",
];
const DURATIONS = [
  { key: "short", label: "20–30 min" },
  { key: "long", label: "45–60 min" },
];
const DAY_OPTIONS = [2, 3, 4, 5, 6];

const STEPS = [
  "Goal",
  "Level",
  "Location",
  "Equipment",
  "Muscles",
  "Duration",
  "Days",
];

/* ---------- UI bits ---------- */
const Card = ({ children, className = "" }) => (
  <div
    className={cn(
      "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8",
      className
    )}
  >
    {children}
  </div>
);

const OptionButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    aria-pressed={!!active}
    className={cn(
      "p-4 rounded-xl border-2 transition text-sm",
      active
        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
        : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
    )}
  >
    {children}
  </button>
);

const Chip = ({ children, onRemove, tone = "slate" }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
      tone === "blue" &&
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200",
      tone === "green" &&
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200",
      tone === "purple" &&
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200",
      tone === "orange" &&
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200",
      tone === "slate" &&
        "bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-200"
    )}
  >
    {children}
    {onRemove && (
      <button
        onClick={onRemove}
        className="ml-1 rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"
        title="Remove"
        aria-label="Remove filter"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </span>
);

const Loader = ({ message }) => (
  <div className="mt-10 flex flex-col items-center gap-4">
    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
    <p className="text-gray-600 dark:text-gray-400">{message}</p>
  </div>
);

/* ---------- generator helpers (logika ostaje: score + sort + slice) ---------- */
const decideCount = (duration) => (duration === "long" ? 9 : 6);

const normalizeArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const scoreExercise = (ex, filters) => {
  // why: blago ponderisanje; i dalje je score sistem kakav si imao
  let score = 0;
  if (filters.goal && ex.goal === filters.goal) score += 3;
  if (filters.level && ex.level === filters.level) score += 2;

  const exLoc = normalizeArray(ex.location);
  if (filters.location && exLoc.includes(filters.location)) score += 2;

  const progEq = normalizeArray(ex.equipmentProgram);
  if (filters.equipment.length > 0 && progEq.length > 0) {
    if (filters.equipment.some((eq) => progEq.includes(eq))) score += 1;
  }

  const exMuscles = normalizeArray(ex.muscle_groups);
  if (filters.muscles.length > 0 && exMuscles.length > 0) {
    const matches = filters.muscles.filter((m) => exMuscles.includes(m)).length;
    score += Math.min(matches, 2) * 2; // cap dve grupe za balans
  }

  return score;
};

const collectExercises = (programs) => {
  const all = [];
  programs.forEach((p) => {
    p.plan.forEach((day) => {
      day.exercises.forEach((ex) => {
        all.push({
          ...ex,
          program: p.name,
          day: day.day,
          goal: p.goal,
          level: p.level,
          location: p.location,
          equipmentProgram: p.equipment || [],
        });
      });
    });
  });
  return all;
};

const diversifyPick = (sorted, targetCount, targetMuscles) => {
  // why: sprečava monoton izbor istih mišića, ali i dalje sleduje score redosled
  const picked = [];
  const nameSet = new Set();
  const muscleCount = new Map();

  const capPerMuscle =
    targetMuscles && targetMuscles.length > 0
      ? Math.max(1, Math.ceil(targetCount / Math.min(targetMuscles.length, 4)))
      : Math.ceil(targetCount / 3);

  for (const ex of sorted) {
    if (picked.length >= targetCount) break;
    if (nameSet.has(ex.name)) continue;

    const mgs = normalizeArray(ex.muscle_groups);
    const overCap = mgs.some((m) => (muscleCount.get(m) || 0) >= capPerMuscle);
    if (overCap && picked.length < targetCount - 2) {
      // pokušaj ostaviti mesta za raznolikost
      continue;
    }

    picked.push(ex);
    nameSet.add(ex.name);
    mgs.forEach((m) => muscleCount.set(m, (muscleCount.get(m) || 0) + 1));
  }

  // fallback popuna ako nije dosta
  let i = 0;
  while (picked.length < targetCount && i < sorted.length) {
    const ex = sorted[i++];
    if (!nameSet.has(ex.name)) {
      picked.push(ex);
      nameSet.add(ex.name);
    }
  }
  return picked;
};

/* ===================== MAIN COMPONENT ===================== */
export default function WorkoutGenerator() {
  const [step, setStep] = useState(0);
  const [filters, setFilters] = useState({
    goal: "",
    level: "",
    location: "",
    equipment: [],
    muscles: [],
    duration: "",
    days: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Preparing workout…");
  const [generatedWorkout, setGeneratedWorkout] = useState([]);

  // loader messages
  useEffect(() => {
    if (!loading) return;
    const msgs = [
      "Mixing your exercises… 💪",
      "Warming up your program… 🔥",
      "Almost ready… ⏳",
    ];
    let i = 0;
    const id = setInterval(() => {
      setLoadingMessage(msgs[i % msgs.length]);
      i++;
    }, 800);
    return () => clearInterval(id);
  }, [loading]);

  const isStepValid = (idx) => {
    switch (idx) {
      case 0:
        return !!filters.goal;
      case 1:
        return !!filters.level;
      case 2:
        return !!filters.location;
      case 3:
        return true; // equipment optional
      case 4:
        return true; // muscles optional
      case 5:
        return !!filters.duration;
      case 6:
        return !!filters.days;
      default:
        return true;
    }
  };

  const allRequiredValid = useMemo(
    () => [0, 1, 2, 5, 6].every((i) => isStepValid(i)),
    [filters]
  );

  const handleSelect = (field, value) =>
    setFilters((f) => ({ ...f, [field]: value }));
  const handleMultiSelect = (field, value) =>
    setFilters((prev) =>
      prev[field].includes(value)
        ? { ...prev, [field]: prev[field].filter((v) => v !== value) }
        : { ...prev, [field]: [...prev[field], value] }
    );

  const clearField = (field) => {
    setFilters((f) => ({
      ...f,
      [field]: Array.isArray(f[field]) ? [] : "",
    }));
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const goto = (i) => setStep(i);

  const generateCore = () => {
    let allExercises = collectExercises(programsData.programs);

    let scored = allExercises.map((ex) => ({
      ...ex,
      score: scoreExercise(ex, filters),
    }));

    scored = shuffleBySeed(scored).sort((a, b) => b.score - a.score);
    if (scored.length === 0) scored = allExercises;

    const count = decideCount(filters.duration);
    const workout = diversifyPick(scored, count, filters.muscles);

    setGeneratedWorkout(workout);
  };

  const generateWorkout = () => {
    setLoading(true);
    setGeneratedWorkout([]);
    setTimeout(() => {
      generateCore();
      setLoading(false);
    }, 900);
  };

  const randomize = () => {
    if (loading) return;
    setGeneratedWorkout([]);
    setLoading(true);
    setTimeout(() => {
      generateCore();
      setLoading(false);
    }, 500);
  };

  const copyAsJson = async () => {
    // why: brza razmena/planning izvan app-a
    const payload = {
      filters,
      workout: generatedWorkout,
      createdAt: new Date().toISOString(),
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      alert("Copied workout JSON to clipboard ✅");
    } catch {
      alert("Copy failed. You can manually select and copy.");
    }
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10"
        >
          🏋️ Workout Generator
        </motion.h2>

        {/* progress + stepper */}
        <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
          <motion.div
            className="h-3 bg-blue-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-6">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => goto(i)}
              className={cn(
                "transition",
                i === step ? "text-blue-600 font-bold" : "hover:text-gray-700"
              )}
              title={`Go to ${s}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* summary chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.goal && (
            <Chip tone="blue" onRemove={() => clearField("goal")}>
              🎯 {filters.goal}
            </Chip>
          )}
          {filters.level && (
            <Chip tone="green" onRemove={() => clearField("level")}>
              🏆 {filters.level}
            </Chip>
          )}
          {filters.location && (
            <Chip tone="purple" onRemove={() => clearField("location")}>
              📍 {filters.location}
            </Chip>
          )}
          {filters.duration && (
            <Chip tone="orange" onRemove={() => clearField("duration")}>
              ⏱ {filters.duration}
            </Chip>
          )}
          {filters.days && (
            <Chip tone="slate" onRemove={() => clearField("days")}>
              📅 {filters.days} days
            </Chip>
          )}
          {filters.equipment.length > 0 && (
            <Chip tone="slate" onRemove={() => clearField("equipment")}>
              🧰 {filters.equipment.length} equipment
            </Chip>
          )}
          {filters.muscles.length > 0 && (
            <Chip tone="slate" onRemove={() => clearField("muscles")}>
              💪 {filters.muscles.length} muscles
            </Chip>
          )}
        </div>

        {/* step content */}
        <Card>
          {step === 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" /> Choose your Goal
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {GOALS.map((opt) => (
                  <OptionButton
                    key={opt.key}
                    active={filters.goal === opt.key}
                    onClick={() => handleSelect("goal", opt.key)}
                  >
                    <opt.icon className="w-6 h-6 mx-auto mb-2" />
                    <span>{opt.label}</span>
                  </OptionButton>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Choose your Level</h3>
              <div className="grid grid-cols-3 gap-4">
                {LEVELS.map((lvl) => (
                  <OptionButton
                    key={lvl}
                    active={filters.level === lvl}
                    onClick={() => handleSelect("level", lvl)}
                  >
                    <span className="capitalize">{lvl}</span>
                  </OptionButton>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Where will you train?</h3>
              <div className="grid grid-cols-3 gap-4">
                {LOCATIONS.map((opt) => (
                  <OptionButton
                    key={opt.key}
                    active={filters.location === opt.key}
                    onClick={() => handleSelect("location", opt.key)}
                  >
                    <opt.icon className="w-6 h-6 mx-auto mb-2" />
                    <span>{opt.label}</span>
                  </OptionButton>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Choose Equipment</h3>
                <span className="text-xs text-gray-500">Optional</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {EQUIPMENT.map((eq) => {
                  const active = filters.equipment.includes(eq);
                  return (
                    <OptionButton
                      key={eq}
                      active={active}
                      onClick={() => handleMultiSelect("equipment", eq)}
                    >
                      <span className="capitalize">{eq}</span>
                      {active && (
                        <CheckCircle2 className="w-4 h-4 ml-2 inline" />
                      )}
                    </OptionButton>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Target Muscle Groups</h3>
                <span className="text-xs text-gray-500">Optional</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MUSCLES.map((m) => {
                  const active = filters.muscles.includes(m);
                  return (
                    <OptionButton
                      key={m}
                      active={active}
                      onClick={() => handleMultiSelect("muscles", m)}
                    >
                      <span className="capitalize">{m}</span>
                      {active && (
                        <CheckCircle2 className="w-4 h-4 ml-2 inline" />
                      )}
                    </OptionButton>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Workout Duration</h3>
              <div className="grid grid-cols-2 gap-4">
                {DURATIONS.map((d) => (
                  <OptionButton
                    key={d.key}
                    active={filters.duration === d.key}
                    onClick={() => handleSelect("duration", d.key)}
                  >
                    {d.label}
                  </OptionButton>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h3 className="text-lg font-bold mb-4">
                How many days per week?
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {DAY_OPTIONS.map((d) => (
                  <OptionButton
                    key={d}
                    active={filters.days === d}
                    onClick={() => handleSelect("days", d)}
                  >
                    {d} days
                  </OptionButton>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* nav */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prev}
            disabled={step === 0}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50"
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              disabled={!isStepValid(step)}
              className={cn(
                "px-6 py-2 rounded-lg text-white",
                isStepValid(step)
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed"
              )}
            >
              Next
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={generateWorkout}
                disabled={!allRequiredValid}
                className={cn(
                  "px-6 py-2 rounded-lg text-white",
                  allRequiredValid
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-green-400 cursor-not-allowed"
                )}
              >
                Generate Workout
              </button>
              <button
                onClick={randomize}
                disabled={loading || generatedWorkout.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-flex items-center gap-2 disabled:opacity-50"
                title="Randomize top matches"
              >
                <RefreshCcw className="w-4 h-4" /> Randomize
              </button>
              <button
                onClick={copyAsJson}
                disabled={generatedWorkout.length === 0}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg inline-flex items-center gap-2 disabled:opacity-50"
                title="Copy result as JSON"
              >
                <Clipboard className="w-4 h-4" /> Copy
              </button>
            </div>
          )}
        </div>

        {/* loader */}
        {loading && <Loader message={loadingMessage} />}

        {/* result */}
        {!loading && generatedWorkout.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {generatedWorkout.map((ex, i) => (
              <motion.div
                key={`${ex.name}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-left"
              >
                <p className="font-semibold text-lg">{ex.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {ex.sets} sets × {ex.reps} – Rest {ex.rest}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  {filters.goal && <Chip tone="blue">🎯 {filters.goal}</Chip>}
                  {filters.level && (
                    <Chip tone="green">🏆 {filters.level}</Chip>
                  )}
                  {filters.location && (
                    <Chip tone="purple">📍 {filters.location}</Chip>
                  )}
                  {filters.days && (
                    <Chip tone="orange">📅 {filters.days} days</Chip>
                  )}
                  {Array.isArray(ex.muscle_groups) &&
                    ex.muscle_groups.slice(0, 3).map((m) => (
                      <Chip key={m} tone="slate">
                        💪 {m}
                      </Chip>
                    ))}
                  {Array.isArray(ex.equipmentProgram) &&
                    ex.equipmentProgram.slice(0, 2).map((e) => (
                      <Chip key={e} tone="slate">
                        🧰 {e}
                      </Chip>
                    ))}
                </div>
                <div className="mt-3 text-[11px] text-gray-500">
                  <span className="opacity-70">Program:</span> {ex.program} •{" "}
                  <span className="opacity-70">Day:</span> {ex.day}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* empty state */}
        {!loading && generatedWorkout.length === 0 && (
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Configure filters and generate your workout.
          </p>
        )}
      </div>
    </section>
  );
}
