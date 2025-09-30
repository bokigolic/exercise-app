// src/components/Navbar.jsx  (hardening: unique IDs + double-mount warn)
import React, { useEffect, useId, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const uid = useId(); // unique per mount

  useEffect(() => setOpen(false), [pathname]);

  // warn if accidentally mounted twice
  useEffect(() => {
    const flag = "nav-mounted";
    if (document.body.dataset[flag]) {
      // why: signal potential duplicate navbar render
      // eslint-disable-next-line no-console
      console.warn(
        "[Navbar] Mounted more than once — check PageShell/App/pages."
      );
    } else {
      document.body.dataset[flag] = "1";
    }
    return () => {
      delete document.body.dataset[flag];
    };
  }, []);

  const linkBase =
    "px-3 py-2 rounded-lg text-sm transition-colors hover:text-blue-400";
  const linkActive = "text-white bg-white/10";

  const menuId = `primary-nav-${uid}`;

  const LINKS = [
    { to: "/", label: "Home", end: true },
    { to: "/hub", label: "Hub" },
    { to: "/generator", label: "Generator" },
    { to: "/about", label: "About" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "backdrop-blur-md shadow-sm border-b border-white/10",
        "bg-[rgba(10,10,12,0.75)]"
      )}
      style={{ paddingTop: "max(6px, env(safe-area-inset-top))" }}
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

        {/* Hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/15 text-white/90 hover:text-white hover:bg-white/10"
          style={{ width: 42, height: 42, transform: "translateY(4px)" }}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls={menuId}
        >
          ☰
        </button>

        {/* Desktop nav */}
        <nav
          id={menuId}
          className="hidden md:flex items-center gap-2 text-white/80"
        >
          {LINKS.map((l) => (
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
        <nav
          className="px-3 pb-3 grid gap-2 text-white/90"
          aria-labelledby={menuId}
        >
          {LINKS.map((l) => (
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
