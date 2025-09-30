// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  const linkBase =
    "px-3 py-2 rounded-lg text-sm transition-colors hover:text-blue-400";
  const linkActive = "text-white bg-white/10";

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "backdrop-blur-md shadow-sm border-b border-white/10",
        "bg-[rgba(10,10,12,0.75)]"
      )}
      style={{
        paddingTop: "max(6px, env(safe-area-inset-top))", // spušta sadržaj ispod notcha
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-3 py-2">
        {/* Brand */}
        <NavLink
          to="/"
          className="font-semibold text-base tracking-wide text-white"
          style={{ letterSpacing: "0.3px" }}
        >
          FitMotion
        </NavLink>

        {/* Hamburger — spušten i veći tap-target */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/15 text-white/90 hover:text-white hover:bg-white/10"
          style={{ width: 42, height: 42, transform: "translateY(4px)" }} // spuštanje od ruba
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="primary-nav"
        >
          ☰
        </button>

        {/* Desktop nav */}
        <nav
          id="primary-nav"
          className="hidden md:flex items-center gap-2 text-white/80"
        >
          {[
            { to: "/", label: "Home", end: true },
            { to: "/hub", label: "Hub" },
            { to: "/generator", label: "Generator" },
            { to: "/about", label: "About" },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => cn(linkBase, isActive && linkActive)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "md:hidden transition-[max-height] duration-300 overflow-hidden",
          open ? "max-h-60" : "max-h-0"
        )}
      >
        <nav className="px-3 pb-3 grid gap-2 text-white/90">
          {[
            { to: "/", label: "Home", end: true },
            { to: "/hub", label: "Hub" },
            { to: "/generator", label: "Generator" },
            { to: "/about", label: "About" },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "px-3 py-3 rounded-lg bg-white/5 hover:bg-white/10",
                  isActive && "bg-white/15 text-white"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
