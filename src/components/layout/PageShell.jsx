// src/components/layout/PageShell.jsx
import React, { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Menu, X } from "lucide-react";

/* --------- NavItem --------- */
function NavItem({ to, children, onClick }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block text-center text-sm font-semibold rounded-lg px-3 py-2 transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-md ring-1 ring-blue-500"
          : "text-slate-300 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </Link>
  );
}

/* --------- Footer (Dock) --------- */
function DockFooter() {
  return (
    <>
      <div style={{ height: "calc(env(safe-area-inset-bottom) + 12px)" }} />

      <div
        className="fixed inset-x-0 bottom-0 z-40 pointer-events-none"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
        aria-hidden="true"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="pointer-events-auto">
            <div
              className="
                relative flex items-center justify-between gap-3
                rounded-2xl sm:rounded-3xl px-3.5 sm:px-4 py-2
                bg-gradient-to-br from-white/10 via-white/5 to-white/10
                backdrop-blur-xl ring-1 ring-white/15 shadow-2xl
              "
            >
              <div
                className="absolute inset-0 rounded-2xl sm:rounded-3xl"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              />

              {/* Left side */}
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    h-8 w-8 sm:h-9 sm:w-9 rounded-xl
                    bg-white/90 dark:bg-white
                    ring-1 ring-black/10 grid place-items-center
                    shadow-md
                  "
                >
                  <img
                    src="/icons/BG.png"
                    alt="BG logo"
                    className="h-6 w-6 object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-[12px] sm:text-sm text-slate-200">
                    Design &amp; Development by{" "}
                    <span className="font-semibold">BG</span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    © {new Date().getFullYear()} Gym Master • Built for clarity
                    &amp; consistency
                  </p>
                </div>
              </div>

              {/* Right side */}
              <div className="hidden sm:flex items-center gap-2">
                <a
                  href="mailto:bokigolic32@gmail.com"
                  className="text-xs text-slate-200 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 transition"
                >
                  Contact
                </a>
                <a
                  href="#top"
                  className="text-xs text-slate-200 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 transition"
                >
                  Back to top
                </a>
              </div>

              <div
                className="absolute -bottom-px left-2 right-2 h-px rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(59,130,246,0.35), rgba(168,85,247,0.35))",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* --------- PageShell --------- */
export default function PageShell({ children }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuId = useId();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-100 overflow-x-hidden">
      {/* HEADER */}
      <header
        className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10"
        style={{ paddingTop: "max(6px, env(safe-area-inset-top))" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 -ml-1 pr-2"
              style={{ minHeight: 44 }}
            >
              <div className="h-8 w-8 rounded-xl bg-blue-600/20 ring-1 ring-blue-500/40 grid place-items-center">
                <Dumbbell className="w-4.5 h-4.5 text-blue-400" />
              </div>
              <span className="font-extrabold tracking-tight text-white">
                Gym Master
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-5 text-sm">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/hub">Fitness Hub</NavItem>
              <NavItem to="/generator">Workout Generator</NavItem>
              <NavItem to="/about">About Us</NavItem>
              <NavItem to="/anatomy">Body Anatomy</NavItem>
              <NavItem to="/assistant">AI Assistant</NavItem>
            </nav>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center rounded-xl border border-white/15 text-white/90 hover:text-white hover:bg-white/10 transition"
              style={{ width: 44, height: 44 }}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              aria-controls={menuId}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          id={menuId}
          className={`md:hidden transition-all duration-300 ease-in-out ${
            open
              ? "max-h-[80vh] opacity-100 overflow-y-auto"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <nav
            className="mx-auto max-w-6xl px-4 sm:px-6 pb-4 backdrop-blur-md bg-black/70 border-t border-white/10"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
            }}
          >
            <div className="grid gap-2 pt-2">
              {[
                { to: "/", label: "Home" },
                { to: "/hub", label: "Fitness Hub" },
                { to: "/generator", label: "Workout Generator" },
                { to: "/about", label: "About Us" },
                { to: "/anatomy", label: "Body Anatomy" },
                { to: "/assistant", label: "AI Assistant" },
              ].map((link) => (
                <NavItem
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                >
                  <div className="w-full px-3 py-3 rounded-lg bg-white/5 hover:bg-white/10 hover:scale-[1.02] transition-all duration-200 ring-1 ring-white/10">
                    {link.label}
                  </div>
                </NavItem>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pb-24 sm:pb-28">{children}</main>

      {/* FOOTER */}
      <DockFooter />
    </div>
  );
}
