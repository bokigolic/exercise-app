// src/components/FitnessHub.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Ruler, Droplets, Dumbbell, Apple, Info, X } from "lucide-react";

/* ---------- Basic UI Components ---------- */
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl shadow-xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "" }) => {
  const base =
    "px-5 py-2.5 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-0 transition";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
      : "bg-white/5 text-slate-100 hover:bg-white/10 ring-1 ring-white/10";
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
};

/* ---------- Info Modal ---------- */
const InfoModal = ({ open, title, text, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {text}
          </p>
          <div className="mt-5 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ---------- Dropdown for Units ---------- */
const UnitSelect = ({ unit, setUnit, options }) => (
  <select
    value={unit}
    onChange={(e) => setUnit(e.target.value)}
    className="absolute right-2 top-2 bg-slate-800 text-slate-200 text-xs border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

/* ---------- Stat Component with Tooltip ---------- */
const Stat = ({ label, value, tooltip }) => (
  <div className="relative rounded-xl bg-white/5 p-4 ring-1 ring-white/10 group">
    <p className="text-sm text-slate-300 flex items-center gap-1">
      {label}
      {tooltip && (
        <span className="text-slate-400 cursor-help relative">
          <Info size={14} />
          <span className="absolute left-5 top-0 w-44 bg-slate-800 text-xs text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            {tooltip}
          </span>
        </span>
      )}
    </p>
    <p className="mt-1 text-2xl font-bold text-white">{value}</p>
  </div>
);

/* ---------- Tabs ---------- */
const TABS = [
  { id: "calories", label: "Calories", icon: <Flame size={18} /> },
  { id: "analysis", label: "Body Analysis", icon: <Ruler size={18} /> },
  { id: "nutrition", label: "Nutrition", icon: <Apple size={18} /> },
  { id: "hydration", label: "Hydration", icon: <Droplets size={18} /> },
  { id: "training", label: "Training", icon: <Dumbbell size={18} /> },
];

const TabBar = ({ active, onChange }) => (
  <div className="sticky top-4 z-30 -mt-2 mb-8 px-1">
    <div className="mx-auto max-w-6xl overflow-x-auto">
      <div className="inline-flex gap-2 rounded-2xl bg-white/10 backdrop-blur px-2 py-2 ring-1 ring-white/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition ${
              active === t.id ? "text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {t.icon}
              {t.label}
            </span>
            {active === t.id && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 rounded-xl -z-10 bg-blue-500/25"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ---------- Main Component ---------- */
export default function FitnessHub() {
  const [activeTab, setActiveTab] = useState("calories");
  const [modal, setModal] = useState({ open: false, title: "", text: "" });

  const openInfo = (title, text) => setModal({ open: true, title, text });
  const closeInfo = () => setModal({ open: false, title: "", text: "" });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-[calc(env(safe-area-inset-bottom)+24px)]">
      {/* Header */}
      <header className="pt-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
        >
          Gym Master Hub
        </motion.h1>

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 mx-auto max-w-md p-4 bg-white/5 rounded-2xl ring-1 ring-white/10 backdrop-blur-sm"
        >
          <p className="text-slate-300 text-sm sm:text-base">
            Track your daily energy & performance
          </p>
          <motion.div
            className="h-1.5 mt-3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500"
            animate={{ scaleX: [0.9, 1.1, 0.9] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </header>

      {/* Tabs */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* Info Modal */}
      <InfoModal
        open={modal.open}
        onClose={closeInfo}
        title={modal.title}
        text={modal.text}
      />

      {/* Placeholder for sections */}
      <motion.section
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === "calories" && <CaloriesTab onInfo={openInfo} />}
        {activeTab === "analysis" && <AnalysisTab onInfo={openInfo} />}
        {activeTab === "nutrition" && <NutritionTab onInfo={openInfo} />}
        {activeTab === "hydration" && <HydrationTab onInfo={openInfo} />}
        {activeTab === "training" && <TrainingTab onInfo={openInfo} />}
      </motion.section>
    </div>
  );
}

/* ---------- Calories Tab ---------- */
function CaloriesTab({ onInfo }) {
  const [gender, setGender] = useState("M");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [activity, setActivity] = useState("1.55");
  const [calories, setCalories] = useState(null);

  const convertToMetric = (w, h) =>
    unit === "imperial" ? { w: w * 0.453592, h: h * 2.54 } : { w, h };

  const isValid = Number(age) > 0 && Number(height) > 0 && Number(weight) > 0;

  const calculate = () => {
    if (!isValid) return;
    const { w, h } = convertToMetric(Number(weight), Number(height));
    const bmr =
      10 * w + 6.25 * h - 5 * Number(age) + (gender === "M" ? 5 : -161);
    const tdee = bmr * Number(activity);
    setCalories(Math.round(tdee));
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🔥 Calorie Calculator
        </h2>
        <UnitSelect
          unit={unit}
          setUnit={setUnit}
          options={[
            { value: "metric", label: "kg/cm" },
            { value: "imperial", label: "lbs/in" },
          ]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <input
          type="number"
          placeholder="Age"
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="number"
          placeholder={`Height (${unit === "metric" ? "cm" : "in"})`}
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <input
          type="number"
          placeholder={`Weight (${unit === "metric" ? "kg" : "lbs"})`}
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <select
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
        <select
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        >
          <option value="1.2">Sedentary</option>
          <option value="1.375">Lightly active</option>
          <option value="1.55">Moderate</option>
          <option value="1.725">Active</option>
          <option value="1.9">Very active</option>
        </select>
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={calculate} disabled={!isValid}>
          Calculate
        </Button>
        <Button variant="ghost" onClick={() => setCalories(null)}>
          Reset
        </Button>
      </div>

      {calories && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat
            label="Maintenance"
            value={`${calories} kcal`}
            tooltip="Estimated calories to maintain your current weight."
          />
          <Stat
            label="Cutting"
            value={`${calories - 500} kcal`}
            tooltip="Calorie target for gradual fat loss."
          />
          <Stat
            label="Bulking"
            value={`${calories + 300} kcal`}
            tooltip="Calorie target for lean muscle gain."
          />
        </div>
      )}
    </Card>
  );
}

/* ---------- Body Analysis Tab ---------- */
function AnalysisTab({ onInfo }) {
  const [gender, setGender] = useState("M");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [bmi, setBmi] = useState(null);

  const calcBMI = () => {
    if (!height || !weight) return;
    const h = unit === "imperial" ? height * 0.0254 : height / 100;
    const w = unit === "imperial" ? weight * 0.453592 : weight;
    setBmi((w / (h * h)).toFixed(1));
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          📊 Body Analysis
        </h2>
        <UnitSelect
          unit={unit}
          setUnit={setUnit}
          options={[
            { value: "metric", label: "kg/cm" },
            { value: "imperial", label: "lbs/in" },
          ]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <input
          type="number"
          placeholder={`Height (${unit === "metric" ? "cm" : "in"})`}
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <input
          type="number"
          placeholder={`Weight (${unit === "metric" ? "kg" : "lbs"})`}
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={calcBMI} disabled={!height || !weight}>
          Calculate
        </Button>
        <Button variant="ghost" onClick={() => setBmi(null)}>
          Reset
        </Button>
      </div>

      {bmi && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat
            label="BMI"
            value={bmi}
            tooltip="Body Mass Index – general indicator of body composition."
          />
          <Stat
            label="BMR"
            value="~1800 kcal"
            tooltip="Basal Metabolic Rate – energy burned at rest."
          />
          <Stat
            label="TDEE"
            value="~2500 kcal"
            tooltip="Total Daily Energy Expenditure based on activity."
          />
        </div>
      )}
    </Card>
  );
}

/* ---------- Nutrition Tab ---------- */
function NutritionTab() {
  const [goal, setGoal] = useState("balance");
  const [calories, setCalories] = useState("");
  const [macros, setMacros] = useState(null);

  const calcMacros = () => {
    const cals = Number(calories);
    if (!cals) return;
    const splits =
      goal === "cut"
        ? [0.35, 0.35, 0.3]
        : goal === "bulk"
        ? [0.25, 0.55, 0.2]
        : [0.3, 0.45, 0.25];
    setMacros({
      protein: ((cals * splits[0]) / 4).toFixed(0),
      carbs: ((cals * splits[1]) / 4).toFixed(0),
      fats: ((cals * splits[2]) / 9).toFixed(0),
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        🥗 Nutrition Planner
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <input
          type="number"
          placeholder="Calories"
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />
        <select
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        >
          <option value="balance">Balanced</option>
          <option value="cut">Cutting</option>
          <option value="bulk">Bulking</option>
        </select>
        <Button onClick={calcMacros}>Generate</Button>
      </div>

      {macros && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Protein" value={`${macros.protein} g`} />
          <Stat label="Carbs" value={`${macros.carbs} g`} />
          <Stat label="Fats" value={`${macros.fats} g`} />
        </div>
      )}
    </Card>
  );
}

/* ---------- Hydration Tab ---------- */
function HydrationTab() {
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const calc = () => {
    const liters = (Number(weight) * 0.035).toFixed(2);
    setResult(liters);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        💧 Hydration Tracker
      </h2>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <input
          type="number"
          placeholder="Weight (kg)"
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <Button onClick={calc}>Calculate</Button>
      </div>
      {result && (
        <div className="mt-6">
          <Stat
            label="Recommended Intake"
            value={`${result} L/day`}
            tooltip="General hydration target; increase with exercise or heat."
          />
        </div>
      )}
    </Card>
  );
}

/* ---------- Training Tab ---------- */
function TrainingTab() {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rm, setRm] = useState(null);

  const calc = () => {
    const val = Number(weight) * (1 + Number(reps) / 30);
    setRm(val.toFixed(0));
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">🏋️ Training Tools</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <input
          type="number"
          placeholder="Weight (kg)"
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="Reps"
          className="p-3 rounded-xl bg-white/5 text-white border border-white/10"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <Button onClick={calc}>Calculate</Button>
      </div>
      {rm && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Stat
            label="Estimated 1RM"
            value={`${rm} kg`}
            tooltip="Your one-rep max — approximate maximum weight you can lift once."
          />
          <Stat
            label="Training Tip"
            value="Train at 70–85% of 1RM"
            tooltip="Ideal range for hypertrophy and strength progress."
          />
        </div>
      )}
    </Card>
  );
}
