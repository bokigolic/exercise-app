// src/components/layout/PageShell.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell } from "lucide-react";

/** why: jedinstven dark shell za sve stranice (header + footer + bg) */
const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={
        active ? "text-white font-semibold" : "text-slate-300 hover:text-white"
      }
    >
      {children}
    </Link>
  );
};

export default function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-100">
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-white/10 ring-1 ring-white/15 grid place-items-center">
              <Dumbbell className="w-4 h-4 text-white/90" />
            </div>
            <span className="font-extrabold tracking-tight">GymMaster</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <NavLink to="/">Home</NavLink>
            {/* was: /exercises → now points to /hub */}
            <NavLink to="/hub">Fitness Hub</NavLink>
            <NavLink to="/generator">Generator</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/anatomy">Anatomy</NavLink>
          </nav>
        </div>
      </header>

      {children}

      <footer className="mt-16 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400">
          © {new Date().getFullYear()} GymMaster • Built for clarity &
          consistency
        </div>
      </footer>
    </div>
  );
}
