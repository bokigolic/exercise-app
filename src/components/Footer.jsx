// src/components/Footer.jsx
import React, { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { SiGoogle } from "react-icons/si";

const cn = (...c) => c.filter(Boolean).join(" ");

function IconButton({ href, label, children, className = "" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 transition",
        className
      )}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  // smooth hide/show on scroll with threshold, passive listener
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const delta = y - lastY.current;
        const threshold = 16;
        const atTop = y < 80;
        const atBottom =
          window.innerHeight + y >= document.documentElement.scrollHeight - 80;

        if (atTop || delta < -threshold || atBottom) {
          // scrolling up, top, or near bottom → show
          if (!visible) setVisible(true);
        } else if (delta > threshold) {
          // scrolling down → hide
          if (visible) setVisible(false);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const year = new Date().getFullYear();

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 w-full z-40",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
        "border-t border-gray-200 dark:border-gray-700 shadow-lg",
        "transition-transform duration-500",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Left: Social */}
        <div className="flex gap-3">
          <IconButton href="https://github.com/bokigolic" label="GitHub">
            <Github size={16} />
          </IconButton>
          <IconButton
            href="https://www.linkedin.com/in/bojan-golic"
            label="LinkedIn"
            className="hover:bg-blue-700"
          >
            <Linkedin size={16} />
          </IconButton>
          <IconButton
            href="https://google.com"
            label="Google"
            className="hover:bg-red-600"
          >
            <SiGoogle size={16} />
          </IconButton>
        </div>

        {/* Center: Brand */}
        <div className="flex flex-col items-center">
          <img
            src="/icons/BG.png"
            alt="BG Logo"
            className="w-10 h-10 animate-spin"
            style={{ animationDuration: "6s" }} // fallback za custom spin-slow
          />
          <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">
            © {year} GymMaster — Built by BG
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <a
            href="mailto:bokigolic32@gmail.com?subject=GymMaster%20Contact"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            aria-label="Contact via email"
            title="Contact"
          >
            <Mail size={14} />
            Contact
          </a>
          <button
            onClick={scrollToTop}
            className="px-2 py-1 rounded-md text-xs bg-gray-900 text-white hover:bg-black/80"
            aria-label="Back to top"
            title="Back to top"
          >
            Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
