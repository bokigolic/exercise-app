// src/components/Anatomy3DInteractive.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ----------------------------------------------------------
   3D INTERACTIVE ANATOMY MODE – Dynamic Focus Edition
   Hover to preview • Click to explore full anatomy details
----------------------------------------------------------- */

export default function Anatomy3DInteractive() {
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  const muscles = [
    {
      id: "chest",
      name: "Chest (Pectoralis Major & Minor)",
      img: "/images/anatomy/chest-3d.png",
      gif: "/images/anatomy/chest-move.gif",
      function:
        "Responsible for pushing movements, horizontal adduction, and arm flexion.",
      origin: "Clavicle, sternum, and costal cartilages of ribs 1–6.",
      insertion: "Lateral lip of the bicipital groove of the humerus.",
      innervation: "Medial and lateral pectoral nerves (C5–T1).",
      action: "Arm adduction, flexion, and medial rotation.",
    },
    {
      id: "back",
      name: "Back (Latissimus Dorsi, Trapezius, Rhomboids)",
      img: "/images/anatomy/back-3d.png",
      gif: "/images/anatomy/back-move.gif",
      function: "Provides pulling strength, posture, and scapular stability.",
      origin: "Spinous processes of T7–L5, iliac crest, and inferior ribs.",
      insertion: "Intertubercular groove of the humerus.",
      innervation: "Thoracodorsal nerve (C6–C8).",
      action: "Arm extension, adduction, and internal rotation.",
    },
    {
      id: "shoulders",
      name: "Shoulders (Deltoids)",
      img: "/images/anatomy/shoulders-3d.png",
      gif: "/images/anatomy/shoulders-move.gif",
      function:
        "Allows lifting, abduction, and controlled rotation of the arm.",
      origin: "Clavicle, acromion, and spine of scapula.",
      insertion: "Deltoid tuberosity of humerus.",
      innervation: "Axillary nerve (C5–C6).",
      action: "Arm abduction, flexion, and extension.",
    },
    {
      id: "arms",
      name: "Arms (Biceps, Triceps, Forearms)",
      img: "/images/anatomy/arms-3d.png",
      gif: "/images/anatomy/arms-move.gif",
      function: "Control elbow flexion, extension, and wrist stabilization.",
      origin: "Biceps – scapula; Triceps – humerus and scapula.",
      insertion: "Biceps – radial tuberosity; Triceps – olecranon of ulna.",
      innervation: "Musculocutaneous & radial nerves.",
      action: "Elbow flexion (biceps) and extension (triceps).",
    },
    {
      id: "legs",
      name: "Legs (Quadriceps, Hamstrings, Glutes, Calves)",
      img: "/images/anatomy/legs-3d.png",
      gif: "/images/anatomy/legs-move.gif",
      function: "Power locomotion, support posture, and absorb impact.",
      origin: "Varies by group – pelvis, femur, tibia.",
      insertion: "Patella, tibial tuberosity, calcaneus (via Achilles tendon).",
      innervation: "Femoral, sciatic, and tibial nerves.",
      action: "Knee extension, hip flexion, and plantar flexion.",
    },
    {
      id: "core",
      name: "Core (Abdominals, Obliques, Lower Back)",
      img: "/images/anatomy/core-3d.png",
      gif: "/images/anatomy/core-move.gif",
      function: "Stabilizes trunk, protects organs, and transfers power.",
      origin: "Ribs 5–12, iliac crest, lumbar fascia.",
      insertion: "Linea alba, pubic crest, xiphoid process.",
      innervation: "Intercostal nerves (T7–T12).",
      action: "Trunk flexion, rotation, and spinal stabilization.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-blue-400 mb-10 text-center"
      >
        🧠 Interactive Muscle Atlas
      </motion.h2>

      <p className="text-center text-slate-300 text-lg max-w-3xl mx-auto mb-12">
        Tap or click a muscle group to explore its full anatomy — including{" "}
        <strong>origin</strong>, <strong>insertion</strong>,{" "}
        <strong>action</strong>, and <strong>innervation</strong>. Visualize
        structure and movement in one interactive view.
      </p>

      {/* 3D Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {muscles.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedMuscle(m)}
            className="group cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            <img
              src={m.img}
              alt={m.name}
              className="w-full h-48 object-contain rounded-lg mb-4 group-hover:scale-105 transition-transform duration-500"
            />
            <h3 className="text-xl font-bold text-white mb-2 text-center">
              {m.name}
            </h3>
            <p className="text-slate-400 text-sm text-center">{m.function}</p>
          </motion.div>
        ))}
      </div>

      {/* Focus Modal */}
      <AnimatePresence>
        {selectedMuscle && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMuscle(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-xl"
              >
                ✕
              </button>

              {/* Content */}
              <h3 className="text-2xl font-bold text-blue-400 mb-3 text-center">
                {selectedMuscle.name}
              </h3>

              <div className="flex flex-col items-center mb-4">
                <img
                  src={selectedMuscle.img}
                  alt={selectedMuscle.name}
                  className="w-64 h-64 object-contain rounded-xl border border-white/10 mb-4"
                />
                <img
                  src={selectedMuscle.gif}
                  alt="Movement demo"
                  className="w-56 h-56 object-contain rounded-lg border border-blue-500/20"
                />
              </div>

              <div className="space-y-2 text-slate-300 text-sm">
                <p>
                  <strong>Origin:</strong> {selectedMuscle.origin}
                </p>
                <p>
                  <strong>Insertion:</strong> {selectedMuscle.insertion}
                </p>
                <p>
                  <strong>Innervation:</strong> {selectedMuscle.innervation}
                </p>
                <p>
                  <strong>Action:</strong> {selectedMuscle.action}
                </p>
              </div>

              <motion.button
                onClick={() => setSelectedMuscle(null)}
                whileHover={{ scale: 1.05 }}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-10 text-center max-w-3xl mx-auto">
        “To study anatomy is to study life in motion — every fiber tells a story
        of strength, evolution, and purpose.”
      </blockquote>
    </section>
  );
}
