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

/* ---------- Lazy Chunks (Page Components) ---------- */
const Home = lazy(() => import("./components/Home.jsx"));
const Exercises = lazy(() => import("./components/Exercises.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const FitnessHub = lazy(() => import("./components/FitnessHub.jsx"));
const WorkoutGenerator = lazy(() =>
  import("./components/WorkoutGenerator.jsx")
);
const AIWorkoutAssistant = lazy(() =>
  import("./components/AIWorkoutAssistant.jsx")
);
const ProfilePage = lazy(() => import("./components/ProfilePage.jsx")); // ✅ NEW PAGE

/* ---------- Scroll + Hash Manager ---------- */
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

/* ---------- Minimal Loader ---------- */
function PageLoader() {
  return (
    <div className="py-16 grid place-items-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading…</p>
    </div>
  );
}

/* ---------- Main App ---------- */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />

      {/* 🌙 Global Shell (Header + Nav + Footer) */}
      <PageShell>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* 🌐 Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/hub" element={<FitnessHub />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/generator" element={<WorkoutGenerator />} />
            <Route path="/assistant" element={<AIWorkoutAssistant />} />
            <Route path="/profile" element={<ProfilePage />} /> {/* ✅ NEW */}
            <Route path="/about" element={<About />} />
            {/* 🔁 Redirects & Fallback */}
            <Route
              path="/workout-generator"
              element={<Navigate to="/generator" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </PageShell>
    </BrowserRouter>
  );
}
