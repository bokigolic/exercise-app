// src/components/Anatomy.jsx
import React, { useRef } from "react";
import { motion } from "framer-motion";

/* ----------------------------------------------------------
   ANATOMY — SCIENTIFIC & PRACTICAL EDITION
   Human muscle anatomy, physiology, biomechanics, and training.
   Latin + English terms • No images • Real-world applications
----------------------------------------------------------- */

export default function Anatomy() {
  const sections = {
    overview: useRef(null),
    structure: useRef(null),
    fibers: useRef(null),
    architecture: useRef(null),
    physiology: useRef(null),
    nutrition: useRef(null),
    imbalances: useRef(null),
    applied: useRef(null),
    conclusion: useRef(null),
  };

  const scrollTo = (key) =>
    sections[key].current?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-slate-200 leading-relaxed">
      {/* ==================== NAVBAR ==================== */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10 p-3 flex flex-wrap gap-2 justify-center text-sm sm:text-base shadow-lg">
        {[
          ["Overview", "overview"],
          ["Structure", "structure"],
          ["Fiber Types", "fibers"],
          ["Architecture", "architecture"],
          ["Physiology", "physiology"],
          ["Nutrition", "nutrition"],
          ["Imbalances", "imbalances"],
          ["Applied Anatomy", "applied"],
          ["Conclusion", "conclusion"],
        ].map(([label, key]) => (
          <button
            key={key}
            onClick={() => scrollTo(key)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow transition-all"
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ==================== 1. OVERVIEW ==================== */}
      <Section
        refObj={sections.overview}
        title="Overview — The Muscular System"
        color="blue"
      >
        <p className="text-slate-300 mb-4">
          The human muscular system (<em>Systema Musculorum</em>) consists of
          more than <strong>600 skeletal muscles</strong>. They allow movement,
          maintain posture, and generate heat. Muscles are the engines of the
          human body — converting chemical energy (ATP) into mechanical power.
        </p>
        <p className="text-slate-400">
          Muscles are classified into three types:
          <ul className="list-disc ml-6 mt-2">
            <li>
              <strong>Skeletal (Striated, Voluntary):</strong> controls
              conscious movements.
            </li>
            <li>
              <strong>Smooth (Visceral, Involuntary):</strong> lines organs and
              vessels.
            </li>
            <li>
              <strong>Cardiac (Myocardial):</strong> unique to the heart.
            </li>
          </ul>
        </p>
        <Tip>
          💡 <strong>Fun fact:</strong> Around 40–45% of your body mass is made
          up of muscle tissue.
        </Tip>
      </Section>

      {/* ==================== 2. STRUCTURE ==================== */}
      <Section
        refObj={sections.structure}
        title="Structure & Layers — Muscle Anatomy"
        color="sky"
      >
        <p className="text-slate-300 mb-4">
          Each skeletal muscle is composed of thousands of muscle fibers (
          <em>myofibrillae</em>) organized into bundles called fascicles. Every
          fiber contains <em>sarcomeres</em> — the basic functional units of
          contraction.
        </p>
        <ul className="list-disc ml-6 text-slate-400 mb-4">
          <li>
            <strong>Epimysium:</strong> outer sheath surrounding the whole
            muscle.
          </li>
          <li>
            <strong>Perimysium:</strong> wraps each fascicle (bundle of fibers).
          </li>
          <li>
            <strong>Endomysium:</strong> surrounds individual muscle fibers.
          </li>
        </ul>
        <p className="text-slate-400">
          Each muscle fiber contains proteins: <em>actin (thin filament)</em>{" "}
          and <em>myosin (thick filament)</em>, which slide to produce
          contraction — known as the <strong>Sliding Filament Theory</strong>.
        </p>
        <Tip>
          ⚙️ <strong>Remember:</strong> calcium (Ca²⁺) and ATP are the key
          triggers of contraction.
        </Tip>
      </Section>

      {/* ==================== 3. FIBER TYPES ==================== */}
      <Section
        refObj={sections.fibers}
        title="Muscle Fiber Types (Typi Fibrarum Musculorum)"
        color="violet"
      >
        <p className="text-slate-300 mb-4">
          Human muscles contain a mix of different fiber types, each adapted to
          specific functions and energy systems.
        </p>
        <ul className="list-disc ml-6 text-slate-400 mb-4">
          <li>
            <strong>Type I (Slow Twitch / Red Fibers):</strong> oxidative,
            fatigue-resistant; rich in mitochondria. Dominant in endurance
            athletes.
          </li>
          <li>
            <strong>Type IIa (Fast Oxidative):</strong> a hybrid type — balance
            between power and stamina. Trainable through resistance and interval
            training.
          </li>
          <li>
            <strong>Type IIb / IIx (Fast Glycolytic):</strong> explosive,
            strong, but fatigue quickly. Used in sprints and max lifts.
          </li>
        </ul>
        <Tip>
          🧠 <strong>Training effect:</strong> With consistent resistance
          training, some Type IIx fibers convert to Type IIa — improving
          muscular endurance.
        </Tip>
      </Section>

      {/* ==================== 4. ARCHITECTURE ==================== */}
      <Section
        refObj={sections.architecture}
        title="Muscle Architecture & Function"
        color="purple"
      >
        <p className="text-slate-300 mb-4">
          The arrangement of fibers affects force, speed, and movement range.
        </p>
        <ul className="list-disc ml-6 text-slate-400 space-y-2">
          <li>
            <strong>Fusiform:</strong> long, parallel fibers (e.g.,{" "}
            <em>Biceps Brachii</em> — Arm flexor).
          </li>
          <li>
            <strong>Pennate:</strong> short fibers angled to the tendon, higher
            strength (e.g., <em>Gastrocnemius</em> — Calf).
          </li>
          <li>
            <strong>Convergent:</strong> broad origin, narrow insertion (e.g.,{" "}
            <em>Pectoralis Major</em> — Chest).
          </li>
          <li>
            <strong>Circular:</strong> control openings (e.g.,{" "}
            <em>Orbicularis Oculi</em> — Eye).
          </li>
        </ul>
        <Tip>
          🎯 <strong>Practical tip:</strong> Understand architecture to choose
          exercises that target full movement range (e.g. incline vs flat press
          changes fiber recruitment in the chest).
        </Tip>
      </Section>

      {/* ==================== 5. PHYSIOLOGY ==================== */}
      <Section
        refObj={sections.physiology}
        title="Training Physiology & Adaptation"
        color="blue"
      >
        <p className="text-slate-300 mb-4">
          Muscle adaptation follows three key mechanisms:{" "}
          <strong>tension</strong>, <strong>metabolic stress</strong>, and{" "}
          <strong>microtrauma</strong>.
        </p>
        <ul className="list-disc ml-6 text-slate-400">
          <li>
            <strong>Sarcomeric Hypertrophy:</strong> increase in contractile
            proteins → strength.
          </li>
          <li>
            <strong>Sarcoplasmic Hypertrophy:</strong> increase in cell fluid
            and glycogen → size and endurance.
          </li>
          <li>
            <strong>Neural Adaptation:</strong> improved motor unit recruitment
            and coordination.
          </li>
        </ul>
        <Tip>
          💡 <strong>Science says:</strong> Progressive overload + sleep +
          protein synthesis = sustainable hypertrophy.
        </Tip>
      </Section>

      {/* ==================== 6. NUTRITION ==================== */}
      <Section
        refObj={sections.nutrition}
        title="Nutrition, Hormones & Recovery"
        color="emerald"
      >
        <p className="text-slate-300 mb-4">
          Proper nutrition supports muscular repair, energy production, and
          hormonal balance.
        </p>
        <ul className="list-disc ml-6 text-slate-400">
          <li>
            <strong>Protein:</strong> 1.8–2.2 g/kg body weight for growth.
          </li>
          <li>
            <strong>Carbohydrates:</strong> replenish glycogen and reduce
            cortisol.
          </li>
          <li>
            <strong>Fats:</strong> maintain testosterone and joint health.
          </li>
          <li>
            <strong>Micronutrients:</strong> magnesium, zinc, vitamin D, and
            omega-3 are essential.
          </li>
        </ul>
        <Tip>
          💤 <strong>Pro Tip:</strong> Muscles grow when you rest — not during
          training.
        </Tip>
      </Section>

      {/* ==================== 7. IMBALANCES ==================== */}
      <Section
        refObj={sections.imbalances}
        title="Muscle Imbalances & Injury Prevention"
        color="amber"
      >
        <p className="text-slate-300 mb-4">
          Repetitive patterns and poor posture can lead to asymmetry. Balanced
          programming prevents chronic issues.
        </p>
        <ul className="list-disc ml-6 text-slate-400 mb-4">
          <li>Chest overpowering back → shoulder rounding.</li>
          <li>Strong quads / weak hamstrings → knee instability.</li>
          <li>Weak glutes / tight hip flexors → anterior pelvic tilt.</li>
        </ul>
        <Tip>
          🩻 <strong>Prevention:</strong> train antagonists, stretch, and use
          unilateral exercises to correct imbalances.
        </Tip>
      </Section>

      {/* ==================== 8. APPLIED ANATOMY ==================== */}
      <Section
        refObj={sections.applied}
        title="Applied Anatomy in Exercise Science"
        color="indigo"
      >
        <p className="text-slate-300 mb-4">
          Understanding origin (<em>Origo</em>) and insertion (<em>Insertio</em>
          ) improves form and focus.
        </p>
        <ul className="list-disc ml-6 text-slate-400">
          <li>
            <em>Pectoralis Major</em> — Clavicle & sternum → humerus → performs
            adduction & flexion (press movements).
          </li>
          <li>
            <em>Latissimus Dorsi</em> — T7–L5 → humerus → extension & adduction
            (pull movements).
          </li>
          <li>
            <em>Rectus Femoris</em> — pelvis → tibia → knee extension & hip
            flexion (squat, leg raise).
          </li>
        </ul>
        <Tip>
          🧩 <strong>Application:</strong> Adjust grip, angle, or stance to
          match muscle fiber direction for maximum activation.
        </Tip>
      </Section>

      {/* ==================== 9. CONCLUSION ==================== */}
      <Section
        refObj={sections.conclusion}
        title="Conclusion — The Art of Understanding the Body"
        color="blue"
      >
        <p className="text-slate-300 text-lg text-center max-w-3xl mx-auto mb-8">
          A strong body is built not only in the gym — but through knowledge of
          its mechanisms, recovery, and balance.
        </p>
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-6 text-center max-w-3xl mx-auto">
          “Knowledge of anatomy transforms exercise from repetition to mastery.”
        </blockquote>
        <div className="flex justify-center mt-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold shadow-lg transition"
          >
            ↑ Back to Top
          </button>
        </div>
      </Section>
    </section>
  );
}

/* ----------------------------------------------------------
   SUBCOMPONENTS
----------------------------------------------------------- */
function Section({ refObj, title, color, children }) {
  return (
    <motion.section
      ref={refObj}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-20"
    >
      <h2
        className={`text-3xl font-bold text-${color}-400 text-center mb-6 capitalize`}
      >
        {title}
      </h2>
      <div>{children}</div>
    </motion.section>
  );
}

function Tip({ children }) {
  return (
    <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-300 italic">
      {children}
    </div>
  );
}
