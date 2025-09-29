// src/pages/About.jsx
import { motion } from "framer-motion";
import { Dumbbell, HeartPulse, Users, Rocket } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Banner */}
      <section className="relative text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold"
        >
          About GymMaster
        </motion.h1>
        <p className="mt-3 text-lg opacity-90 max-w-2xl mx-auto">
          A modern exercise library built to help you train smarter, stay
          motivated, and track your progress in style.
        </p>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          <Dumbbell className="w-20 h-20 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              GymMaster was created with one goal: to make fitness accessible
              and fun for everyone. Whether you're just starting out or are an
              advanced athlete, we bring exercises, instructions, and visuals
              together in a sleek experience.
            </p>
          </div>
        </motion.div>

        {/* Health */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row-reverse items-center gap-8"
        >
          <HeartPulse className="w-20 h-20 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
              Health First
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Every exercise is carefully curated with instructions and images
              to help you avoid injuries, improve form, and maximize results.
            </p>
          </div>
        </motion.div>

        {/* Community */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          <Users className="w-20 h-20 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
              Built for Community
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              GymMaster is more than just an app. It's a growing community of
              people who want to support, learn, and grow stronger together.
            </p>
          </div>
        </motion.div>

        {/* Future Vision */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row-reverse items-center gap-8"
        >
          <Rocket className="w-20 h-20 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
              Our Future Vision
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We're working on AI-driven workout suggestions, smart progress
              tracking, and personalized routines to take your training to the
              next level. GymMaster is not just about now — it’s about the
              future of fitness.
            </p>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { value: "500+", label: "Exercises" },
            { value: "10", label: "Muscle Groups" },
            { value: "∞", label: "Combinations" },
            { value: "1", label: "Community" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {stat.value}
              </p>
              <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Author Spotlight */}
        <div className="text-center space-y-4">
          <div className="flex justify-center"> </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200"></h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto"></p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 mt-6 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Start Training 🚀
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;
