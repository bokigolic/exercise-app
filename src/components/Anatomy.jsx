import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import PageShell from "./layout/PageShell";

/* util */
const cn = (...c) => c.filter(Boolean).join(" ");
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const words = (s) =>
  (Array.isArray(s) ? s.join(" ") : s || "").split(/\s+/).filter(Boolean)
    .length;
const estimateReadMin = (w, wpm = 220) => Math.max(1, Math.round(w / wpm));

/* icons (inline) */
const icons = {
  book: (p) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15h-9.5A2.5 2.5 0 0 0 8 21.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M8 3.5v15" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  layers: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M12 3 3 8l9 5 9-5-9-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  tune: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M4 6h10M4 12h16M4 18h8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="16" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  dumbbell: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M2 9v6M6 7v10M10 11v2M14 11v2M18 7v10M22 9v6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M6 11h12v2H6z" fill="currentColor" />
    </svg>
  ),
  moon: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M21 12.8A8.5 8.5 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  bolt: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M13 2 3 13h7l-1 9 11-13h-7V2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M12 21s-7-4.4-9.5-7.9C.6 10.9 2 6.5 6 6.5c2.3 0 3.6 1.2 4 2.3.4-1.1 1.7-2.3 4-2.3 4 0 5.4 4.4 3.5 6.6C19 16.6 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M16 14a4 4 0 1 1 7 0" stroke="currentColor" strokeWidth="1.6" />
      <path d="M1 14a4 4 0 1 1 7 0" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 20a8.5 8.5 0 0 1 17 0"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="m12 3 2.9 6 6.6.9-4.8 4.5 1.2 6.6L12 18.7 6.1 21l1.2-6.6L2.5 9.9l6.6-.9L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  starFill: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M12 3l2.9 6 6.6.9-4.8 4.5 1.2 6.6L12 18.7 6.1 21l1.2-6.6L2.5 9.9l6.6-.9L12 3z"
        fill="currentColor"
      />
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  link: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M10 14a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-1 1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14 10a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7-7l1-1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
};

/* content (skraćena za primer – koristi tvoje SECTIONS iz prethodne verzije) */
const SECTIONS = [
  {
    id: "intro",
    icon: "book",
    title: "Introduction to Muscles",
    preview: "Muscles power movement, posture, breathing, and heat.",
    tags: ["basics", "health"],
    body: [
      "Muscles account for ~30–40% of body weight and underpin movement, stability, breathing mechanics, circulation, and thermoregulation.",
    ],
  },
  {
    id: "types",
    icon: "layers",
    title: "Types of Muscles",
    preview: "Skeletal, cardiac, and smooth muscles.",
    tags: ["basics", "physiology"],
    bullets: [
      "Skeletal — voluntary, attached to bones.",
      "Cardiac — involuntary, heart only.",
      "Smooth — involuntary, organs/vessels.",
    ],
  },
  {
    id: "structure",
    icon: "tune",
    title: "Muscle Structure",
    preview: "Fibers → myofibrils → sarcomeres (actin & myosin).",
    tags: ["physiology", "structure"],
    bullets: [
      "Sarcomere sliding-filament model.",
      "Connective sheaths: endo/peri/epi.",
      "Neuromuscular junction triggers contraction.",
    ],
  },
  {
    id: "hypertrophy",
    icon: "dumbbell",
    title: "How Muscles Grow",
    preview: "Overload + protein synthesis + recovery.",
    tags: ["training", "growth"],
    body: [
      "Progressive overload with adequate recovery drives hypertrophy; hormones support the process.",
    ],
  },
  {
    id: "nutrition",
    icon: "heart",
    title: "Nutrition & Muscles",
    preview: "1.6–2.2 g/kg protein; carbs fuel; hydrate.",
    tags: ["nutrition", "health"],
    bullets: [
      "Protein 1.6–2.2 g/kg/day",
      "Carbs refill glycogen",
      "Hydration ~30–35 ml/kg/day",
    ],
  },
  {
    id: "recovery",
    icon: "clock",
    title: "Recovery & Sleep",
    preview: "Growth happens outside the gym.",
    tags: ["recovery"],
    body: [
      "Deep sleep supports growth hormone and tissue repair; active recovery boosts blood flow.",
    ],
  },
];

/* toast */
function Toast({ text, onDone }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] rounded-xl bg-black/80 text-white text-sm px-3 py-2 shadow-lg"
          onAnimationComplete={() => setTimeout(onDone, 1500)}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* fancy card */
function FancyCard({ children, onClick, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useTransform(y, [0, 1], [8, -8]);
  const ry = useTransform(x, [0, 1], [-8, 8]);
  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = clamp((e.clientX - r.left) / r.width, 0, 1);
    const py = clamp((e.clientY - r.top) / r.height, 0, 1);
    x.set(px);
    y.set(py);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0.5);
        y.set(0.5);
      }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      className={cn("relative rounded-2xl p-px cursor-pointer", className)}
      onClick={onClick}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 via-blue-500/20 to-emerald-500/20 blur-[2px]" />
      <div className="relative rounded-[1rem] bg-white/5 ring-1 ring-white/10">
        <div
          className="pointer-events-none absolute inset-0 rounded-[1rem]"
          style={{
            background: `radial-gradient(600px circle at ${x.get() * 100}% ${
              y.get() * 100
            }%, rgba(255,255,255,.08), transparent 40%)`,
          }}
        />
        <div className="relative z-10 p-4">{children}</div>
      </div>
    </motion.div>
  );
}

/* card */
function CardItem({ section, onOpen, isFav, toggleFav }) {
  const Icon = icons[section.icon] || icons.book;
  return (
    <FancyCard onClick={() => onOpen(section.id)}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl p-2 bg-white/10 text-white">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white">{section.title}</h3>
          <p className="mt-1 text-sm text-slate-300 line-clamp-3">
            {section.preview}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {section.tags?.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 ring-1 ring-white/10"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(section.id);
          }}
          className="p-2 rounded-lg hover:bg-white/10"
          title={isFav ? "Remove favorite" : "Add favorite"}
        >
          {isFav ? (
            <icons.starFill className="w-4 h-4 text-amber-400" />
          ) : (
            <icons.star className="w-4 h-4 text-slate-300" />
          )}
        </button>
      </div>
      <div className="mt-3">
        <span className="text-xs px-2 py-1 rounded-lg bg-white/10 ring-1 ring-white/10 text-white">
          Read more
        </span>
      </div>
    </FancyCard>
  );
}

/* modal */
function Modal({
  section,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  toggleFav,
  isFav,
  showToast,
}) {
  const ref = useRef(null);
  const sc = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const el = sc.current;
    if (!el) return;
    const onScroll = () =>
      setProgress(
        Math.max(
          0,
          Math.min(1, el.scrollTop / (el.scrollHeight - el.clientHeight + 1))
        )
      );
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [section?.id]);

  const Icon = icons[section.icon] || icons.book;
  const w = words(section.body) + words(section.bullets);
  const readMin = estimateReadMin(w);
  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${section.id}`;
    navigator.clipboard?.writeText(url);
    showToast("Link copied");
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[720px] px-4 sm:px-0"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="overflow-hidden rounded-2xl bg-slate-900 text-slate-100 shadow-2xl ring-1 ring-white/10"
        >
          <div className="h-1 bg-transparent">
            <div
              className="h-1 bg-blue-600 transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="flex items-start gap-3 p-4 sm:p-5">
            <div className="shrink-0 mt-0.5 rounded-xl p-2 bg-white/10">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{readMin} min</span>
                  <button
                    onClick={() => toggleFav(section.id)}
                    className="p-2 rounded-lg hover:bg-white/10"
                    title={isFav ? "Remove favorite" : "Add favorite"}
                  >
                    {isFav ? (
                      <icons.starFill className="w-4 h-4 text-amber-400" />
                    ) : (
                      <icons.star className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                  <button
                    onClick={copyLink}
                    className="p-2 rounded-lg hover:bg-white/10"
                    title="Copy link"
                  >
                    <icons.link className="w-4 h-4 text-slate-300" />
                  </button>
                  <button
                    onClick={onClose}
                    className="ml-1 rounded-lg p-2 text-slate-300 hover:bg-white/10"
                    aria-label="Close"
                    title="Close"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                ref={sc}
                className="mt-2 max-h-[60vh] overflow-y-auto pr-1 space-y-2 text-sm leading-relaxed"
              >
                {section.body?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc list-inside space-y-1">
                    {section.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <button
                  onClick={onPrev}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/15"
                >
                  ← Prev
                </button>
                <span className="text-slate-400">
                  {index + 1} / {total}
                </span>
                <button
                  onClick={onNext}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/15"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Anatomy() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState(
    () => new Set(JSON.parse(localStorage.getItem("anatomy:favs") || "[]"))
  );
  const [activeId, setActiveId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("anatomy:favs", JSON.stringify([...favorites]));
  }, [favorites]);
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash?.slice(1);
      if (id && SECTIONS.some((s) => s.id === id)) setActiveId(id);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const allTags = useMemo(() => {
    const t = new Set();
    SECTIONS.forEach((s) => s.tags?.forEach((x) => t.add(x)));
    return ["all", ...t];
  }, []);
  const [activeTags, setActiveTags] = useState(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hasTags = activeTags.size > 0;
    return SECTIONS.filter((s) => {
      if (hasTags && !s.tags?.some((t) => activeTags.has(t))) return false;
      if (!q) return true;
      const hay = [
        s.title,
        s.preview,
        ...(s.body || []),
        ...(s.bullets || []),
        ...(s.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, activeTags]);

  const open = (id) => {
    setActiveId(id);
    history.replaceState(null, "", `#${id}`);
  };
  const close = () => {
    setActiveId(null);
    history.replaceState(null, "", " ");
  };
  const index = useMemo(
    () => filtered.findIndex((s) => s.id === activeId),
    [filtered, activeId]
  );
  const onPrev = () => {
    if (index === -1) return;
    const prev = (index - 1 + filtered.length) % filtered.length;
    open(filtered[prev].id);
  };
  const onNext = () => {
    if (index === -1) return;
    const next = (index + 1) % filtered.length;
    open(filtered[next].id);
  };
  const toggleFav = (id) => {
    setFavorites((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
    setToast((t) => (t ? t : "Updated favorites"));
  };
  const active = useMemo(
    () => SECTIONS.find((s) => s.id === activeId) || null,
    [activeId]
  );

  return (
    <PageShell>
      <section className="min-h-[70vh]">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Anatomy — Muscles: Complete Educational Guide
              </h1>
              <p className="text-sm text-slate-300">
                Tap a card to open a detailed modal.
              </p>
            </div>
            <div className="w-full sm:w-[420px] flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
                  <icons.search className="w-4 h-4" />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search: hypertrophy, protein, glycogen, sleep…"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-blue-500/70 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </header>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.map((t, i) => (
              <button
                key={t}
                onClick={() =>
                  setActiveTags((prev) => {
                    if (i === 0) return new Set();
                    const next = new Set(prev);
                    next.has(t) ? next.delete(t) : next.add(t);
                    return next;
                  })
                }
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs ring-1 transition",
                  (i === 0 && activeTags.size === 0) || activeTags.has(t)
                    ? "bg-blue-600 text-white ring-blue-700"
                    : "bg-white/10 ring-white/15 hover:bg-white/15"
                )}
              >
                {t}
              </button>
            ))}
            <span className="text-xs text-slate-400 self-center ml-auto">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Grid */}
          <motion.div
            layout
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={false}
          >
            {filtered.map((s) => (
              <CardItem
                key={s.id}
                section={s}
                onOpen={open}
                isFav={favorites.has(s.id)}
                toggleFav={toggleFav}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {active && index !== -1 && (
          <Modal
            section={active}
            index={index}
            total={filtered.length}
            onClose={close}
            onPrev={onPrev}
            onNext={onNext}
            toggleFav={toggleFav}
            isFav={favorites.has(active.id)}
            showToast={(t) => setToast(t)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <Toast text={toast} onDone={() => setToast("")} />
    </PageShell>
  );
}
