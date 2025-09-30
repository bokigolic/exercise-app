// src/components/FitnessHub.jsx
import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Ruler,
  Droplets,
  Dumbbell,
  HeartPulse,
  Apple,
  Moon,
} from "lucide-react";

/* ---------- UI Primitives (JSX, no TS types) ---------- */
const Card = ({ children, className = "" }) => (
  <div
    className={
      "bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 " +
      className
    }
  >
    {children}
  </div>
);

const SectionTitle = ({ title, emoji }) => (
  <div className="flex items-center gap-2 mb-6">
    {emoji ? <span className="text-2xl leading-none">{emoji}</span> : null}
    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
  </div>
);

const Field = ({ label, htmlFor, description, error, children }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-gray-800 dark:text-gray-200"
    >
      {label}
    </label>
    {children}
    {description && (
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    )}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const NumberField = ({ unit, id, ...rest }) => (
  <div className="relative">
    <input
      id={id}
      type="number"
      inputMode="decimal"
      className="w-full p-3 pr-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...rest}
    />
    {unit && (
      <span
        className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500 dark:text-gray-400 select-none"
        aria-hidden="true"
      >
        {unit}
      </span>
    )}
  </div>
);

const SelectField = ({ id, children, ...rest }) => (
  <select
    id={id}
    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...rest}
  >
    {children}
  </select>
);

const ActionBar = ({ children, className = "" }) => (
  <div className={"flex items-center gap-3 " + className}>{children}</div>
);

const Button = ({ variant = "primary", className = "", ...rest }) => {
  const base =
    "px-5 py-2.5 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
      : "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 focus:ring-gray-400";
  return <button className={`${base} ${styles} ${className}`} {...rest} />;
};

const ResetButton = (props) => (
  <Button {...props} variant="ghost" title="Reset" aria-label="Reset fields" />
);

const Stat = ({ label, value, hint }) => (
  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 ring-1 ring-black/5 dark:ring-white/10">
    <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
    <p className="mt-1 text-2xl font-bold">{value}</p>
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </div>
);

const Badge = ({ className = "", children }) => (
  <span
    className={
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold " +
      className
    }
  >
    {children}
  </span>
);

const BMIRangeBar = ({ value }) => {
  const min = 10,
    max = 40,
    b1 = 18.5,
    b2 = 25,
    b3 = 30;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const pct = (v) => ((v - min) / (max - min)) * 100;
  const pointerLeft = pct(clamp(Number(value), min, max));
  const bg = `linear-gradient(to right,
    rgba(59,130,246,0.25) 0% ${pct(b1)}%,
    rgba(34,197,94,0.25) ${pct(b1)}% ${pct(b2)}%,
    rgba(234,179,8,0.3) ${pct(b2)}% ${pct(b3)}%,
    rgba(239,68,68,0.3) ${pct(b3)}% 100%)`;
  return (
    <div className="w-full">
      <div
        className="relative h-4 w-full rounded-full"
        style={{ background: bg }}
        aria-label="BMI range bar"
      >
        <div className="absolute inset-0 rounded-full ring-1 ring-black/10 dark:ring-white/10 pointer-events-none" />
        <div
          className="absolute -top-1.5 h-7 w-0.5 bg-gray-900 dark:bg-gray-100 rounded-sm"
          style={{ left: `${pointerLeft}%`, transform: "translateX(-50%)" }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-gray-600 dark:text-gray-300">
        <span>10</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>
    </div>
  );
};

/* ---------- BMI Helpers ---------- */
function getBmiInfo(bmiNumber) {
  if (!Number.isFinite(bmiNumber)) {
    return {
      label: "-",
      tone: "gray",
      badgeClass:
        "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      advice: "",
    };
  }
  if (bmiNumber < 18.5) {
    return {
      label: "Underweight",
      tone: "blue",
      badgeClass:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
      advice: "Consider increasing calories and protein.",
    };
  }
  if (bmiNumber < 25) {
    return {
      label: "Normal",
      tone: "green",
      badgeClass:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
      advice: "Maintain habits and progressive training.",
    };
  }
  if (bmiNumber < 30) {
    return {
      label: "Overweight",
      tone: "yellow",
      badgeClass:
        "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200",
      advice: "Use a mild calorie deficit and increase NEAT.",
    };
  }
  return {
    label: "Obesity",
    tone: "red",
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
    advice: "Go into a deficit; prioritize movement and protein.",
  };
}

/* ---------- Tabs ---------- */
const TABS = [
  { id: "calories", label: "Calories", icon: <Flame size={18} /> },
  { id: "analysis", label: "Body Analysis", icon: <Ruler size={18} /> },
  { id: "nutrition", label: "Nutrition", icon: <Apple size={18} /> },
  { id: "hydration", label: "Hydration", icon: <Droplets size={18} /> },
  { id: "training", label: "Training", icon: <Dumbbell size={18} /> },
  { id: "lifestyle", label: "Lifestyle", icon: <Moon size={18} /> },
];

const TabBar = ({ active, onChange }) => {
  const listRef = useRef(null);
  const onKeyDown = (e, idx) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const last = TABS.length - 1;
    let next = idx;
    if (e.key === "ArrowRight") next = idx === last ? 0 : idx + 1;
    if (e.key === "ArrowLeft") next = idx === 0 ? last : idx - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    onChange(TABS[next].id);
    const btns = listRef.current?.querySelectorAll("button[role=tab]");
    btns?.[next]?.focus();
  };
  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Fitness sections"
      className="sticky top-4 z-30 -mt-2 mb-8 bg-transparent"
    >
      <div className="mx-auto max-w-6xl overflow-x-auto">
        <div className="inline-flex gap-2 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur px-2 py-2 ring-1 ring-black/10 dark:ring-white/10">
          {TABS.map((t, i) => {
            const selected = active === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                id={`tab-${t.id}`}
                onClick={() => onChange(t.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="relative px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <span className="inline-flex items-center gap-2">
                  {t.icon}
                  {t.label}
                </span>
                {selected && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{
                      boxShadow: "inset 0 0 0 1000px rgba(37,99,235,0.12)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------- Main ---------- */
export default function FitnessHub() {
  const [activeTab, setActiveTab] = useState("calories");
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-950 dark:via-gray-900 dark:to-black p-4 sm:p-6">
      <header className="mx-auto max-w-6xl">
        <Card className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white">
          <div className="px-4 sm:px-6 py-8 sm:py-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">
              🏋️ Ultimate Fitness Hub
            </h1>
            <p className="mt-2 opacity-90 text-sm sm:text-base">
              All-in-one: calories, body analysis, nutrition, hydration,
              training & lifestyle
            </p>
          </div>
        </Card>
      </header>

      <TabBar active={activeTab} onChange={setActiveTab} />

      <main className="mx-auto max-w-6xl">
        <motion.section
          key={activeTab}
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "calories" && <CaloriesTab />}
          {activeTab === "analysis" && <AnalysisTab />}
          {activeTab === "nutrition" && <NutritionTab />}
          {activeTab === "hydration" && <HydrationTab />}
          {activeTab === "training" && <TrainingTab />}
          {activeTab === "lifestyle" && <LifestyleTab />}
        </motion.section>
      </main>
    </div>
  );
}

/* ---------- Tabs Content (logic preserved) ---------- */

// 🔹 Calories
function CaloriesTab() {
  const [gender, setGender] = useState("M");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  // ⛔️ OVA LINIJA JE BILA BUG: "the" — UKLONJENA
  const [activity, setActivity] = useState("1.55");
  const [calories, setCalories] = useState(null);

  const isValid = useMemo(() => {
    const a = Number(age),
      h = Number(height),
      w = Number(weight);
    return (
      Number.isFinite(a) &&
      a > 0 &&
      Number.isFinite(h) &&
      h > 0 &&
      Number.isFinite(w) &&
      w > 0
    );
  }, [age, height, weight]);

  const calculate = () => {
    if (!isValid) return;
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age, 10);
    const bmr = 10 * w + 6.25 * h - 5 * a + (gender === "M" ? 5 : -161);
    const tdee = bmr * parseFloat(activity);
    setCalories(Math.round(tdee));
  };

  const reset = () => {
    setGender("M");
    setAge("");
    setHeight("");
    setWeight("");
    setActivity("1.55");
    setCalories(null);
  };

  const onKey = (e) => {
    if (e.key === "Enter" && isValid) calculate();
  };

  return (
    <Card className="p-6">
      <SectionTitle title="Calorie Calculator" emoji="🔥" />
      <div
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
        onKeyDown={onKey}
      >
        <Field
          label="Gender"
          htmlFor="cal-gender"
          description="Affects BMR baseline."
        >
          <SelectField
            id="cal-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </SelectField>
        </Field>
        <Field label="Age" htmlFor="cal-age">
          <NumberField
            id="cal-age"
            placeholder="e.g. 28"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min={1}
            step={1}
          />
        </Field>
        <Field label="Height" htmlFor="cal-height" description="Centimeters.">
          <NumberField
            id="cal-height"
            placeholder="e.g. 178"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min={1}
            step={0.1}
            unit="cm"
          />
        </Field>
        <Field label="Weight" htmlFor="cal-weight" description="Kilograms.">
          <NumberField
            id="cal-weight"
            placeholder="e.g. 75"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min={1}
            step={0.1}
            unit="kg"
          />
        </Field>
        <Field
          label="Activity Level"
          htmlFor="cal-activity"
          description="TDEE multiplier."
        >
          <SelectField
            id="cal-activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="1.2">Sedentary (1.2)</option>
            <option value="1.375">Lightly active (1.375)</option>
            <option value="1.55">Moderate (1.55)</option>
            <option value="1.725">Active (1.725)</option>
            <option value="1.9">Very active (1.9)</option>
          </SelectField>
        </Field>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={calculate} disabled={!isValid}>
          Calculate
        </Button>
        <ResetButton onClick={reset}>Reset</ResetButton>
      </div>

      {calories !== null && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Daily Maintenance" value={`${calories} kcal`} />
          <Stat label="Cutting (−500)" value={`${calories - 500} kcal`} />
          <Stat label="Bulking (+300)" value={`${calories + 300} kcal`} />
        </div>
      )}
    </Card>
  );
}

// 🔹 Body Analysis (BMI, BMR, TDEE, Body Fat)
function AnalysisTab() {
  const [gender, setGender] = useState("M");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [hips, setHips] = useState("");
  const [activity, setActivity] = useState("1.55");
  const [results, setResults] = useState(null);

  const baseValid = useMemo(() => {
    const a = Number(age),
      h = Number(height),
      w = Number(weight);
    return a > 0 && h > 0 && w > 0;
  }, [age, height, weight]);

  const bfValid = useMemo(() => {
    const has = (v) => Number(v) > 0;
    return gender === "M"
      ? has(waist) && has(neck)
      : has(waist) && has(neck) && has(hips);
  }, [gender, waist, neck, hips]);

  const calculate = () => {
    if (!baseValid) return;
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age, 10);
    const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
    const bmr = 10 * w + 6.25 * h - 5 * a + (gender === "M" ? 5 : -161);
    const tdee = bmr * parseFloat(activity);
    let bf = null;
    if (bfValid) {
      if (gender === "M") {
        bf =
          495 /
            (1.0324 -
              0.19077 * Math.log10(parseFloat(waist) - parseFloat(neck)) +
              0.15456 * Math.log10(h)) -
          450;
      } else {
        bf =
          495 /
            (1.29579 -
              0.35004 *
                Math.log10(
                  parseFloat(waist) + parseFloat(hips) - parseFloat(neck)
                ) +
              0.221 * Math.log10(h)) -
          450;
      }
    }
    setResults({
      bmi,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      bf: bf !== null ? bf.toFixed(1) : null,
    });
  };

  const reset = () => {
    setGender("M");
    setAge("");
    setHeight("");
    setWeight("");
    setWaist("");
    setNeck("");
    setHips("");
    setActivity("1.55");
    setResults(null);
  };

  const bmiNumber = results ? Number(results.bmi) : null;
  const bmiInfo = results ? getBmiInfo(bmiNumber) : null;

  return (
    <Card className="p-6">
      <SectionTitle title="Body Analysis" emoji="📊" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Field label="Gender" htmlFor="an-gender">
          <SelectField
            id="an-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </SelectField>
        </Field>
        <Field label="Age" htmlFor="an-age">
          <NumberField
            id="an-age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min={1}
            step={1}
          />
        </Field>
        <Field label="Height" htmlFor="an-height" description="Centimeters.">
          <NumberField
            id="an-height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min={1}
            step={0.1}
            unit="cm"
          />
        </Field>
        <Field label="Weight" htmlFor="an-weight" description="Kilograms.">
          <NumberField
            id="an-weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min={1}
            step={0.1}
            unit="kg"
          />
        </Field>
        <Field label="Waist" htmlFor="an-waist" description="Centimeters.">
          <NumberField
            id="an-waist"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            min={1}
            step={0.1}
            unit="cm"
          />
        </Field>
        <Field label="Neck" htmlFor="an-neck" description="Centimeters.">
          <NumberField
            id="an-neck"
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            min={1}
            step={0.1}
            unit="cm"
          />
        </Field>
        {gender === "F" && (
          <Field label="Hips" htmlFor="an-hips" description="Centimeters.">
            <NumberField
              id="an-hips"
              value={hips}
              onChange={(e) => setHips(e.target.value)}
              min={1}
              step={0.1}
              unit="cm"
            />
          </Field>
        )}
        <Field label="Activity Level" htmlFor="an-activity">
          <SelectField
            id="an-activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="1.2">Sedentary (1.2)</option>
            <option value="1.375">Lightly active (1.375)</option>
            <option value="1.55">Moderate (1.55)</option>
            <option value="1.725">Active (1.725)</option>
            <option value="1.9">Very active (1.9)</option>
          </SelectField>
        </Field>
      </div>

      <ActionBar className="mt-6">
        <Button onClick={calculate} disabled={!baseValid}>
          Calculate
        </Button>
        <ResetButton onClick={reset}>Reset</ResetButton>
      </ActionBar>

      {results && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="BMI" value={results.bmi} />
            <Stat label="BMR" value={`${results.bmr} kcal/day`} />
            <Stat label="TDEE" value={`${results.tdee} kcal/day`} />
            {results.bf && <Stat label="Body Fat %" value={`${results.bf}%`} />}
          </div>

          <div className="mt-6 rounded-xl p-4 bg-gray-50 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  BMI status:
                </span>
                <Badge className={bmiInfo.badgeClass}>{bmiInfo.label}</Badge>
              </div>
              <span className="text-xs text-gray-500">
                Thresholds: 18.5 / 25 / 30
              </span>
            </div>
            <BMIRangeBar value={Number(results.bmi)} />
            {bmiInfo.advice && (
              <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">
                {bmiInfo.advice}
              </p>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

// 🔹 Nutrition (Macro Split)
function NutritionTab() {
  const [calories, setCalories] = useState("");
  const [goal, setGoal] = useState("balance");
  const [macros, setMacros] = useState(null);
  const isValid = Number(calories) > 0;

  const calculate = () => {
    if (!isValid) return;
    const cals = Number(calories);
    let proteinPerc, carbPerc, fatPerc;
    if (goal === "cut") {
      proteinPerc = 0.35;
      carbPerc = 0.35;
      fatPerc = 0.3;
    } else if (goal === "bulk") {
      proteinPerc = 0.25;
      carbPerc = 0.55;
      fatPerc = 0.2;
    } else {
      proteinPerc = 0.3;
      carbPerc = 0.45;
      fatPerc = 0.25;
    }
    const p = ((cals * proteinPerc) / 4).toFixed(0);
    const c = ((cals * carbPerc) / 4).toFixed(0);
    const f = ((cals * fatPerc) / 9).toFixed(0);
    setMacros({ protein: p, carbs: c, fats: f });
  };

  const reset = () => {
    setCalories("");
    setGoal("balance");
    setMacros(null);
  };

  return (
    <Card className="p-6">
      <SectionTitle title="Macro Calculator" emoji="🍎" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Calories" htmlFor="nu-cal">
          <NumberField
            id="nu-cal"
            placeholder="e.g. 2500"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            min={1}
            step={1}
            unit="kcal"
          />
        </Field>
        <Field
          label="Goal"
          htmlFor="nu-goal"
          description="Adjusts macro split."
        >
          <SelectField
            id="nu-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="balance">Balanced</option>
            <option value="cut">Cutting</option>
            <option value="bulk">Bulking</option>
          </SelectField>
        </Field>
        <div className="flex items-end">
          <Button onClick={calculate} disabled={!isValid} className="w-full">
            Calculate
          </Button>
        </div>
      </div>

      {macros && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Protein" value={`${macros.protein} g`} />
          <Stat label="Carbs" value={`${macros.carbs} g`} />
          <Stat label="Fats" value={`${macros.fats} g`} />
        </div>
      )}

      <p className="mt-6 text-xs text-gray-600 dark:text-gray-400">
        Daily vitamins & minerals suggestions — coming soon.
      </p>
      <ActionBar className="mt-4">
        <ResetButton onClick={reset}>Reset</ResetButton>
      </ActionBar>
    </Card>
  );
}

// 🔹 Hydration
function HydrationTab() {
  const [weight, setWeight] = useState("");
  const [water, setWater] = useState(null);
  const isValid = Number(weight) > 0;

  const calcWater = () => {
    if (!isValid) return;
    const liters = (parseFloat(weight) * 0.035).toFixed(2);
    setWater(liters);
  };
  const reset = () => {
    setWeight("");
    setWater(null);
  };

  return (
    <Card className="p-6">
      <SectionTitle title="Hydration Calculator" emoji="💧" />
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <Field label="Weight" htmlFor="hy-weight" description="Kilograms.">
          <NumberField
            id="hy-weight"
            placeholder="e.g. 75"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min={1}
            step={0.1}
            unit="kg"
          />
        </Field>
        <div className="flex items-end gap-2">
          <Button onClick={calcWater} disabled={!isValid}>
            Calculate
          </Button>
          <ResetButton onClick={reset}>Reset</ResetButton>
        </div>
      </div>

      {water && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Stat label="Recommended Intake" value={`${water} L / day`} />
          <Stat
            label="Reminder"
            value="Split across the day"
            hint="Start with a glass on wake-up and around workouts."
          />
        </div>
      )}
    </Card>
  );
}

// 🔹 Training (1RM + stub)
function TrainingTab() {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [oneRm, setOneRm] = useState(null);
  const isValid = Number(weight) > 0 && Number(reps) > 0;

  const calc1RM = () => {
    if (!isValid) return;
    const w = Number(weight),
      r = Number(reps);
    const rm = w * (1 + r / 30);
    setOneRm(rm.toFixed(0));
  };
  const reset = () => {
    setWeight("");
    setReps("");
    setOneRm(null);
  };
  const onKey = (e) => {
    if (e.key === "Enter" && isValid) calc1RM();
  };

  return (
    <Card className="p-6">
      <SectionTitle title="Training Tools" emoji="🏋️" />
      <div onKeyDown={onKey}>
        <h3 className="text-lg font-semibold mb-3 inline-flex items-center gap-2">
          <HeartPulse className="opacity-70" /> 1RM Calculator
        </h3>
        <div className="grid gap-4 sm:grid-cols-3 mb-4">
          <Field
            label="Weight"
            htmlFor="tr-weight"
            description="Kilograms lifted."
          >
            <NumberField
              id="tr-weight"
              placeholder="e.g. 100"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min={1}
              step={0.5}
              unit="kg"
            />
          </Field>
          <Field label="Reps" htmlFor="tr-reps">
            <NumberField
              id="tr-reps"
              placeholder="e.g. 5"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              min={1}
              step={1}
            />
          </Field>
          <div className="flex items-end gap-2">
            <Button onClick={calc1RM} disabled={!isValid} className="w-full">
              Calculate
            </Button>
            <ResetButton onClick={reset}>Reset</ResetButton>
          </div>
        </div>
        {oneRm && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <Stat label="Estimated 1RM" value={`${oneRm} kg`} />
            <Stat
              label="Tip"
              value="Train @ 70–85% of 1RM"
              hint="Adjust volume with experience and recovery."
            />
          </div>
        )}

        <h3 className="text-lg font-semibold mb-2">💓 Cardio Zones</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Calculate HR zones by age, VO₂ max estimator — coming soon.
        </p>
      </div>
    </Card>
  );
}

// 🔹 Lifestyle
function LifestyleTab() {
  return (
    <Card className="p-6">
      <SectionTitle title="Lifestyle & Wellness" emoji="🧘" />
      <p className="text-gray-700 dark:text-gray-300">
        Sleep calculator, stress tracker, step counter, posture analysis,
        wellness tips — optimize your health beyond just training.
      </p>
    </Card>
  );
}
