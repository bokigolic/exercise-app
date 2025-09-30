// src/components/Anatomy.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

/* ---------------- Utils ---------------- */
const cn = (...c) => c.filter(Boolean).join(" ");
const stop = (e) => e.stopPropagation();
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const words = (s) =>
  (Array.isArray(s) ? s.join(" ") : s || "").split(/\s+/).filter(Boolean)
    .length;
const estimateReadMin = (w, wpm = 220) => Math.max(1, Math.round(w / wpm));

/* ---------------- Icons (inline) ---------------- */
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
  starFill: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M12 3l2.9 6 6.6.9-4.8 4.5 1.2 6.6L12 18.7 6.1 21l1.2-6.6L2.5 9.9l6.6-.9L12 3z"
        fill="currentColor"
      />
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
};

/* ---------------- Content (richer previews) ---------------- */
const SECTIONS = [
  {
    id: "intro",
    icon: "book",
    title: "Introduction to Muscles",
    preview:
      "Muscles power movement, posture, breathing, and heat. They adapt quickly to how you train and recover.",
    tags: ["basics", "health"],
    body: [
      "Muscles account for ~30–40% of body weight and underpin movement, stability, breathing mechanics, circulation, and thermoregulation.",
      "They are metabolically active tissues responsive to training, nutrition, and sleep—key drivers of performance, insulin sensitivity, and healthy aging.",
    ],
  },
  {
    id: "types",
    icon: "layers",
    title: "Types of Muscles",
    preview:
      "Three tissues with distinct roles: skeletal (movement), cardiac (heart), smooth (organs).",
    tags: ["basics", "physiology"],
    bullets: [
      "Skeletal — voluntary, attached to bones; posture & movement.",
      "Cardiac — involuntary, unique to the heart; beats continuously.",
      "Smooth — involuntary, in organs/vessels; digestion & circulation.",
    ],
  },
  {
    id: "structure",
    icon: "tune",
    title: "Muscle Structure",
    preview:
      "Fibers contain myofibrils; sarcomeres with actin & myosin create force via sliding filaments.",
    tags: ["physiology", "structure"],
    bullets: [
      "Muscle fiber → myofibrils → sarcomeres.",
      "Sarcomere: actin & myosin slide to shorten the muscle.",
      "Connective sheaths: endomysium, perimysium, epimysium.",
      "Neuromuscular junctions: motor neurons trigger contraction.",
    ],
  },
  {
    id: "hypertrophy",
    icon: "dumbbell",
    title: "How Muscles Grow (Hypertrophy)",
    preview:
      "Micro-tears + protein synthesis + progressive overload → bigger, stronger fibers.",
    tags: ["training", "growth"],
    body: [
      "Resistance training causes micro-damage repaired by protein synthesis, leading to thicker fibers.",
      "Progressive overload (more load/reps/range/tempo) and adequate recovery drive hypertrophy; hormones (testosterone, GH, IGF-1) support the process.",
    ],
  },
  {
    id: "atrophy",
    icon: "moon",
    title: "Muscle Loss (Atrophy & Sarcopenia)",
    preview:
      "Inactivity, illness, or aging shrink fibers; strength and metabolism decline without training.",
    tags: ["health", "aging"],
    body: [
      "Atrophy emerges with disuse, undernutrition, or disease. Sarcopenia starts ~30 and accelerates after 50.",
      "Prevention: lift regularly, eat sufficient protein, and stay active to preserve muscle quality and function.",
    ],
  },
  {
    id: "fuel",
    icon: "bolt",
    title: "Fuel for Muscles",
    preview:
      "ATP for now, creatine for bursts, glycogen for hard efforts, fat for endurance.",
    tags: ["energy", "physiology"],
    bullets: [
      "ATP — immediate currency.",
      "Creatine phosphate — brief power.",
      "Glycogen — primary at higher intensities.",
      "Fatty acids — main at rest/long duration.",
      "Protein — backup fuel when carbs/fats are low.",
    ],
  },
  {
    id: "nutrition",
    icon: "heart",
    title: "Nutrition & Muscles",
    preview:
      "Aim ~1.6–2.2 g/kg protein, fuel with carbs, include healthy fats, hydrate well.",
    tags: ["nutrition", "health"],
    bullets: [
      "Protein: ~1.6–2.2 g/kg/day (active individuals).",
      "Carbohydrates: refill glycogen for training.",
      "Healthy fats: hormone balance & recovery.",
      "Micros: vitamin D, calcium, magnesium, iron.",
      "Hydration: muscles are ~75% water.",
    ],
  },
  {
    id: "recovery",
    icon: "clock",
    title: "Recovery & Sleep",
    preview:
      "Growth happens outside the gym: 7–9h sleep, deloads, and active recovery matter.",
    tags: ["recovery", "health"],
    body: [
      "Deep sleep supports growth hormone and tissue repair.",
      "Active recovery increases blood flow; manage volume and insert deload weeks to avoid overtraining.",
    ],
  },
  {
    id: "training",
    icon: "dumbbell",
    title: "Training Variables",
    preview:
      "Intensity, volume, frequency, and variation—track them to guide progression.",
    tags: ["training"],
    bullets: [
      "Intensity: load/weight.",
      "Volume: sets × reps (total work).",
      "Frequency: sessions per muscle/week.",
      "Variation: rotation of exercises & stimuli.",
      "Consistency: meaningful gains take months/years.",
    ],
  },
  {
    id: "lifespan",
    icon: "users",
    title: "Muscles Across the Lifespan",
    preview:
      "Youth growth → peak in 20s → gradual decline; training preserves function at any age.",
    tags: ["aging", "health"],
    bullets: [
      "Teens: rapid growth with activity & hormones.",
      "20s: peak muscle potential.",
      "30–40s: gradual decline without training.",
      "50+: sarcopenia accelerates; strength work crucial.",
      "70+: training maintains mobility & independence.",
    ],
  },
  {
    id: "fun",
    icon: "star",
    title: "Fun Facts",
    preview:
      "Largest: gluteus maximus. Strongest per size: masseter. 600+ muscles coordinate daily life.",
    tags: ["fun"],
    bullets: [
      "Largest muscle: gluteus maximus.",
      "Strongest relative to size: masseter.",
      "Standing still needs hundreds of contractions.",
    ],
  },
  {
    id: "takeaways",
    icon: "book",
    title: "Key Takeaways",
    preview:
      "Use it or lose it—apply load, eat protein, sleep well, and be consistent.",
    tags: ["summary"],
    bullets: [
      "Adaptation follows the stimulus you provide.",
      "Training + nutrition + recovery = progress.",
      "Consistency beats perfection.",
    ],
  },
];

/* ---------------- Toast ---------------- */
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
          onAnimationComplete={() => setTimeout(onDone, 1500)}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- FancyCard (tilt + shine) ---------------- */
function FancyCard({ children, onClick, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useTransform(y, [0, 1], [8, -8]);
  const ry = useTransform(x, [0, 1], [-8, 8]);

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = clamp((e.clientX - r.left) / r.width, 0, 1);
    const py = clamp((e.clientY - r.top) / r.height, 0, 1);
    x.set(px);
    y.set(py);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0.5);
        y.set(0.5);
      }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      className={cn("relative rounded-2xl p-px", className)}
      onClick={onClick}
    >
      {/* animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/30 via-blue-500/30 to-emerald-500/30 blur-[2px]" />
      {/* inner */}
      <div className="relative rounded-[1rem] bg-white/80 dark:bg-slate-900/70 ring-1 ring-slate-900/10 dark:ring-white/10 shadow-sm">
        {/* shine */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[1rem]"
          style={{
            background: `radial-gradient(600px circle at ${x.get() * 100}% ${
              y.get() * 100
            }%, rgba(255,255,255,.25), transparent 40%)`,
          }}
        />
        <div className="relative z-10 p-4">{children}</div>
      </div>
    </motion.div>
  );
}

/* ---------------- Card ---------------- */
function Card({ section, onOpen, isFav, toggleFav }) {
  const Icon = icons[section.icon] || icons.book;
  return (
    <FancyCard onClick={() => onOpen(section.id)} className="cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl p-2 bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            {section.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
            {section.preview}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {section.tags?.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(section.id);
          }}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
          title={isFav ? "Remove favorite" : "Add favorite"}
        >
          {isFav ? (
            <icons.starFill className="w-4 h-4 text-amber-400" />
          ) : (
            <icons.star className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>
      <div className="mt-3">
        <span className="text-xs px-2 py-1 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
          Read more
        </span>
      </div>
    </FancyCard>
  );
}

/* ---------------- Modal (no quiz here) ---------------- */
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
  const sc = useRef(null);
  const [progress, setProgress] = useState(0);
  const reduce =
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
    const el = sc.current;
    if (!el) return;
    const onScroll = () =>
      setProgress(
        clamp(el.scrollTop / (el.scrollHeight - el.clientHeight + 1), 0, 1)
      );
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [section?.id]);

  const Icon = icons[section.icon] || icons.book;
  const w = words(section.body) + words(section.bullets);
  const readMin = estimateReadMin(w);

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${section.id}`;
    navigator.clipboard?.writeText(url);
    showToast("Link copied");
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
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
          "w-full sm:w-[720px] max-w-screen px-4 sm:px-0"
        )}
      >
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10"
        >
          {/* progress */}
          <div className="h-1 bg-transparent">
            <div
              className="h-1 bg-blue-600 transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="flex items-start gap-3 p-4 sm:p-5">
            <div className="shrink-0 mt-0.5 rounded-xl p-2 bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white">
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
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {readMin} min
                  </span>
                  <button
                    onClick={() => toggleFav(section.id)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
                    title={isFav ? "Remove favorite" : "Add favorite"}
                  >
                    {isFav ? (
                      <icons.starFill className="w-4 h-4 text-amber-400" />
                    ) : (
                      <icons.star className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <button
                    onClick={copyLink}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
                    title="Copy link"
                  >
                    <icons.link className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </button>
                  <button
                    onClick={onClose}
                    className="ml-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-white/10 dark:text-slate-300"
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

              {/* scrollable content */}
              <div
                ref={sc}
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
                {/* Quick tips by context */}
                {(section.id === "nutrition" ||
                  section.id === "hypertrophy" ||
                  section.id === "recovery" ||
                  section.id === "fuel" ||
                  section.id === "training") && (
                  <div className="mt-3 rounded-xl bg-blue-50 text-blue-900 ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:ring-blue-900/40 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      Quick tips
                    </p>
                    <ul className="mt-1 text-sm list-disc list-inside space-y-1">
                      {section.id === "nutrition" && (
                        <>
                          <li>
                            Protein: <strong>1.6–2.2 g/kg/day</strong>, split
                            3–5 meals.
                          </li>
                          <li>
                            Hydrate: start at <strong>30–35 ml/kg/day</strong>{" "}
                            and adjust.
                          </li>
                        </>
                      )}
                      {section.id === "hypertrophy" && (
                        <>
                          <li>
                            Overload: add reps/weight or slow tempo weekly.
                          </li>
                          <li>Keep 1–3 reps in reserve (RIR) for most sets.</li>
                        </>
                      )}
                      {section.id === "recovery" && (
                        <>
                          <li>
                            Sleep <strong>7–9 h</strong>; consistent schedule >
                            weekend binges.
                          </li>
                          <li>Deload every 6–8 weeks if progress stalls.</li>
                        </>
                      )}
                      {section.id === "fuel" && (
                        <>
                          <li>
                            Creatine monohydrate: <strong>3–5 g/day</strong>.
                          </li>
                          <li>
                            High-intensity days: prioritize carbs pre/post.
                          </li>
                        </>
                      )}
                      {section.id === "training" && (
                        <>
                          <li>
                            Track intensity, volume, frequency for each muscle.
                          </li>
                          <li>Rotate movement patterns every 6–8 weeks.</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Prev/Next */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <button
                  onClick={onPrev}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/15"
                >
                  ← Prev
                </button>
                <span className="text-slate-500 dark:text-slate-400">
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

/* ---------------- Quiz Section (separate; levels) ---------------- */
const QUIZ = {
  easy: [
    {
      q: "Which tissue is voluntary and attached to bones?",
      a: ["Smooth", "Cardiac", "Skeletal"],
      c: 2,
    },
    {
      q: "Immediate cellular energy currency is…",
      a: ["ATP", "Glycogen", "Fatty acids"],
      c: 0,
    },
    {
      q: "Recommended adult sleep for recovery?",
      a: ["3–4 h", "7–9 h", "10–12 h"],
      c: 1,
    },
  ],
  medium: [
    {
      q: "Hypertrophy primarily requires…",
      a: ["Progressive overload", "Static stretching", "Dehydration"],
      c: 0,
    },
    {
      q: "Sarcopenia generally begins around age…",
      a: ["10", "30", "70"],
      c: 1,
    },
    {
      q: "Primary fuel at high intensity efforts:",
      a: ["Fatty acids", "Glycogen", "Protein"],
      c: 1,
    },
  ],
  hard: [
    {
      q: "Sliding filament theory involves…",
      a: ["Actin & myosin", "Collagen & elastin", "Calcium & sodium only"],
      c: 0,
    },
    {
      q: "Connective tissue around fascicles is…",
      a: ["Endomysium", "Perimysium", "Epimysium"],
      c: 1,
    },
    {
      q: "Creatine phosphate system dominates for…",
      a: ["<10s power bursts", ">30 min jog", "All-day activity"],
      c: 0,
    },
  ],
};

function QuizSection() {
  const tabs = ["easy", "medium", "hard"];
  const [tab, setTab] = useState("easy");
  const key = (t) => `quiz-global:${t}`;
  const [answers, setAnswers] = useState(() =>
    JSON.parse(localStorage.getItem(key(tab)) || "[]")
  );
  const items = QUIZ[tab];

  useEffect(() => {
    setAnswers(JSON.parse(localStorage.getItem(key(tab)) || "[]"));
  }, [tab]);

  useEffect(() => {
    localStorage.setItem(key(tab), JSON.stringify(answers));
  }, [answers, tab]);

  const score = items.reduce(
    (s, it, i) => s + (answers[i] === it.c ? 1 : 0),
    0
  );

  return (
    <section className="mt-10 rounded-2xl bg-white/70 dark:bg-slate-900/70 ring-1 ring-slate-900/10 dark:ring-white/10 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Practice Quiz</h2>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs capitalize ring-1",
                tab === t
                  ? "bg-blue-600 text-white ring-blue-700"
                  : "bg-white/10 ring-white/15 hover:bg-white/15"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Score: {score}/{items.length}
      </p>

      <div className="mt-3 space-y-4">
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
                      "text-left px-2.5 py-1.5 rounded-lg text-sm bg-white/70 hover:bg-white dark:bg-white/10 dark:hover:bg-white/15",
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
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Tip: Questions are independent from cards—no spoilers in modals.
      </p>
    </section>
  );
}

/* ---------------- Main ---------------- */
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
    return ["all", ...t];
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
    setFavorites((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
    setToast((t) => (t ? t : "Updated favorites"));
  };

  const active = useMemo(
    () => SECTIONS.find((s) => s.id === activeId) || null,
    [activeId]
  );

  return (
    <section className="min-h-[70vh] bg-gradient-to-b from-slate-50 to-white text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Anatomy — Muscles: Complete Educational Guide
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Tap a card to open a detailed modal. Quiz is below the cards.
            </p>
          </div>
          <div className="w-full sm:w-[420px] flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                <icons.search className="w-4 h-4" />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search: hypertrophy, protein, glycogen, sleep…"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-black/5 ring-1 ring-slate-900/10 outline-none focus:ring-2 focus:ring-blue-500/70 dark:bg-white/5 dark:ring-white/10"
              />
            </div>
          </div>
        </header>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {allTags.map((t, i) => (
            <button
              key={t}
              onClick={() =>
                setActiveTags((prev) => {
                  if (i === 0) return new Set(); // All
                  const next = new Set(prev);
                  next.has(t) ? next.delete(t) : next.add(t);
                  return next;
                })
              }
              className={cn(
                "px-2.5 py-1 rounded-full text-xs ring-1 transition",
                (i === 0 && activeTags.size === 0) || activeTags.has(t)
                  ? "bg-blue-600 text-white ring-blue-700"
                  : "bg-white/10 ring-white/15 hover:bg-white/15 dark:bg-white/10"
              )}
            >
              {t}
            </button>
          ))}
          <span className="text-xs text-slate-500 dark:text-slate-400 self-center ml-auto">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Grid: 1 / 2 / 3 columns */}
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

        {/* Quiz (separate section) */}
        <QuizSection />
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
