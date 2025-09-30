// src/App.jsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
} from "react-router-dom";
import Footer from "./components/Footer";

// Lazy chunks (brži first load)
const Home = lazy(() => import("./components/Home"));
const About = lazy(() => import("./components/About"));
const FitnessHub = lazy(() => import("./components/FitnessHub"));
const WorkoutGenerator = lazy(() =>
  import("./components/WorkoutGenerator.jsx")
);

// why: vraća na vrh pri promeni rute + podržava #hash anchor skrol
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // sačekaj render pa skrol do elementa
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

// Minimal Loader fallback
function PageLoader() {
  return (
    <div className="py-16 grid place-items-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading…</p>
    </div>
  );
}

// Responsive Navbar
function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]); // close on navigation

  const linkBase = "px-3 py-2 rounded-lg transition-colors hover:text-blue-500";
  const linkActive =
    "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <NavLink
          to="/"
          className="font-bold text-xl text-blue-600 dark:text-blue-400"
        >
          FitMotion
        </NavLink>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <nav
          className={`${
            open ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-2 md:gap-6 text-gray-700 dark:text-gray-200`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/hub"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Hub
          </NavLink>
          <NavLink
            to="/generator"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Generator
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Navbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Hub & Generator */}
          <Route path="/hub" element={<FitnessHub />} />
          <Route path="/generator" element={<WorkoutGenerator />} />

          {/* Legacy redirect: fix “Try Generator” praznu stranu */}
          <Route
            path="/workout-generator"
            element={<Navigate to="/generator" replace />}
          />

          {/* 404 → Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <Footer />
    </BrowserRouter>
  );
}
