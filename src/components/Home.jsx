// src/components/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Brain, Zap, Activity, Bot, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-100">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/hero/gym-dark.jpg')] bg-cover bg-center opacity-25"
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-32 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Dumbbell className="w-8 h-8 text-blue-500" />
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Train Smarter. Learn Deeper.
              </h1>
            </div>
            <p className="max-w-2xl mx-auto text-slate-300 text-lg mb-8">
              Explore human anatomy, build personalized workouts, and get
              real-time coaching with AI — all in one powerful platform.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/exercises"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md"
              >
                🔍 Explore Exercises
              </Link>
              <Link
                to="/assistant"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium"
              >
                🤖 AI Workout Assistant
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-black" />
      </section>

      {/* === 3 MINI SEKCIJE U BLOK STILU BEZ SLIKA === */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 sm:px-8 py-20 border-t border-white/10"
      >
        <div className="grid md:grid-cols-3 gap-8">
          {/* 1️⃣ Learn the Human Body */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            className="bg-white/5 hover:bg-white/10 rounded-2xl p-6 ring-1 ring-white/10 shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">
                Learn the Human Body
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Discover how every muscle works, how it grows, and how to train it
              safely. Dive deep into anatomy lessons with labeled diagrams,
              visual explanations, and real sports science.
            </p>
            <Link
              to="/anatomy"
              className="inline-block px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition"
            >
              🧬 Open Anatomy Guide
            </Link>
          </motion.div>

          {/* 2️⃣ Build Your Workout */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            className="bg-white/5 hover:bg-white/10 rounded-2xl p-6 ring-1 ring-white/10 shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">
                Build Your Workout
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Choose your goal, filter by muscle groups, and instantly generate
              personalized workout plans. Save, track, and optimize your
              sessions using science-backed methods.
            </p>
            <Link
              to="/generator"
              className="inline-block px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition"
            >
              ⚙️ Open Workout Generator
            </Link>
          </motion.div>

          {/* 3️⃣ AI Coach */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            className="bg-white/5 hover:bg-white/10 rounded-2xl p-6 ring-1 ring-white/10 shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <Bot className="w-8 h-8 text-emerald-400" />
              <h3 className="text-xl font-semibold text-white">
                Your Personal AI Coach
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Ask your AI coach anything — from exercise form and nutrition to
              supplement timing. Get smart, evidence-based answers in seconds,
              anytime you train.
            </p>
            <Link
              to="/assistant"
              className="inline-block px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition"
            >
              🤖 Chat with AI Assistant
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 4 — WHY BOKIGYM */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 sm:px-8 py-20 text-center"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-slate-300">
          <Feature
            icon={<Dumbbell />}
            title="600+ Exercises"
            text="Detailed guides, images, and muscle breakdowns."
          />
          <Feature
            icon={<Brain />}
            title="Anatomy Learning"
            text="Understand how every muscle contributes to strength."
          />
          <Feature
            icon={<Zap />}
            title="AI-Powered"
            text="Smart recommendations, progress insights, and Q&A."
          />
          <Feature
            icon={<Activity />}
            title="Workout Builder"
            text="Custom plans by muscle group, goal, and level."
          />
          <Feature
            icon={<Heart />}
            title="Recovery & Nutrition"
            text="Eat, rest, and grow with proper balance."
          />
          <Feature
            icon={<Bot />}
            title="24/7 Virtual Coach"
            text="Train with AI — anytime, anywhere."
          />
        </div>
      </motion.section>

      {/* SECTION 5 — QUOTE */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
        className="py-24 text-center border-t border-white/10"
      >
        <blockquote className="max-w-3xl mx-auto text-slate-300 text-lg italic leading-relaxed">
          “Discipline builds strength. Knowledge shapes it.”
        </blockquote>
        <p className="mt-4 text-slate-500 text-sm">— Gym Master AI</p>
      </motion.section>
    </div>
  );
}

/* --- Reusable section component --- */
function Section({ icon, title, text, button, link, img, reverse, gradient }) {
  return (
    <section
      className={`max-w-6xl mx-auto px-6 sm:px-8 py-20 border-t border-white/10 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={`grid md:grid-cols-2 gap-10 items-center ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white flex items-center gap-2">
            {icon} {title}
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">{text}</p>
          <Link
            to={link}
            className="inline-block px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition"
          >
            {button}
          </Link>
        </div>
        <div className="relative">
          <img
            src={img}
            alt={title}
            className="rounded-2xl ring-1 ring-white/10 shadow-lg object-cover"
            loading="lazy"
          />
          <div
            className={`absolute -inset-1 bg-gradient-to-tr ${gradient} to-transparent rounded-2xl blur-2xl -z-10`}
          />
        </div>
      </motion.div>
    </section>
  );
}

/* --- Reusable feature item --- */
function Feature({ icon, title, text }) {
  return (
    <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-6 hover:bg-white/10 transition">
      <div className="flex justify-center mb-3 text-blue-400">{icon}</div>
      <h3 className="font-semibold text-lg text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}
