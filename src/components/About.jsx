// src/pages/About.jsx
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  Dumbbell,
  HeartPulse,
  Users,
  Rocket,
  Target,
  ShieldCheck,
  Sparkles,
  Activity,
  Flame,
  Mail,
  Shield,
  Cpu,
  Zap,
  CheckCircle2,
  Linkedin,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

/* =================== Content =================== */
const FEATURES = [
  {
    icon: Dumbbell,
    title: "Rich Exercise Library",
    desc: "Clear instructions, primary/secondary muscles, equipment, levels.",
  },
  {
    icon: Target,
    title: "Smart Filters",
    desc: "Find by name, level, body part—get to the right move fast.",
  },
  {
    icon: Activity,
    title: "Workout Generator",
    desc: "Score-based selection, diversification, ready-to-train templates.",
  },
  {
    icon: ShieldCheck,
    title: "Form & Safety",
    desc: "Technique tips & common mistakes to reduce injury risk.",
  },
];

const VALUES = [
  {
    icon: HeartPulse,
    title: "Health First",
    desc: "Technique over ego. Sustainable progress > quick wins.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Learn together, share progress, support each other.",
  },
  {
    icon: Sparkles,
    title: "Clarity",
    desc: "Clean UI. No fluff—what you need, where you expect it.",
  },
];

const STATS = [
  { value: 500, suffix: "+", label: "Exercises" },
  { value: 10, suffix: "", label: "Muscle Groups" },
  { value: 1000, suffix: "+", label: "Combinations" },
  { value: 1, suffix: "", label: "Community" },
];

const ROADMAP = [
  {
    when: "Q2 2025",
    title: "Weekly Split Builder",
    status: "in_progress",
    points: [
      "Auto distribution by muscle groups & time budget",
      "Warm-up / cooldown presets",
      "Export to calendar (ICS)",
    ],
  },
  {
    when: "Q3 2025",
    title: "PWA + Offline",
    status: "shipped",
    points: [
      "Installable app (Add to Home Screen)",
      "Offline caching of media & JSON",
      "Background sync for updates",
    ],
  },
  {
    when: "Q4 2025",
    title: "Progression Planner",
    status: "planned",
    points: [
      "Linear & double progression",
      "RPE / %1RM load guidance",
      "History, PR tracking & plate math",
    ],
  },
  {
    when: "Q1–Q2 2026",
    title: "AI Coach & Camera Form Analysis",
    status: "planned",
    points: [
      "On-device pose estimation & rep counting",
      "Real-time form cues (depth, tempo, ROM)",
      "Auto-logged sets with quality score",
    ],
  },
  {
    when: "Later 2026",
    title: "Integrations & Community",
    status: "planned",
    points: [
      "Wearables (HR/steps) & Apple/Google Health",
      "Shareable templates & coach packs",
      "Custom goals (rehab, mobility, sport-specific)",
    ],
  },
];

const TEAM = [
  { name: "Product Team", role: "Product & Training", avatar: null },
  { name: "Design Team", role: "Design & Frontend", avatar: null },
];

const FAQ_GROUPS = {
  General: [
    {
      q: "Is the library free to use?",
      a: "Yes. All core features are free. Exports and advanced planners may become pro in the future.",
    },
    {
      q: "How accurate is the Workout Generator?",
      a: "It ranks exercises by goal, level, location, equipment, and muscle balance. Treat it as a smart starting point—adjust volume and loads to your recovery.",
    },
    {
      q: "Can I train without gym equipment?",
      a: "Yes. Choose 'Home' and select 'none' for equipment. The generator will prioritize bodyweight and band-friendly movements.",
    },
    {
      q: "Is this medical advice?",
      a: "No. Educational only. Consult a qualified professional for medical conditions or rehab.",
    },
  ],
  Training: [
    {
      q: "How do I substitute an exercise?",
      a: "Match the pattern and primary muscle: e.g., barbell row → one-arm dumbbell row; back squat → goblet squat.",
    },
    {
      q: "Do you include warm-up and cooldown?",
      a: "Basic tips are included; full presets arrive with Weekly Split Builder.",
    },
    {
      q: "Can I use imperial units (lbs/in)?",
      a: "Metric-first for now. Unit toggles are planned. Quick conversions: 1 kg ≈ 2.2 lb, 1 in ≈ 2.54 cm.",
    },
    {
      q: "How often is content updated?",
      a: "Periodically. Major drops align with the public roadmap; minor fixes roll out continuously.",
    },
  ],
  "Tech & Privacy": [
    {
      q: "Do you track or sell my data?",
      a: "Privacy-first. Choices live in local storage on your device. We don't sell personal data.",
    },
    {
      q: "Will it work offline?",
      a: "Yes—once PWA is installed. Core pages and data are cached for offline planning.",
    },
    {
      q: "How do I report a bug or request a feature?",
      a: "Email golichbojan@gmail.com or ping LinkedIn with steps to reproduce and screenshots.",
    },
  ],
};

const WHY = [
  {
    icon: Cpu,
    title: "Smart by default",
    desc: "Thoughtful defaults, fewer clicks.",
  },
  {
    icon: Zap,
    title: "Fast & snappy",
    desc: "Modern stack, instant feedback.",
  },
  {
    icon: Shield,
    title: "Privacy-first",
    desc: "No gimmicks. Your data stays yours.",
  },
];

const PROMISES = [
  "No dark patterns or paywalls for basics.",
  "Performance budgets: fast on low-end phones.",
  "Accessibility: keyboard & screen-reader friendly.",
  "Continuous improvement based on feedback.",
];

/* =================== Small UI Primitives =================== */
const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
    <div className="mb-10 text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-slate-300 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
    {children}
  </section>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/5 backdrop-blur rounded-2xl shadow-lg ring-1 ring-white/10 p-6 ${className}`}
  >
    {children}
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <Card>
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-xl bg-blue-500/15 ring-1 ring-blue-500/30">
        <Icon className="w-6 h-6 text-blue-300" />
      </div>
      <div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-300">{desc}</p>
      </div>
    </div>
  </Card>
);

function AnimatedStat({ value, suffix = "", label }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => Math.floor(latest));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [value, mv]);
  return (
    <Card className="text-center">
      <p className="text-4xl sm:text-5xl font-extrabold text-blue-400">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </p>
      <p className="text-slate-300">{label}</p>
    </Card>
  );
}

const ValueCard = ({ icon: Icon, title, desc }) => (
  <Card>
    <div className="flex items-start gap-3">
      <Icon className="w-7 h-7 text-purple-300" />
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-300">{desc}</p>
      </div>
    </div>
  </Card>
);

const STATUS_MAP = {
  planned: {
    label: "Planned",
    cls: "bg-slate-500/20 text-slate-300 ring-1 ring-slate-400/30",
  },
  in_progress: {
    label: "In progress",
    cls: "bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/30",
  },
  shipped: {
    label: "Shipped",
    cls: "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30",
  },
};

const TimelineItem = ({ when, title, points, status = "planned" }) => {
  const st = STATUS_MAP[status] ?? STATUS_MAP.planned;
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-blue-500" />
      <div
        className="absolute left-1.5 top-4 bottom-0 w-0.5 bg-white/10"
        aria-hidden
      />
      <div className="flex items-center gap-2 flex-wrap">
        <h4 className="text-sm font-semibold text-blue-300">{when}</h4>
        <span className={`text-[11px] px-2 py-0.5 rounded-full ${st.cls}`}>
          {st.label}
        </span>
      </div>
      <p className="mt-1 text-lg font-bold text-white">{title}</p>
      <ul className="mt-2 list-disc list-inside text-sm text-slate-300">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
};

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl">
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium text-white">{q}</span>
        <span className="text-slate-400">{open ? "–" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-4 pt-0 text-sm text-slate-300">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function FAQSection() {
  const tabs = ["All", ...Object.keys(FAQ_GROUPS)];
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const list = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool =
      active === "All"
        ? Object.values(FAQ_GROUPS).flat()
        : FAQ_GROUPS[active] || [];
    if (!q) return pool;
    return pool.filter(
      (x) => x.q.toLowerCase().includes(q) || x.a.toLowerCase().includes(q)
    );
  }, [active, query]);

  return (
    <Section id="faq" title="FAQ" subtitle="Quick answers to common questions.">
      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="inline-flex flex-wrap gap-2">
          {tabs.map((t) => {
            const selected = active === t;
            return (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={
                  selected
                    ? "px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/15 text-white ring-1 ring-white/20"
                    : "px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
                }
                aria-pressed={selected}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/5 ring-1 ring-white/10 text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
            {list.length}
          </span>
        </div>
      </div>

      {list.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((f, i) => (
            <motion.div
              key={`${f.q}-${i}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: (i % 6) * 0.03 }}
            >
              <FaqItem q={f.q} a={f.a} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-sm text-slate-300">
          No results. Try another keyword or switch a tab.
        </div>
      )}
    </Section>
  );
}

/* =================== Page =================== */
export default function About() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    if (!email) return;
    const subject = encodeURIComponent("GymMaster Newsletter Subscribe");
    const body = encodeURIComponent(
      `Please subscribe this email: ${email}\n\nThanks!`
    );
    window.location.href = `mailto:golichbojan@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden text-center py-16 sm:py-20">
        <div className="absolute inset-0 -z-10">
          <div
            className="h-full w-full opacity-30"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, rgba(59,130,246,0.25), transparent 60%)",
            }}
          />
        </div>
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white"
        >
          GymMaster — About & Roadmap
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto"
        >
          Train smarter with a clean UX, strong data, and tools that keep you
          consistent.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex gap-3 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-white/90"
          >
            Start Training <Rocket className="w-4 h-4" />
          </Link>
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/30 text-white font-semibold ring-1 ring-white/15 hover:bg-blue-600/45"
          >
            Try Generator <Flame className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Founder’s Note */}
      <Section
        id="founder"
        title="Why I built GymMaster"
        subtitle="A focused toolset for clarity, consistency, and real-world results."
      >
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl" />
          <div className="relative">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-white/10 ring-1 ring-white/15 text-slate-200">
                Founder's Note
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div className="grid grid-cols-1">
              <div className="space-y-5 border-l-2 border-blue-400/40 pl-4">
                <p className="text-slate-100 text-lg sm:text-xl leading-relaxed tracking-tight">
                  I built{" "}
                  <span className="font-semibold text-white/90">GymMaster</span>{" "}
                  to remove noise from training. No bloated menus, no
                  guesswork—just a fast way to learn movements, plan balanced
                  weeks, and track what matters.
                </p>
                <ul className="text-slate-200 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-2">
                  <li>
                    <span className="font-medium text-white/90">
                      Education first:
                    </span>{" "}
                    anatomy, cues, common mistakes.
                  </li>
                  <li>
                    <span className="font-medium text-white/90">Speed:</span>{" "}
                    generate solid sessions in seconds, then tweak.
                  </li>
                  <li>
                    <span className="font-medium text-white/90">
                      Longevity:
                    </span>{" "}
                    sustainable progress beats 30-day hacks.
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>
        </Card>
      </Section>

      {/* Mission & Values */}
      <Section
        id="mission"
        title="Mission & Values"
        subtitle="Make fitness accessible, clear, and sustainable for everyone."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <ValueCard {...v} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Why This App */}
      <Section
        id="why"
        title="Why this app?"
        subtitle="Thoughtful UX, accurate data, and performance that respects your time."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHY.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card>
                <div className="flex items-start gap-3">
                  <w.icon className="w-6 h-6 text-emerald-300" />
                  <div>
                    <h3 className="font-semibold text-white">{w.title}</h3>
                    <p className="text-sm text-slate-300">{w.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section
        id="features"
        title="What You Get"
        subtitle="Essential tools for building better workouts."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <FeatureCard {...f} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Stats */}
      <Section id="stats" title="At a Glance">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <AnimatedStat value={s.value} suffix={s.suffix} label={s.label} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Mid-page CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <Card className="relative overflow-hidden">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                Build better training weeks
              </h3>
              <p className="text-sm text-slate-300">
                Use the generator and smart filters to create balanced,
                progressive plans.
              </p>
            </div>
            <Link
              to="/generator"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Plan a week <Rocket className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </section>

      {/* Roadmap */}
      <Section
        id="roadmap"
        title="Roadmap"
        subtitle="What we’re building next — based on your feedback."
      >
        <div className="max-w-7xl mx-auto px-1 -mt-4 mb-6">
          <span className="text-[11px] text-slate-400 bg-white/5 ring-1 ring-white/10 rounded-md px-2 py-1">
            Updated: Sep 30, 2025
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ROADMAP.map((item, i) => (
            <motion.div
              key={`${item.title}-${item.when}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card>
                <TimelineItem {...item} />
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section
        id="team"
        title="Team"
        subtitle="Small, focused, and user-obsessed."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/10 grid place-items-center text-slate-300 ring-1 ring-white/10">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{m.name}</p>
                    <p className="text-sm text-slate-300">{m.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Promise */}
      <Section
        id="promise"
        title="Our Promise"
        subtitle="Principles we hold ourselves to."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROMISES.map((p, i) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5" />
                <p className="text-sm text-slate-300">{p}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ (Searchable) */}
      <FAQSection />

      {/* Contact */}
      <Section
        id="contact"
        title="Stay in the loop"
        subtitle="No spam. Occasional updates on new features and training guides."
      >
        <Card className="max-w-xl mx-auto">
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Subscribe
            </button>
          </form>
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-3">
            <a
              href="mailto:golichbojan@gmail.com"
              className="underline hover:text-slate-200"
            >
              golichbojan@gmail.com
            </a>
            <span aria-hidden>•</span>
            <a
              href="https://www.linkedin.com/in/bojan-golic/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 underline hover:text-slate-200"
            >
              <Linkedin size={14} /> LinkedIn
            </a>
          </div>
        </Card>
      </Section>

      {/* Final CTA */}
      <div className="text-center pb-8">
        <Link
          to="/"
          className="inline-block px-6 py-3 mt-4 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700"
        >
          Start Training 🚀
        </Link>
      </div>
    </div>
  );
}
