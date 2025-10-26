// src/components/MuscleLayerMode.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ----------------------------------------------------------
   MUSCLE LAYER MODE — Superficial / Intermediate / Deep
   Explore layered anatomy interactively
----------------------------------------------------------- */

export default function MuscleLayerMode() {
  const [activeLayer, setActiveLayer] = useState("superficial");

  const layers = {
    superficial: {
      title: "Superficial Muscles (Surface Layer)",
      img: "/images/anatomy/layers-superficial.png",
      desc: `These are the muscles visible on the body surface — responsible for
      major body contours and movements. They include muscles like the
      pectoralis major, deltoids, rectus abdominis, and trapezius.`,
      details: [
        "Visible in physique and motion.",
        "Provide primary strength and movement.",
        "Cover deeper stabilizing structures.",
        "Engage during compound lifts and dynamic actions.",
      ],
      examples: [
        "Pectoralis Major",
        "Deltoid",
        "Rectus Abdominis",
        "Trapezius",
      ],
    },
    intermediate: {
      title: "Intermediate Muscles (Middle Layer)",
      img: "/images/anatomy/layers-intermediate.png",
      desc: `This layer lies beneath the surface muscles, aiding stability and
      coordination. These muscles often control precise movements and maintain
      posture during heavy actions.`,
      details: [
        "Stabilize major joints and assist surface movers.",
        "Bridge the connection between superficial and deep layers.",
        "Include many synergists (helper muscles).",
        "Highly active in endurance and posture training.",
      ],
      examples: [
        "Rhomboids",
        "Serratus Anterior",
        "Internal Oblique",
        "Erector Spinae",
      ],
    },
    deep: {
      title: "Deep Muscles (Core Layer)",
      img: "/images/anatomy/layers-deep.png",
      desc: `These are the foundation muscles — close to bones and joints. They
      stabilize, support, and protect internal structures while forming the
      core of strength and mobility.`,
      details: [
        "Smallest but most vital for spinal and joint health.",
        "Include postural stabilizers and rotator cuff muscles.",
        "Crucial for fine-tuned movement control.",
        "Trainable via low-weight, slow-tempo, stabilizing exercises.",
      ],
      examples: [
        "Multifidus",
        "Transversus Abdominis",
        "Rotator Cuff Group",
        "Pelvic Floor Muscles",
      ],
    },
  };

  const layer = layers[activeLayer];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-blue-400 mb-10 text-center"
      >
        🩻 Muscle Layer Visualization Mode
      </motion.h2>

      <p className="text-center text-slate-300 text-lg max-w-3xl mx-auto mb-10">
        Explore the muscular system in layers — from visible surface structures
        to deep stabilizing cores. Each layer reveals how anatomy builds
        strength, movement, and protection.
      </p>

      {/* LAYER SWITCHER */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {Object.keys(layers).map((key) => (
          <button
            key={key}
            onClick={() => setActiveLayer(key)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeLayer === key
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            {layers[key].title.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* LAYER DISPLAY */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLayer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">{layer.title}</h3>
          <img
            src={layer.img}
            alt={layer.title}
            className="mx-auto w-full max-w-3xl rounded-xl border border-white/10 shadow-lg mb-6 hover:scale-105 transition-transform duration-500"
          />
          <p className="text-slate-400 max-w-3xl mx-auto mb-6">{layer.desc}</p>

          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-4xl mx-auto mb-6">
            {layer.details.map((d, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
              >
                <p className="text-slate-300 text-sm">{d}</p>
              </div>
            ))}
          </div>

          <p className="text-slate-400 text-sm italic mb-4">
            <strong>Key Muscles:</strong> {layer.examples.join(", ")}
          </p>
        </motion.div>
      </AnimatePresence>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-10 text-center max-w-3xl mx-auto">
        “From surface power to deep stability — true strength begins within the
        deepest layers of the human body.”
      </blockquote>
    </section>
  );
}
