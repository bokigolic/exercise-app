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
  // Github,       // removed
  // ExternalLink, // removed
  Shield,
  Cpu,
  Zap,
  CheckCircle2,
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
    when: "Q4 2025",
    title: "Weekly Split Builder",
    points: [
      "Auto distribution by muscle groups & time budget",
      "Warm-up/cooldown presets",
      "Export to calendar (ICS)",
    ],
  },
  {
    when: "Q1 2026",
    title: "Progression Planner",
    points: [
      "Linear & double progression",
      "RPE/%1RM loads",
      "History & PR tracking",
    ],
  },
  {
    when: "Later",
    title: "PWA + Offline",
    points: ["Local caching of media & JSON", "Installable app experience"],
  },
];

// TEAM — očišćeno: bez Coach titule i bez GitHub/Portfolio linkova
const TEAM = [
  {
    name: "Product Team",
    role: "Product & Training",
    avatar: null,
  },
  {
    name: "Design Team",
    role: "Design & Frontend",
    avatar: null,
  },
];

const FAQS = [
  {
    q: "Is the library free to use?",
    a: "Yes. All core features are free. Exports and advanced planners may become pro in the future.",
  },
  {
    q: "Can I save workouts?",
    a: "Yes. You can pin exercises and save/restore plans via local storage. Roadmap includes richer history.",
  },
  {
    q: "Will there be mobile app?",
    a: "Planned PWA will make GymMaster installable and offline-ready.",
  },
];

// Dodatno
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
  <section id={id} className="max-w-7xl mx-auto px-6 py-14">
    <div className="mb-10 text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </section>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/90 dark:bg-gray-800/70 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/60 dark:ring-white/10 p-6 ${className}`}
  >
    {children}
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <Card>
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
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
      <p className="text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400">
        <span>{/* eslint-disable-next-line jsx-a11y/aria-role */}</span>
        <motion.span>{rounded}</motion.span>
        {suffix}
      </p>
      <p className="text-gray-600 dark:text-gray-300">{label}</p>
    </Card>
  );
}

const ValueCard = ({ icon: Icon, title, desc }) => (
  <Card>
    <div className="flex items-start gap-3">
      <Icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
      </div>
    </div>
  </Card>
);

const TimelineItem = ({ when, title, points }) => (
  <div className="relative pl-8">
    <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-blue-600" />
    <div
      className="absolute left-1.5 top-4 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-900/40"
      aria-hidden
    />
    <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300">
      {when}
    </h4>
    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
      {title}
    </p>
    <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
      {points.map((p, i) => (
        <li key={i}>{p}</li>
      ))}
    </ul>
  </div>
);

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl">
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {q}
        </span>
        <span className="text-gray-500">{open ? "–" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-400">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
    window.location.href = `mailto:bokigolic32@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* HERO */}
      <section className="relative overflow-hidden text-center py-20 sm:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        {/* subtle noise/shine */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light"
          style={{
            backgroundImage:
              "radial-gradient(60% 60% at 50% 10%, rgba(255,255,255,0.35), transparent 60%)",
          }}
        />
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight"
        >
          GymMaster — About & Roadmap
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-4 text-base sm:text-lg opacity-95 max-w-2xl mx-auto"
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl shadow hover:bg-blue-50"
          >
            Start Training <Rocket className="w-4 h-4" />
          </Link>
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900/30 text-white font-semibold rounded-xl shadow hover:bg-blue-900/50"
          >
            Try Generator <Flame className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

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
                  <w.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {w.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {w.desc}
                    </p>
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

      {/* Stats with animated counters */}
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

      {/* Mid-page CTA strip */}
      <section className="max-w-7xl mx-auto px-6">
        <Card className="relative overflow-hidden">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-2xl" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Build better training weeks
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ROADMAP.map((item, i) => (
            <motion.div
              key={item.title}
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

      {/* Team (neutral, bez ličnih linkova) */}
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
                  <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 grid place-items-center text-gray-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {m.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {m.role}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Our Promise */}
      <Section
        id="promise"
        title="Our Promise"
        subtitle="Principles we hold ourselves to."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROMISES.map((p, i) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{p}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" title="FAQ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQS.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <FaqItem {...f} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Newsletter / Contact */}
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
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-gray-500">
            Or email us directly:{" "}
            <a href="mailto:bokigolic32@gmail.com" className="underline">
              bokigolic32@gmail.com
            </a>
          </p>
        </Card>
      </Section>

      {/* Final CTA */}
      <div className="text-center pb-16">
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
