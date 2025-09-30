// src/App.jsx  (samo zamena Navbara)
import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const Home = lazy(() => import("./components/Home"));
const About = lazy(() => import("./components/About"));
const FitnessHub = lazy(() => import("./components/FitnessHub"));
const WorkoutGenerator = lazy(() =>
  import("./components/WorkoutGenerator.jsx")
);

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
      <Navbar />

      {/* prostor za fiksni footer + safe-area */}
      <main
        className="min-h-[60vh] pb-24 md:pb-20 bg-[#0b0b0c]"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 80px)" }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hub" element={<FitnessHub />} />
            <Route path="/generator" element={<WorkoutGenerator />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/workout-generator"
              element={<Navigate to="/generator" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
