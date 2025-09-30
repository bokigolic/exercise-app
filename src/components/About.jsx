// src/pages/About.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Github,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

/* =================== Content =================== */
const FEATURES = [
  {
    icon: Dumbbell,
    title: "Rich Exercise Library",
    desc: "Clear instructions, images, primary/secondary muscles, equipment, and levels.",
  },
  {
    icon: Target,
    title: "Smart Filters",
    desc: "Search by name, level, body part, and quickly find what you need.",
  },
  {
    icon: Activity,
    title: "Workout Generator",
    desc: "Score-based selection, diversification, and ready-to-train templates.",
  },
  {
    icon: ShieldCheck,
    title: "Form & Safety",
    desc: "Tips and common mistakes to reduce injury risk and improve technique.",
  },
];

const VALUES = [
  {
    icon: HeartPulse,
    title: "Health First",
    desc: "Technique over ego. Sustainable progress beats quick wins.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Learn together, share progress, and support others.",
  },
  {
    icon: Sparkles,
    title: "Clarity",
    desc: "Clean UI and no fluff—everything you need, where you expect it.",
  },
];

const STATS = [
  { value: "500+", label: "Exercises" },
  { value: "10", label: "Muscle Groups" },
  { value: "∞", label: "Combinations" },
  { value: "1", label: "Community" },
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

const TEAM = [
  {
    name: "Coach Persona",
    role: "Product & Training",
    avatar: null,
    links: [{ label: "GitHub", href: "https://github.com/", icon: Github }],
  },
  {
    name: "UI Persona",
    role: "Design & Frontend",
    avatar: null,
    links: [
      { label: "Portfolio", href: "https://example.com", icon: ExternalLink },
    ],
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

/* =================== Small UI Primitives =================== */
const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="max-w-6xl mx-auto px-6 py-12">
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </section>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 ${className}`}
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
        <h3 className="font-bold text-gray-800 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
      </div>
    </div>
  </Card>
);

const StatCard = ({ value, label }) => (
  <Card className="text-center">
    <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
      {value}
    </p>
    <p className="text-gray-600 dark:text-gray-300">{label}</p>
  </Card>
);

const ValueCard = ({ icon: Icon, title, desc }) => (
  <Card>
    <div className="flex items-start gap-3">
      <Icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
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
    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
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
        <span className="font-medium text-gray-800 dark:text-gray-100">
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
    // why: bez backend-a – otvori klijent sa predefinisanim subject/body
    const subject = encodeURIComponent("GymMaster Newsletter Subscribe");
    const body = encodeURIComponent(
      `Please subscribe this email: ${email}\n\nThanks!`
    );
    window.location.href = `mailto:bokigolic32@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* HERO */}
      <section className="relative text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold"
        >
          GymMaster — About & Roadmap
        </motion.h1>
        <p className="mt-3 text-lg opacity-90 max-w-2xl mx-auto">
          Train smarter with a clean UX, strong data, and tools that keep you
          consistent.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-50"
          >
            Start Training <Rocket className="w-4 h-4" />
          </Link>
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900/30 text-white font-semibold rounded-lg shadow hover:bg-blue-900/50"
          >
            Try Generator <Flame className="w-4 h-4" />
          </Link>
        </div>
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
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>
      </Section>

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
                  <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 grid place-items-center text-gray-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {m.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {m.role}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {m.links?.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <l.icon className="w-3.5 h-3.5" />
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
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

      {/* Newsletter / Contact (mailto to your email) */}
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
          className="inline-block px-6 py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
        >
          Start Training 🚀
        </Link>
      </div>
    </div>
  );
}
