// src/components/AnatomyHub.jsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import Anatomy3DInteractive from "./Anatomy3DInteractive";
import MuscleLayerMode from "./MuscleLayerMode";

/* ----------------------------------------------------------
   ANATOMY HUB — ULTIMATE EDITION
   A complete educational system for human muscle anatomy,
   structure, physiology, nutrition, and interactive exploration.
----------------------------------------------------------- */

export default function AnatomyHub() {
  const sections = {
    overview: useRef(null),
    structure: useRef(null),
    fibers: useRef(null),
    training: useRef(null),
    nutrition: useRef(null),
    supplements: useRef(null),
    muscleatlas: useRef(null),
    layers: useRef(null),
    conclusion: useRef(null),
  };

  const scrollTo = (key) =>
    sections[key].current?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-slate-200 leading-relaxed">
      {/* ==================== NAVIGATION BAR ==================== */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10 p-3 flex flex-wrap gap-2 justify-center text-sm sm:text-base shadow-lg">
        {[
          ["Overview", "overview"],
          ["Structure", "structure"],
          ["Fiber Types", "fibers"],
          ["Training", "training"],
          ["Nutrition", "nutrition"],
          ["Supplements", "supplements"],
          ["Muscle Atlas", "muscleatlas"],
          ["Layers", "layers"],
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

      {/* ==================== SECTION 1: OVERVIEW ==================== */}
      <Section
        refObj={sections.overview}
        title="Human Muscular System Overview"
        color="blue"
      >
        <p className="text-slate-300 text-lg mb-6 text-center max-w-3xl mx-auto">
          The muscular system is the dynamic engine of the human body — a living
          network of over <strong>600 muscles</strong> working in perfect
          synchronization to produce motion, stability, and strength.
        </p>
        <p className="text-slate-400 mb-6 text-center max-w-3xl mx-auto">
          These muscles not only move bones but also circulate blood, maintain
          posture, and generate heat. Muscles convert chemical energy (
          <strong>ATP</strong>) into mechanical power — the foundation of all
          movement.
        </p>
        <CenteredImage
          src="/images/anatomy/full-body-muscles.png"
          alt="Full body muscular anatomy"
        />
        <Quote color="blue">
          “The muscle system is not just a collection of tissues — it’s a
          symphony of motion directed by the brain, fueled by chemistry, and
          perfected by repetition.”
        </Quote>
      </Section>

      {/* ==================== SECTION 2: STRUCTURE ==================== */}
      <Section
        refObj={sections.structure}
        title="Structure & Architecture of Muscles"
        color="sky"
      >
        <p className="text-slate-300 text-lg text-center mb-6 max-w-3xl mx-auto">
          Muscles are hierarchical masterpieces of biological engineering. From
          fibers to fascicles, each layer contributes to force, precision, and
          coordination.
        </p>
        <ul className="list-disc ml-6 text-slate-400 space-y-3 mb-6">
          <li>
            <strong>Epimysium:</strong> Outer sheath maintaining structure and
            force transmission.
          </li>
          <li>
            <strong>Perimysium:</strong> Surrounds fascicles, creating pathways
            for nerves and vessels.
          </li>
          <li>
            <strong>Endomysium:</strong> Encloses each fiber for nutrient
            exchange and elasticity.
          </li>
        </ul>
        <CenteredImage
          src="/images/anatomy/muscle-structure-diagram.png"
          alt="Muscle architecture diagram"
        />
      </Section>

      {/* ==================== SECTION 3: FIBER TYPES ==================== */}
      <Section
        refObj={sections.fibers}
        title="Muscle Fiber Types & Function"
        color="violet"
      >
        <div className="space-y-5 text-slate-400">
          <SubBlock title="🩸 Type I – Slow Twitch (Red Fibers)">
            Rich in mitochondria and capillaries, built for endurance and
            fatigue resistance. Ideal for marathoners and cyclists.
          </SubBlock>
          <SubBlock title="⚡ Type IIa – Fast Twitch (Intermediate)">
            Adaptable fibers for both power and endurance — trainable through
            resistance and conditioning.
          </SubBlock>
          <SubBlock title="🔥 Type IIb/X – Fast Twitch (White Fibers)">
            Explosive and powerful, but fatigue quickly. Activated during
            sprints and heavy lifts.
          </SubBlock>
        </div>
        <Quote color="purple">
          “Every human is born with a unique fiber composition — training shapes
          how you express it.”
        </Quote>
      </Section>

      {/* ==================== SECTION 4: TRAINING ==================== */}
      <Section
        refObj={sections.training}
        title="Training Physiology & Adaptation"
        color="blue"
      >
        <SubBlock title="🧠 Neural Adaptation">
          Early strength gains stem from improved motor unit recruitment. The
          nervous system learns efficiency before muscle size increases.
        </SubBlock>
        <SubBlock title="💪 Hypertrophy Mechanisms">
          Growth occurs via <strong>tension</strong>,{" "}
          <strong>metabolic stress</strong>, and <strong>microtrauma</strong>,
          followed by recovery.
        </SubBlock>
        <ul className="list-disc ml-6 text-slate-400 space-y-2 mb-6">
          <li>
            <strong>Sarcomeric Hypertrophy:</strong> Increases contractile
            proteins.
          </li>
          <li>
            <strong>Sarcoplasmic Hypertrophy:</strong> Expands cellular glycogen
            — “the pump”.
          </li>
        </ul>
        <CenteredImage
          src="/images/anatomy/hypertrophy-cycle.png"
          alt="Hypertrophy cycle"
        />
        <Quote color="blue">
          “Muscle growth is a biological negotiation — you stress it, it adapts,
          but only if you feed and rest it.”
        </Quote>
      </Section>

      {/* ==================== SECTION 5: NUTRITION ==================== */}
      <Section
        refObj={sections.nutrition}
        title="Nutrition, Hormones & Recovery"
        color="emerald"
      >
        <ul className="list-disc ml-6 text-slate-400 space-y-2 mb-6">
          <li>
            <strong>Protein:</strong> 1.8–2.2g/kg daily for repair and enzymes.
          </li>
          <li>
            <strong>Carbohydrates:</strong> Refill glycogen to prevent fatigue.
          </li>
          <li>
            <strong>Healthy Fats:</strong> Maintain hormones and joint health.
          </li>
          <li>
            <strong>Sleep:</strong> 7–9h enables growth hormone peaks.
          </li>
        </ul>
        <Quote color="emerald">
          “The strongest supplement isn’t in a bottle — it’s a full night’s
          sleep.”
        </Quote>
      </Section>

      {/* ==================== SECTION 6: SUPPLEMENTS ==================== */}
      <Section
        refObj={sections.supplements}
        title="Supplements & Ergogenic Aids"
        color="amber"
      >
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <Card
            title="Creatine Monohydrate"
            text="Boosts ATP energy and strength — 3–5g/day is proven effective."
          />
          <Card
            title="Beta-Alanine"
            text="Buffers lactic acid, delaying fatigue during high-intensity training."
          />
          <Card
            title="Whey Protein"
            text="Fast-digesting, leucine-rich — accelerates recovery post workout."
          />
          <Card
            title="Omega-3 & Vitamin D"
            text="Reduce inflammation and support hormonal and joint health."
          />
        </div>
        <p className="text-slate-400 text-center">
          Supplements are fine-tuning tools — discipline and nutrition remain
          the foundation.
        </p>
      </Section>

      {/* ==================== SECTION 7: INTERACTIVE 3D ATLAS ==================== */}
      <div ref={sections.muscleatlas}>
        <Anatomy3DInteractive />
      </div>

      {/* ==================== SECTION 8: LAYER MODE ==================== */}
      <div ref={sections.layers}>
        <MuscleLayerMode />
      </div>

      {/* ==================== SECTION 9: CONCLUSION ==================== */}
      <Section
        refObj={sections.conclusion}
        title="The Human Machine"
        color="indigo"
      >
        <p className="text-slate-300 text-lg text-center max-w-3xl mx-auto mb-8">
          The body is an adaptable system — powered by discipline and refined
          through understanding. To master it, study its design, feed it with
          intent, and recover with respect.
        </p>
        <Quote color="indigo">
          “Knowledge turns training into art. Anatomy is the map; your effort is
          the journey.”
        </Quote>
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
   REUSABLE UI COMPONENTS
----------------------------------------------------------- */

const Section = React.forwardRef(({ refObj, title, color, children }, ref) => (
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
));

function SubBlock({ title, children }) {
  return (
    <div className="mb-5">
      <h3 className="text-xl text-white font-semibold mb-1">{title}</h3>
      <p className="text-slate-400">{children}</p>
    </div>
  );
}

function Quote({ children, color }) {
  return (
    <blockquote
      className={`border-l-4 border-${color}-500 pl-4 italic text-slate-400 my-6 text-center max-w-3xl mx-auto`}
    >
      {children}
    </blockquote>
  );
}

function CenteredImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="rounded-xl border border-white/10 shadow-md my-6 w-full max-w-3xl mx-auto"
    />
  );
}

function Card({ title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
    >
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{text}</p>
    </motion.div>
  );
}
