// src/App.jsx
import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import PageShell from "./components/layout/PageShell";

// Lazy chunks
const Home = lazy(() => import("./components/Home"));
const About = lazy(() => import("./components/About"));
const FitnessHub = lazy(() => import("./components/FitnessHub"));
const WorkoutGenerator = lazy(() =>
  import("./components/WorkoutGenerator.jsx")
);
const Anatomy = lazy(() => import("./components/Anatomy.jsx"));

// 🧠 NEW — AI Assistant component (lazy import)
const AIWorkoutAssistant = lazy(() =>
  import("./components/AIWorkoutAssistant.jsx")
);

// Scroll + hash support
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);
  return null;
}

// Minimal loader
function PageLoader() {
  return (
    <div className="py-16 grid place-items-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading…</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />

      {/* Global dark shell (logo, navbar, footer, bg) */}
      <PageShell>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anatomy" element={<Anatomy />} />
            <Route path="/hub" element={<FitnessHub />} />
            <Route path="/generator" element={<WorkoutGenerator />} />
            <Route path="/about" element={<About />} />

            {/* 🧠 NEW ROUTE: AI Assistant */}
            <Route path="/assistant" element={<AIWorkoutAssistant />} />

            {/* Legacy redirect */}
            <Route
              path="/workout-generator"
              element={<Navigate to="/generator" replace />}
            />

            {/* 404 → Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </PageShell>
    </BrowserRouter>
  );
}
