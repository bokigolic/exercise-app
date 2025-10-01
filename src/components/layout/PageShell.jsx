// src/components/layout/PageShell.jsx
import React, { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Menu, X } from "lucide-react";

/* --------- Nav --------- */
function NavItem({ to, children, onClick }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={
        active ? "text-white font-semibold" : "text-slate-300 hover:text-white"
      }
    >
      {children}
    </Link>
  );
}

/* --------- Footer (sticky dock) --------- */
function DockFooter() {
  return (
    <>
      {/* spacer za home indicator / overlaps */}
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
                bg-gradient-to-br from-white/7 via-white/5 to-white/3
                dark:from-white/7 dark:via-white/5 dark:to-white/3
                backdrop-blur-xl ring-1 ring-white/15 shadow-2xl
              "
            >
              {/* subtle glow ring */}
              <div
                className="absolute inset-0 rounded-2xl sm:rounded-3xl"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              />

              {/* left: logo + text */}
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    h-8 w-8 sm:h-9 sm:w-9 rounded-xl
                    bg-white/90 dark:bg-white
                    ring-1 ring-black/10 grid place-items-center
                    shadow-md
                  "
                >
                  {/* why: svetla kapsula iza crnog transparentnog loga zbog kontrasta */}
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

              {/* right: mini actions (optional) */}
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

              {/* hover accent underline */}
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-100">
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
              <div className="h-8 w-8 rounded-xl bg-white/10 ring-1 ring-white/15 grid place-items-center">
                <Dumbbell className="w-4.5 h-4.5 text-white/90" />
              </div>
              <span className="font-extrabold tracking-tight">Gym Master</span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-sm">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/hub">Fitness Hub</NavItem>
              <NavItem to="/generator">Generator</NavItem>
              <NavItem to="/about">About</NavItem>
              <NavItem to="/anatomy">Anatomy</NavItem>
            </nav>

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

        {/* Mobile sheet */}
        <div
          id={menuId}
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
            open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav
            className="mx-auto max-w-6xl px-4 sm:px-6 pb-3"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
            }}
          >
            <div className="grid gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/hub", label: "Fitness Hub" },
                { to: "/generator", label: "Generator" },
                { to: "/about", label: "About" },
                { to: "/anatomy", label: "Anatomy" },
              ].map((l) => (
                <NavItem key={l.to} to={l.to} onClick={() => setOpen(false)}>
                  <div className="w-full px-3 py-3 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10">
                    {l.label}
                  </div>
                </NavItem>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* PAGE CONTENT — dodan bottom padding da dock footer ne prekriva sadržaj */}
      <main className="pb-24 sm:pb-28">{children}</main>

      {/* STICKY DOCK FOOTER */}
      <DockFooter />
    </div>
  );
}
