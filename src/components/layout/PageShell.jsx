// src/components/layout/PageShell.jsx
import React, { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Menu, X } from "lucide-react";

/* --------- Nav Item --------- */
function NavItem({ to, children, onClick }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block text-center text-[13px] font-semibold rounded-lg px-3 py-2 transition-all duration-200 truncate ${
        active
          ? "bg-blue-600 text-white shadow-md ring-1 ring-blue-500"
          : "text-slate-300 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </Link>
  );
}

/* --------- Footer --------- */
function DockFooter() {
  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-[9999]"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="
            relative flex items-center justify-between gap-3
            rounded-2xl sm:rounded-3xl px-3.5 sm:px-4 py-2
            bg-gradient-to-br from-white/10 via-white/5 to-white/10
            backdrop-blur-xl ring-1 ring-white/15 shadow-2xl
          "
        >
          <div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          />

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
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10">
            <a
              href="https://www.linkedin.com/in/bojan-golic/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-200 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8h4.55v14H.22V8zM8.13 8h4.36v2.08h.06c.61-1.15 2.11-2.37 4.34-2.37 4.64 0 5.49 3.05 5.49 7.02V22H17.7v-6.42c0-1.53-.03-3.5-2.14-3.5-2.14 0-2.47 1.67-2.47 3.39V22h-4.42V8z" />
              </svg>
              LinkedIn
            </a>
            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="text-xs text-slate-200 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 transition"
            >
              ↑ Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --------- PageShell Layout --------- */
export default function PageShell({ children }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const closeMenu = () => setOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-100 overflow-x-hidden">
      {/* HEADER */}
      <header
        className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10"
        style={{
          paddingTop: "max(6px, env(safe-area-inset-top))",
          overflow: "visible",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 relative">
            <Link
              to="/"
              onClick={closeMenu}
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
              <NavItem to="/exercises">Exercises</NavItem>
              <NavItem to="/generator">Workout Generator</NavItem>
              <NavItem to="/assistant">AI Assistant</NavItem>
              <NavItem to="/profile">My Profile</NavItem>
              <NavItem to="/about">About</NavItem>
            </nav>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen((v) => !v)}
              className={`md:hidden inline-flex items-center justify-center rounded-xl border border-white/15 text-white/90 hover:text-white hover:bg-white/10 transition mr-1.5 ${
                open ? "shadow-[0_0_10px_rgba(59,130,246,0.6)]" : ""
              }`}
              style={{ width: 44, height: 44 }}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              aria-controls={menuId}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div
          id={menuId}
          className={`md:hidden origin-top transition-all duration-300 ${
            open
              ? "opacity-100 scale-y-100 max-h-[340px] pointer-events-auto"
              : "opacity-0 scale-y-0 max-h-0 pointer-events-none"
          }`}
          style={{ transformOrigin: "top" }}
        >
          <nav className="mx-auto max-w-6xl px-4 sm:px-6 pb-2">
            <div className="grid gap-[6px]">
              {[
                { to: "/", label: "Home" },
                { to: "/hub", label: "Fitness Hub" },
                { to: "/exercises", label: "Exercises" },
                { to: "/generator", label: "Workout Generator" },
                { to: "/assistant", label: "AI Assistant" },
                { to: "/profile", label: "My Profile" },
                { to: "/about", label: "About" },
              ].map((link) => (
                <NavItem key={link.to} to={link.to} onClick={closeMenu}>
                  <div className="w-full px-3 py-[7px] rounded-md bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-[13px] truncate">
                    {link.label}
                  </div>
                </NavItem>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="pb-24 sm:pb-28">{children}</main>

      {/* FOOTER */}
      <DockFooter />
    </div>
  );
}
