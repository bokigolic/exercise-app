// src/components/WorkoutGenerator.jsx
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Flame,
  Target,
  Clock,
  Home as HomeIcon,
  Activity,
  RefreshCcw,
  Clipboard,
  X,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import programsData from "../data/programs.json";

/* ---------- small utils ---------- */
const cn = (...c) => c.filter(Boolean).join(" ");
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleBySeed = (arr) => {
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
  { key: "home", label: "Home", icon: HomeIcon },
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

/* ---------- shared UI ---------- */
const PageShell = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-100">
    <header className="sticky top-0 z-30 bg-black/40 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          {/* simple logo */}
          <div className="h-7 w-7 rounded-xl bg-white/10 ring-1 ring-white/15 grid place-items-center">
            <Dumbbell className="w-4 h-4 text-white/90" />
          </div>
        </Link>
        <nav className="hidden sm:flex items-center gap-4 text-sm">
          <Link to="/" className="text-slate-300 hover:text-white">
            Home
          </Link>
          <Link to="/exercises" className="text-slate-300 hover:text-white">
            Exercises
          </Link>
          <Link to="/generator" className="text-white font-semibold">
            Generator
          </Link>
          <Link to="/about" className="text-slate-300 hover:text-white">
            About
          </Link>
        </nav>
      </div>
    </header>
    {children}
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400">
        © {new Date().getFullYear()} GymMaster • Built for clarity & consistency
      </div>
    </footer>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div
    className={cn(
      "rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
      "backdrop-blur p-6",
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
      "relative group p-4 rounded-xl text-sm transition",
      "ring-1",
      active
        ? "bg-blue-600 text-white ring-blue-700"
        : "bg-white/5 text-slate-200 ring-white/10 hover:bg-white/10 hover:ring-white/20"
    )}
  >
    {/* hover glow */}
    <span
      className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition"
      style={{
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.25)",
      }}
    />
    {children}
  </button>
);

const Chip = ({ children, onRemove, tone = "slate" }) => {
  const tones = {
    blue: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
    green: "bg-green-500/15 text-green-300 ring-green-500/30",
    purple: "bg-purple-500/15 text-purple-300 ring-purple-500/30",
    orange: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
    slate: "bg-white/5 text-slate-200 ring-white/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ring-1",
        tones[tone]
      )}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 rounded p-0.5 hover:bg-white/10"
          title="Remove"
          aria-label="Remove filter"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};

const Loader = ({ message }) => (
  <div className="mt-10 flex flex-col items-center gap-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-white/10" />
      <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
    </div>
    <p className="text-slate-300">{message}</p>
  </div>
);

/* ---------- generator helpers (logika ostaje: score + sort + slice) ---------- */
const decideCount = (duration) => (duration === "long" ? 9 : 6);
const normalizeArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const scoreExercise = (ex, filters) => {
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
    score += Math.min(matches, 2) * 2;
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
    if (overCap && picked.length < targetCount - 2) continue;

    picked.push(ex);
    nameSet.add(ex.name);
    mgs.forEach((m) => muscleCount.set(m, (muscleCount.get(m) || 0) + 1));
  }

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

  const StepTitle = ({ icon: Icon, title }) => (
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-blue-400" />} {title}
    </h3>
  );

  return (
    <PageShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-8"
        >
          🏋️ Workout Generator
        </motion.h2>

        {/* progress + stepper */}
        <div className="mb-3">
          <div className="relative w-full h-2 bg-white/5 rounded-full">
            <motion.div
              className="h-2 bg-blue-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="mt-3 grid grid-cols-7 text-[11px] text-slate-400">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => goto(i)}
                className={cn(
                  "text-left truncate px-1 transition",
                  i === step
                    ? "text-white font-semibold"
                    : "hover:text-slate-200"
                )}
                title={`Go to ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
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
              <StepTitle icon={Target} title="Choose your Goal" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {GOALS.map((opt) => (
                  <OptionButton
                    key={opt.key}
                    active={filters.goal === opt.key}
                    onClick={() => handleSelect("goal", opt.key)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <opt.icon className="w-6 h-6 mb-1 text-white/90" />
                      <span>{opt.label}</span>
                    </div>
                  </OptionButton>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <StepTitle title="Choose your Level" />
              <div className="grid grid-cols-3 gap-3">
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
              <StepTitle title="Where will you train?" />
              <div className="grid grid-cols-3 gap-3">
                {LOCATIONS.map((opt) => (
                  <OptionButton
                    key={opt.key}
                    active={filters.location === opt.key}
                    onClick={() => handleSelect("location", opt.key)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <opt.icon className="w-6 h-6 mb-1 text-white/90" />
                      <span>{opt.label}</span>
                    </div>
                  </OptionButton>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Choose Equipment</h3>
                <span className="text-xs text-slate-400">Optional</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {EQUIPMENT.map((eq) => {
                  const active = filters.equipment.includes(eq);
                  return (
                    <OptionButton
                      key={eq}
                      active={active}
                      onClick={() => handleMultiSelect("equipment", eq)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="capitalize">{eq}</span>
                        {active && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
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
                <span className="text-xs text-slate-400">Optional</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {MUSCLES.map((m) => {
                  const active = filters.muscles.includes(m);
                  return (
                    <OptionButton
                      key={m}
                      active={active}
                      onClick={() => handleMultiSelect("muscles", m)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="capitalize">{m}</span>
                        {active && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                    </OptionButton>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <StepTitle title="Workout Duration" />
              <div className="grid grid-cols-2 gap-3">
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
              <StepTitle title="How many days per week?" />
              <div className="grid grid-cols-3 gap-3">
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
            className="px-4 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 text-slate-200 hover:bg-white/10 disabled:opacity-50"
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
                  : "bg-blue-600/50 cursor-not-allowed"
              )}
            >
              Next
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={generateWorkout}
                disabled={!allRequiredValid}
                className={cn(
                  "px-6 py-2 rounded-lg text-white",
                  allRequiredValid
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-emerald-600/50 cursor-not-allowed"
                )}
              >
                Generate Workout
              </button>
              <button
                onClick={randomize}
                disabled={loading || generatedWorkout.length === 0}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white inline-flex items-center gap-2 disabled:opacity-50"
                title="Randomize top matches"
              >
                <RefreshCcw className="w-4 h-4" /> Randomize
              </button>
              <button
                onClick={copyAsJson}
                disabled={generatedWorkout.length === 0}
                className="px-4 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 text-slate-200 inline-flex items-center gap-2 disabled:opacity-50"
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
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {generatedWorkout.map((ex, i) => (
              <motion.div
                key={`${ex.name}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl bg-white/5 ring-1 ring-white/10 p-5"
              >
                <p className="font-semibold text-lg text-white">{ex.name}</p>
                <p className="text-sm text-slate-300 mt-0.5">
                  {ex.sets} sets × {ex.reps} — Rest {ex.rest}
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
                <div className="mt-3 text-[11px] text-slate-400">
                  <span className="opacity-70">Program:</span> {ex.program} •{" "}
                  <span className="opacity-70">Day:</span> {ex.day}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* empty state */}
        {!loading && generatedWorkout.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-400">
            Configure filters and generate your workout.
          </p>
        )}
      </main>
    </PageShell>
  );
}
