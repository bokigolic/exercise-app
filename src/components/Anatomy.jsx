// src/components/Anatomy.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ===== Utils ===== */
const cn = (...c) => c.filter(Boolean).join(" ");
const stop = (e) => e.stopPropagation();
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const words = (s) =>
  (Array.isArray(s) ? s.join(" ") : s || "").split(/\s+/).filter(Boolean)
    .length;
const estimateReadMin = (textWords, wpm = 220) =>
  Math.max(1, Math.round(textWords / wpm));

/* ===== Icons (inline, no deps) ===== */
const icons = {
  book: (p) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15h-9.5A2.5 2.5 0 0 0 8 21.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M8 3.5v15" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  layers: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M12 3 3 8l9 5 9-5-9-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  tune: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M4 6h10M4 12h16M4 18h8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="16" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  dumbbell: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M2 9v6M6 7v10M10 11v2M14 11v2M18 7v10M22 9v6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M6 11h12v2H6z" fill="currentColor" />
    </svg>
  ),
  moon: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M21 12.8A8.5 8.5 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  bolt: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M13 2 3 13h7l-1 9 11-13h-7V2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M12 21s-7-4.4-9.5-7.9C.6 10.9 2 6.5 6 6.5c2.3 0 3.6 1.2 4 2.3.4-1.1 1.7-2.3 4-2.3 4 0 5.4 4.4 3.5 6.6C19 16.6 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M16 14a4 4 0 1 1 7 0" stroke="currentColor" strokeWidth="1.6" />
      <path d="M1 14a4 4 0 1 1 7 0" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 20a8.5 8.5 0 0 1 17 0"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="m12 3 2.9 6 6.6.9-4.8 4.5 1.2 6.6L12 18.7 6.1 21l1.2-6.6L2.5 9.9l6.6-.9L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M20 7 10 17l-6-6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  link: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M10 14a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-1 1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14 10a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7-7l1-1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  starFill: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M12 3l2.9 6 6.6.9-4.8 4.5 1.2 6.6L12 18.7 6.1 21l1.2-6.6L2.5 9.9l6.6-.9L12 3z"
        fill="currentColor"
      />
    </svg>
  ),
};

/* ===== Content (EN) ===== */
const SECTIONS = [
  {
    id: "intro",
    icon: "book",
    title: "Introduction to Muscles",
    preview: "Muscles power movement and protect long-term health.",
    tags: ["basics", "health"],
    body: [
      "Skeletal muscles make up ~30–40% of body mass and enable movement, joint stability, breathing, and circulation. Beyond strength and physique, muscle supports metabolic health — more lean mass often correlates with better glucose regulation and higher resting energy expenditure.",
      "Muscle is living tissue that adapts to training, nutrition, and rest. With the right plan, anyone can improve strength, physique, and performance from any starting point.",
    ],
    quiz: [
      {
        q: "Muscles adapt primarily to…",
        a: ["Training, nutrition, rest", "Luck", "Stretching only"],
        c: 0,
      },
      {
        q: "Estimated share of body weight from muscle is…",
        a: ["5–10%", "30–40%", "60–70%"],
        c: 1,
      },
      {
        q: "Without muscles we could not…",
        a: ["Regulate heart rate", "Perform any movement", "Digest food"],
        c: 1,
      },
    ],
  },
  {
    id: "types",
    icon: "layers",
    title: "Types of Muscles",
    preview: "Three main types: skeletal, cardiac, smooth.",
    tags: ["basics", "physiology"],
    body: [
      "Skeletal (striated) muscle is voluntary and attaches to the skeleton — it drives posture and movement. Cardiac muscle is unique to the heart, involuntary, and works 24/7. Smooth muscle lines organs and blood vessels — it regulates digestion and blood flow.",
      "For training we mostly care about skeletal muscle and how it adapts to mechanical tension.",
    ],
    bullets: [
      "Skeletal — posture & movement (voluntary).",
      "Cardiac — heart (involuntary, rhythmic).",
      "Smooth — organs/vessels (involuntary).",
    ],
    quiz: [
      { q: "Which is voluntary?", a: ["Smooth", "Skeletal", "Cardiac"], c: 1 },
      { q: "Cardiac muscle is found in…", a: ["Arms", "Legs", "Heart"], c: 2 },
      {
        q: "Smooth muscles regulate…",
        a: ["Joint angles", "Digestion & blood flow", "Lung volume"],
        c: 1,
      },
    ],
  },
  {
    id: "structure",
    icon: "tune",
    title: "Muscle Structure",
    preview: "Fibers, sarcomeres, actin & myosin create contractions.",
    tags: ["physiology", "structure"],
    body: [
      "A muscle fiber contains myofibrils made of repeating sarcomeres — the smallest contractile units. During contraction, actin and myosin slide over one another (sliding filament theory) using ATP.",
      "A nerve impulse at the neuromuscular junction (NMJ) initiates contraction. Connective sheaths (endo-/peri-/epimysium) protect tissue and transmit force, while tendons deliver that force to bone.",
    ],
    bullets: [
      "Sarcomere = basic unit of force.",
      "Actin & myosin = sliding filaments.",
      "NMJ = nerve impulse → contraction.",
      "Sheaths + tendons = force transmission.",
    ],
    quiz: [
      {
        q: "Basic contractile unit is the…",
        a: ["Myofibril", "Sarcomere", "Motor neuron"],
        c: 1,
      },
      {
        q: "Proteins that slide are…",
        a: ["Actin & myosin", "Myelin & collagen", "ATP & creatine"],
        c: 0,
      },
      {
        q: "Which wraps bundles of fibers?",
        a: ["Perimysium", "Endomysium", "Epimysium"],
        c: 0,
      },
    ],
  },
  {
    id: "hypertrophy",
    icon: "dumbbell",
    title: "How Muscles Grow (Hypertrophy)",
    preview: "Training + nutrition + rest = growth.",
    tags: ["training", "growth"],
    body: [
      "Hypertrophy occurs when micro-damage from training triggers protein synthesis. Progressive overload is key: more reps, more load, slower tempo, or slightly shorter rest — but dosed so recovery keeps up.",
      "Clean technique and controlled eccentrics increase stimulus. Protein, sleep, and sensible periodization (including deloads) complete the growth loop.",
    ],
    bullets: [
      "Progress with reps, load, tempo, or rest.",
      "Technique > ego; full ROM and control.",
      "Consider a deload every 6–8 weeks at higher volumes.",
    ],
    quiz: [
      {
        q: "Key driver of hypertrophy?",
        a: ["Progressive overload", "Static stretching", "Low water intake"],
        c: 0,
      },
      {
        q: "Repairs occur during…",
        a: ["Training", "Recovery", "Warm-up"],
        c: 1,
      },
      {
        q: "Main building block for repair?",
        a: ["Protein", "Caffeine", "Vitamin C"],
        c: 0,
      },
    ],
  },
  {
    id: "atrophy",
    icon: "moon",
    title: "Muscle Loss (Atrophy & Sarcopenia)",
    preview: "Inactivity and aging shrink muscles.",
    tags: ["health", "aging"],
    body: [
      "Atrophy can occur quickly with inactivity; sarcopenia accelerates with age. The result: weakness, poorer posture, and slower metabolism.",
      "Prevention: 2–3+ weekly strength sessions, protein intake around 1.6–2.2 g/kg/day, sufficient sleep, and daily NEAT (steps).",
    ],
    bullets: [
      "Risks: sedentary work, stress, sleep debt.",
      "Fix: compound lifts, walking, sleep routine.",
    ],
    quiz: [
      {
        q: "Sarcopenia typically begins around…",
        a: ["Age 10", "Age 30", "Age 70"],
        c: 1,
      },
      {
        q: "Best prevention includes…",
        a: ["Endless cardio", "Strength training + protein", "No exercise"],
        c: 1,
      },
      {
        q: "Atrophy is caused by…",
        a: ["Inactivity", "Vitamin C", "Low salt"],
        c: 0,
      },
    ],
  },
  {
    id: "fuel",
    icon: "bolt",
    title: "Fuel for Muscles",
    preview: "ATP, glycogen, fat, creatine.",
    tags: ["energy", "physiology"],
    body: [
      "The body uses multiple energy systems: ATP-CP for short explosive efforts (sprints, 1–3 reps), glycolytic for moderate duration/high intensity, and oxidative (fat) for longer work and rest.",
      "Creatine monohydrate (3–5 g/day) safely raises phosphocreatine stores and performance in short bursts.",
    ],
    bullets: [
      "ATP: immediate energy.",
      "CP: 1–10 s power bursts.",
      "Glycogen: high-intensity fuel.",
      "Fatty acids: dominant at rest/long duration.",
    ],
    quiz: [
      {
        q: "Immediate energy currency?",
        a: ["Glycogen", "ATP", "Fatty acids"],
        c: 1,
      },
      {
        q: "Short power bursts rely on…",
        a: ["Creatine phosphate", "Fiber", "Vitamin E"],
        c: 0,
      },
      {
        q: "At rest the body prefers…",
        a: ["Protein", "Fatty acids", "Glycogen"],
        c: 1,
      },
    ],
  },
  {
    id: "nutrition",
    icon: "heart",
    title: "Nutrition & Muscles",
    preview: "Protein, carbs, fats, hydration, vitamins.",
    tags: ["nutrition", "health"],
    body: [
      "Protein: for active individuals aim for ~1.6–2.2 g/kg/day, spread across 3–5 meals (20–40 g each). Carbohydrates fuel training and refill glycogen, especially around workouts.",
      "Fats (roughly 20–35% of calories) support hormones and fat-soluble vitamin absorption. Hydration is foundational — muscle tissue is ~75% water.",
    ],
    bullets: [
      "Sleep + fiber + micronutrients (D, Ca, Mg, Fe) matter.",
      "Time carbs: pre for energy, post for recovery.",
    ],
    quiz: [
      {
        q: "Suggested protein for active people?",
        a: ["0.5 g/kg", "1.6–2.2 g/kg", "4 g/kg"],
        c: 1,
      },
      {
        q: "Carbs primarily replenish…",
        a: ["ATP directly", "Glycogen", "Electrolytes"],
        c: 1,
      },
      {
        q: "Hydration matters because muscles are ~… water.",
        a: ["25%", "50%", "75%"],
        c: 2,
      },
    ],
  },
  {
    id: "recovery",
    icon: "clock",
    title: "Recovery & Sleep",
    preview: "Muscles grow outside the gym.",
    tags: ["recovery", "health"],
    body: [
      "Most adaptation happens outside the gym. Sleep (7–9 h) supports growth hormone release and tissue repair. Active recovery (walking, mobility, light stretching) improves blood flow.",
      "Manage volume and include deloads to avoid overreaching — 90% adherence for months beats 110% for one month.",
    ],
    bullets: [
      "Sleep 7–9 h; keep a consistent bedtime.",
      "Daily NEAT/steps.",
      "Deload week every 6–8 at higher volumes.",
    ],
    quiz: [
      {
        q: "Most growth occurs during…",
        a: ["Training", "Recovery", "Warm-up"],
        c: 1,
      },
      {
        q: "Recommended sleep for adults?",
        a: ["3–4 h", "5–6 h", "7–9 h"],
        c: 2,
      },
      {
        q: "Active recovery can include…",
        a: ["Sprinting", "Yoga/walking", "Max testing"],
        c: 1,
      },
    ],
  },
  {
    id: "training",
    icon: "dumbbell",
    title: "Training Variables",
    preview: "Intensity, volume, frequency, variation.",
    tags: ["training"],
    body: [
      "Core variables: intensity (as %1RM), volume (sets × reps), frequency (how often you train a muscle), and variation (planned changes to avoid plateaus).",
      "Practical heuristics: many lifters grow well in the 8–15 rep range, with ~3–5 working sets per muscle per session, and ~10–20 weekly sets per muscle — adjust by experience and recovery.",
    ],
    bullets: [
      "Use RPE or %1RM to dose load.",
      "Track working sets and progression.",
      "Base your week on squat, hinge, push, pull, carry.",
    ],
    quiz: [
      {
        q: "Volume equals…",
        a: ["Sets × reps", "Reps ÷ load", "Time × distance"],
        c: 0,
      },
      {
        q: "To avoid plateaus use…",
        a: ["Variation", "No warm-up", "Random diet"],
        c: 0,
      },
      { q: "Results require…", a: ["Days", "Weeks", "Months/years"], c: 2 },
    ],
  },
  {
    id: "lifespan",
    icon: "users",
    title: "Muscles Across the Lifespan",
    preview: "From youth development to healthy aging.",
    tags: ["aging", "health"],
    body: [
      "In childhood and adolescence, activity and sport drive development. The 20s are often peak potential. Without training, mass and strength decline through the 30s–40s; after 50 the decline accelerates.",
      "Good news: in your 60s, 70s, and beyond, strength and mobility can still improve substantially with consistent resistance training and adequate protein.",
    ],
    bullets: [
      "20s: learn technique and build a base.",
      "30–40s: maintain & respect recovery.",
      "50+: prioritize strength, balance, gait.",
    ],
    quiz: [
      { q: "Peak muscle potential is in the…", a: ["20s", "40s", "60s"], c: 0 },
      {
        q: "Training for 70+ mainly preserves…",
        a: ["Mobility & independence", "Hair growth", "Height"],
        c: 0,
      },
      { q: "Decline accelerates after…", a: ["30", "50", "80"], c: 1 },
    ],
  },
  {
    id: "fun",
    icon: "star",
    title: "Fun Facts",
    preview: "600+ muscles coordinate daily life.",
    tags: ["fun"],
    body: [
      "Gluteus maximus is the largest muscle; the masseter (jaw) is extremely strong relative to its size. Dozens of muscles fire even when you simply stand still.",
      "Muscles are elastic and adaptive — habits beat perfect plans.",
    ],
    bullets: [
      "Gluteus maximus: largest.",
      "Masseter: pound-for-pound strength champ.",
      "600+ muscles work every day.",
    ],
    quiz: [
      {
        q: "Largest muscle is…",
        a: ["Quadriceps", "Gluteus maximus", "Latissimus dorsi"],
        c: 1,
      },
      {
        q: "Strongest relative to size…",
        a: ["Masseter", "Triceps", "Calves"],
        c: 0,
      },
      {
        q: "Standing still uses…",
        a: ["Few muscles", "Hundreds of muscles", "Only legs"],
        c: 1,
      },
    ],
  },
  {
    id: "takeaways",
    icon: "check",
    title: "Key Takeaways",
    preview: "Use it or lose it — muscles adapt to lifestyle.",
    tags: ["summary"],
    body: [
      "Progress is a product of consistency. Build your week around fundamentals, track progression, eat enough protein, and sleep. Don’t chase perfect — chase repeatable.",
      "A great program is the one you can follow for months. Log sessions and celebrate small wins.",
    ],
    bullets: [
      "Training + nutrition + recovery = results.",
      "Technique and safety always come first.",
      "Consistency > perfect plan.",
    ],
    quiz: [
      {
        q: "“Use it or lose it” means…",
        a: ["Ignore training", "Muscles adapt to use", "Stretch only"],
        c: 1,
      },
      {
        q: "Progress depends on…",
        a: ["Consistency", "Randomness", "Luck"],
        c: 0,
      },
      {
        q: "Key trio is…",
        a: [
          "Training, nutrition, recovery",
          "Supps, luck, vibes",
          "Cardio only",
        ],
        c: 0,
      },
    ],
  },
];

/* ===== Toast ===== */
function Toast({ text, onDone }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] rounded-xl bg-black/80 text-white text-sm px-3 py-2 shadow-lg"
          onAnimationComplete={() => setTimeout(onDone, 1600)}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ===== Chips ===== */
function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-full text-xs ring-1 transition",
        active
          ? "bg-blue-600 text-white ring-blue-700"
          : "bg-white/10 ring-white/15 hover:bg-white/15"
      )}
    >
      {children}
    </button>
  );
}

/* ===== Grid Card ===== */
function Card({ section, onOpen, isFav, toggleFav }) {
  const Icon = icons[section.icon] || icons.book;
  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="relative rounded-2xl p-4 bg-white/5 ring-1 ring-white/10 backdrop-blur hover:bg-white/7.5"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl p-2 bg-white/10 text-white">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100">{section.title}</h3>
          <p className="mt-1 text-sm text-slate-300/90 line-clamp-2">
            {section.preview}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {section.tags?.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-200 ring-1 ring-white/10"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => onOpen(section.id)}
          className="text-xs px-2.5 py-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100"
        >
          Read more
        </button>
        <button
          onClick={() => toggleFav(section.id)}
          className="p-2 rounded-lg hover:bg-white/10"
          title={isFav ? "Remove favorite" : "Add favorite"}
        >
          {isFav ? (
            <icons.starFill className="w-4 h-4 text-amber-400" />
          ) : (
            <icons.star className="w-4 h-4 text-slate-300" />
          )}
        </button>
      </div>
    </motion.article>
  );
}

/* ===== Modal ===== */
function Modal({
  section,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  toggleFav,
  isFav,
  showToast,
}) {
  const ref = useRef(null);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight + 1);
      setProgress(clamp(p, 0, 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [section?.id]);

  const Icon = icons[section.icon] || icons.book;
  const textWords = words(section.body) + words(section.bullets);
  const readMin = estimateReadMin(textWords);

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${section.id}`;
    navigator.clipboard?.writeText(url);
    showToast("Link copied");

    // Multiple quick tips per section
    const QUICK_TIPS = {
      nutrition: [
        "Target protein: 1.6–2.2 g/kg/day, split across 3–5 meals (20–40 g each).",
        "Carbs around training improve performance and recovery.",
        "Hydrate: aim for pale-yellow urine; add electrolytes in long/hot sessions.",
      ],
      hypertrophy: [
        "Progressive overload: add reps, load, or slow tempo weekly—while keeping form.",
        "Train 5–30 reps per set; take most sets 1–3 RIR (reps in reserve).",
        "Log your lifts; small weekly wins compound.",
      ],
      recovery: [
        "Sleep 7–9 h; keep a consistent schedule and a cool, dark room.",
        "Plan a deload every 6–8 weeks at higher volumes.",
        "Low-intensity walks and mobility work speed recovery.",
      ],
      fuel: [
        "Creatine monohydrate: 3–5 g/day supports short, high-intensity efforts.",
        "Glycogen fuels moderate/high intensity—don’t fear carbs if performance matters.",
        "Fats support hormones; avoid extreme long-term restriction.",
      ],
      training: [
        "Track intensity, volume, and frequency for each muscle group.",
        "Prioritize compounds; sprinkle isolations to fill gaps.",
        "Master technique before chasing load.",
      ],
    };
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${section.id}-title`}
        tabIndex={-1}
        ref={ref}
        onClick={stop}
        className={cn(
          "fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2",
          "sm:-translate-x-1/2 sm:-translate-y-1/2",
          "w-full sm:w-[700px] max-w-screen px-4 sm:px-0"
        )}
      >
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { y: 40, opacity: 0 }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="rounded-2xl bg-slate-900/95 text-slate-100 shadow-2xl ring-1 ring-white/10 overflow-hidden backdrop-blur"
        >
          {/* Progress bar */}
          <div className="h-1 bg-transparent">
            <div
              className="h-1 bg-blue-600 transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="flex items-start gap-3 p-4 sm:p-5">
            <div className="shrink-0 mt-0.5 rounded-xl p-2 bg-white/10 text-white">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3
                  id={`${section.id}-title`}
                  className="text-lg font-semibold"
                >
                  {section.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{readMin} min</span>
                  <button
                    onClick={() => toggleFav(section.id)}
                    className="p-2 rounded-lg hover:bg-white/10"
                    title={isFav ? "Remove favorite" : "Add favorite"}
                  >
                    {isFav ? (
                      <icons.starFill className="w-4 h-4 text-amber-400" />
                    ) : (
                      <icons.star className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                  <button
                    onClick={copyLink}
                    className="p-2 rounded-lg hover:bg-white/10"
                    title="Copy link"
                  >
                    <icons.link className="w-4 h-4 text-slate-300" />
                  </button>
                  <button
                    onClick={onClose}
                    className="ml-1 rounded-lg p-2 text-slate-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Close"
                    title="Close"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tabs hint */}
              <div className="mt-2 flex gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-blue-600 text-white">
                  Article
                </span>
                <button
                  onClick={() =>
                    scrollRef.current
                      ?.querySelector("#quiz")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                >
                  Quiz
                </button>
              </div>

              <div
                ref={scrollRef}
                className="mt-2 max-h-[60vh] overflow-y-auto pr-1 space-y-2 text-sm leading-relaxed"
              >
                {section.body?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc list-inside space-y-1">
                    {section.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}

                {/* Quick tips */}
                <div className="mt-3 rounded-xl bg-blue-50 text-blue-900 ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:ring-blue-900/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide">
                    Quick tips
                  </p>
                  <ul className="mt-1 text-sm list-disc list-inside space-y-1">
                    {section.id === "nutrition" && (
                      <li>
                        Target protein: <strong>1.6–2.2 g/kg/day</strong>, split
                        across 3–5 meals (20–40 g each).
                      </li>
                    )}
                    {section.id === "hypertrophy" && (
                      <li>
                        Progressive overload: add reps, load, or slow tempo
                        weekly — with good technique.
                      </li>
                    )}
                    {section.id === "recovery" && (
                      <li>
                        Sleep <strong>7–9 h</strong>; schedule a deload every
                        6–8 weeks at higher volumes.
                      </li>
                    )}
                    {section.id === "fuel" && (
                      <li>
                        Creatine monohydrate: <strong>3–5 g/day</strong>{" "}
                        supports short, high-intensity efforts.
                      </li>
                    )}
                    {section.id === "training" && (
                      <li>
                        Track <em>intensity</em>, <em>volume</em>, and{" "}
                        <em>frequency</em> for each muscle group.
                      </li>
                    )}
                  </ul>
                </div>

                {/* Quiz */}
                <div id="quiz" className="pt-4">
                  <Quiz sectionId={section.id} items={section.quiz || []} />
                </div>
              </div>

              {/* Prev / Next */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <button
                  onClick={onPrev}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/15"
                >
                  ← Prev
                </button>
                <span className="text-slate-400">
                  {index + 1} / {total}
                </span>
                <button
                  onClick={onNext}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/15"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ===== Quiz ===== */
function Quiz({ sectionId, items }) {
  const key = `quiz:${sectionId}`;
  const [answers, setAnswers] = useState(() =>
    JSON.parse(localStorage.getItem(key) || "[]")
  );
  const [score, setScore] = useState(() =>
    Number(localStorage.getItem(`${key}:score`) || 0)
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(answers));
    const s = items.reduce(
      (acc, it, idx) => acc + (answers[idx] === it.c ? 1 : 0),
      0
    );
    setScore(s);
    localStorage.setItem(`${key}:score`, String(s));
  }, [answers, items, key]);

  if (!items?.length) return null;
  return (
    <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Check yourself</p>
        <span className="text-xs text-slate-400">
          Score: {score}/{items.length}
        </span>
      </div>
      <div className="mt-2 space-y-3">
        {items.map((it, i) => (
          <div key={i} className="space-y-1">
            <p className="text-sm">
              {i + 1}. {it.q}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {it.a.map((opt, j) => {
                const picked = answers[i] === j;
                const correct = it.c === j;
                const state =
                  answers[i] == null
                    ? ""
                    : picked && correct
                    ? "bg-green-600 text-white"
                    : picked && !correct
                    ? "bg-red-600 text-white"
                    : correct
                    ? "ring-1 ring-green-500"
                    : "";
                return (
                  <button
                    key={j}
                    onClick={() =>
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[i] = j;
                        return next;
                      })
                    }
                    className={cn(
                      "text-left px-2.5 py-1.5 rounded-lg text-sm bg-white/10 hover:bg-white/15",
                      state
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Main ===== */
export default function Anatomy() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState(new Set());
  const [favorites, setFavorites] = useState(
    () => new Set(JSON.parse(localStorage.getItem("anatomy:favs") || "[]"))
  );
  const [activeId, setActiveId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("anatomy:favs", JSON.stringify([...favorites]));
  }, [favorites]);

  // Deep-link open by hash
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash?.slice(1);
      if (id && SECTIONS.some((s) => s.id === id)) setActiveId(id);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const allTags = useMemo(() => {
    const t = new Set();
    SECTIONS.forEach((s) => s.tags?.forEach((x) => t.add(x)));
    return [...t];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hasTags = activeTags.size > 0;
    return SECTIONS.filter((s) => {
      if (hasTags && !s.tags?.some((t) => activeTags.has(t))) return false;
      if (!q) return true;
      const hay = [
        s.title,
        s.preview,
        ...(s.body || []),
        ...(s.bullets || []),
        ...(s.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, activeTags]);

  const open = (id) => {
    setActiveId(id);
    history.replaceState(null, "", `#${id}`);
  };
  const close = () => {
    setActiveId(null);
    history.replaceState(null, "", " ");
  };
  const index = useMemo(
    () => filtered.findIndex((s) => s.id === activeId),
    [filtered, activeId]
  );
  const onPrev = () => {
    if (index === -1) return;
    const prev = (index - 1 + filtered.length) % filtered.length;
    open(filtered[prev].id);
  };
  const onNext = () => {
    if (index === -1) return;
    const next = (index + 1) % filtered.length;
    open(filtered[next].id);
  };
  const toggleFav = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setToast((t) => (t ? t : "Updated favorites"));
  };

  const active = useMemo(
    () => SECTIONS.find((s) => s.id === activeId) || null,
    [activeId]
  );

  return (
    <section className="relative min-h-[70vh]">
      {/* subtle backdrop glow to match other pages */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(59,130,246,0.22), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Anatomy — Muscles: Complete Educational Guide
            </h1>
            <p className="text-sm text-slate-300">
              Tap a card to open a detailed modal. Close it to switch topics.
            </p>
          </div>
          <div className="w-full sm:w-[420px] flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
                <icons.search className="w-4 h-4" />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search: hypertrophy, protein, glycogen, sleep…"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 ring-1 ring-white/10 text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/70"
              />
            </div>
          </div>
        </header>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip
            active={activeTags.size === 0}
            onClick={() => setActiveTags(new Set())}
          >
            All
          </Chip>
          {allTags.map((t) => (
            <Chip
              key={t}
              active={activeTags.has(t)}
              onClick={() =>
                setActiveTags((prev) => {
                  const next = new Set(prev);
                  next.has(t) ? next.delete(t) : next.add(t);
                  return next;
                })
              }
            >
              {t}
            </Chip>
          ))}
          <span className="text-xs text-slate-400 self-center ml-auto">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={false}
        >
          {filtered.map((s) => (
            <Card
              key={s.id}
              section={s}
              onOpen={open}
              isFav={favorites.has(s.id)}
              toggleFav={toggleFav}
            />
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && index !== -1 && (
          <Modal
            section={active}
            index={index}
            total={filtered.length}
            onClose={close}
            onPrev={onPrev}
            onNext={onNext}
            toggleFav={toggleFav}
            isFav={favorites.has(active.id)}
            showToast={(t) => setToast(t)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <Toast text={toast} onDone={() => setToast("")} />
    </section>
  );
}
