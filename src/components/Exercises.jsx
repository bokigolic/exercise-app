import { useEffect, useMemo, useRef, useState } from "react";
import exercisesData from "../data/exercises.json";
import Loader from "./Loader";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- helpers ---------- */
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
function normalizeLevel(lvl) {
  const v = (lvl || "").toString().toLowerCase();
  if (["expert", "adv"].includes(v)) return "advanced";
  if (["intermediate", "mid"].includes(v)) return "intermediate";
  if (["beginner", "novice", "beg"].includes(v)) return "beginner";
  return v;
}
const BODY_PARTS = [
  { value: "abdominals", label: "Abs" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "quadriceps", label: "Quads" },
  { value: "hamstrings", label: "Hamstrings" },
  { value: "glutes", label: "Glutes" },
  { value: "calves", label: "Calves" },
];
const LEVELS = [
  { value: "", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];
const SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "name", label: "Name (A–Z)" },
  { value: "level", label: "Level" },
];
const cn = (...c) => c.filter(Boolean).join(" ");
const keyForExercise = (ex) => ex.id ?? `${ex.name}|${ex.equipment ?? ""}`;

function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const q = query.toLowerCase();
  const idx = (text || "").toLowerCase().indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 dark:bg-yellow-600/40">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}
function ImgOrFallback({ src, alt, className = "w-1/2" }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div
        className={cn(
          className,
          "aspect-[4/3] rounded-lg bg-gray-100 dark:bg-gray-700 grid place-items-center text-gray-400"
        )}
      >
        🏋️
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={cn(className, "rounded-lg object-cover aspect-[4/3]")}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

/* ---------- tiny inline logo ---------- */
function BokiGymLogo({ className = "" }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg width="26" height="26" viewBox="0 0 24 24" className="text-blue-500">
        <path
          d="M3 12h18M7 8v8M17 8v8"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <rect
          x="1.5"
          y="9.5"
          width="3"
          height="5"
          rx="1.2"
          fill="currentColor"
        />
        <rect
          x="19.5"
          y="9.5"
          width="3"
          height="5"
          rx="1.2"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/* ---------- Quick View Modal (improved) ---------- */
function QuickViewModal({ open, onClose, exercise, onAdd, isSelected }) {
  const [index, setIndex] = useState(0);
  const startX = useRef(null);
  const deltaX = useRef(0);
  const closeBtnRef = useRef(null);

  const images = useMemo(
    () =>
      Array.isArray(exercise?.images) ? exercise.images.filter(Boolean) : [],
    [exercise]
  );

  useEffect(() => setIndex(0), [exercise]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (!images.length) return;
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length, onClose]);
  useEffect(() => {
    if (open) setTimeout(() => closeBtnRef.current?.focus(), 0);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  const onPointerDown = (e) => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    deltaX.current = 0;
  };
  const onPointerMove = (e) => {
    if (startX.current == null) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    deltaX.current = x - startX.current;
  };
  const onPointerUp = () => {
    if (startX.current == null) return;
    const swipe = deltaX.current;
    startX.current = null;
    deltaX.current = 0;
    if (Math.abs(swipe) > 60 && images.length > 1) {
      setIndex((i) =>
        swipe < 0
          ? (i + 1) % images.length
          : (i - 1 + images.length) % images.length
      );
    }
  };

  const next = () => images.length && setIndex((i) => (i + 1) % images.length);
  const prev = () =>
    images.length && setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      {open && exercise && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-live="polite"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${exercise.name} details`}
            className={cn(
              "relative z-[91] w-full max-w-4xl",
              "bg-[#111214] text-white rounded-2xl shadow-2xl ring-1 ring-white/10",
              "overflow-hidden"
            )}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-white/10 bg-white/5">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold truncate">
                  {exercise.name}
                </h3>
                <p className="text-xs text-white/60 truncate">
                  {exercise.category || "Exercise"} •{" "}
                  {normalizeLevel(exercise.level) || "—"}
                </p>
              </div>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div
                className="relative bg-white/5 md:border-r border-white/10"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onTouchStart={onPointerDown}
                onTouchMove={onPointerMove}
                onTouchEnd={onPointerUp}
              >
                <div className="p-4 sm:p-5">
                  {images.length > 0 ? (
                    <ImgOrFallback
                      src={`/exercises/${images[index]}`}
                      alt={exercise.name}
                      className="w-full"
                    />
                  ) : (
                    <ImgOrFallback
                      src={null}
                      alt={exercise.name}
                      className="w-full"
                    />
                  )}
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 w-9 h-9 grid place-items-center"
                    >
                      ‹
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 w-9 h-9 grid place-items-center"
                    >
                      ›
                    </button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setIndex(i)}
                          aria-label={`Go to image ${i + 1}`}
                          className={cn(
                            "w-2.5 h-2.5 rounded-full",
                            i === index ? "bg-white" : "bg-white/40"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] md:max-h-[80vh]">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="truncate">
                    <dt className="text-white/50">Equipment</dt>
                    <dd className="font-medium">{exercise.equipment || "—"}</dd>
                  </div>
                  <div className="truncate">
                    <dt className="text-white/50">Level</dt>
                    <dd className="font-medium">
                      {normalizeLevel(exercise.level) || "—"}
                    </dd>
                  </div>
                  {Array.isArray(exercise.primaryMuscles) &&
                    exercise.primaryMuscles.length > 0 && (
                      <div className="col-span-2">
                        <dt className="text-white/50">Primary</dt>
                        <dd className="font-medium">
                          {exercise.primaryMuscles.join(", ")}
                        </dd>
                      </div>
                    )}
                  {Array.isArray(exercise.secondaryMuscles) &&
                    exercise.secondaryMuscles.length > 0 && (
                      <div className="col-span-2">
                        <dt className="text-white/50">Secondary</dt>
                        <dd className="font-medium">
                          {exercise.secondaryMuscles.join(", ")}
                        </dd>
                      </div>
                    )}
                  {exercise.category && (
                    <div className="col-span-2">
                      <dt className="text-white/50">Category</dt>
                      <dd className="font-medium">{exercise.category}</dd>
                    </div>
                  )}
                </dl>
                {Array.isArray(exercise.instructions) &&
                  exercise.instructions.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-1.5">
                        Instructions
                      </p>
                      <ul className="list-disc list-inside space-y-1.5 text-sm text-white/90 max-h-40 overflow-auto pr-1">
                        {exercise.instructions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                <div className="mt-6 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onAdd(exercise)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm",
                      isSelected
                        ? "bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    )}
                  >
                    {isSelected ? "Added" : "Add to workout"}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/15"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Main Page ---------- */
function Exercises() {
  const [bodyPart, setBodyPart] = useState("abdominals");
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const searchDebounced = useDebouncedValue(search, 300);

  const [withinPart, setWithinPart] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const [exercises, setExercises] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gm.selected");
      if (raw) setSelected(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("gm.selected", JSON.stringify(selected));
    } catch {}
  }, [selected]);

  const [quick, setQuick] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 12;
  const listRef = useRef(null);

  const filteredSorted = useMemo(() => {
    const q = (searchDebounced || "").trim().toLowerCase();
    const lvl = normalizeLevel(level);
    let arr = exercisesData.slice();

    if (lvl) arr = arr.filter((ex) => normalizeLevel(ex.level) === lvl);

    if (q) {
      arr = arr.filter((ex) => {
        const name = (ex.name || "").toLowerCase();
        const prim = (ex.primaryMuscles || []).join(" ").toLowerCase();
        const sec = (ex.secondaryMuscles || []).join(" ").toLowerCase();
        const okName = name.includes(q);
        const okMuscles = prim.includes(q) || sec.includes(q);
        const inPart = (ex.primaryMuscles || []).some((m) =>
          m.toLowerCase().includes(bodyPart.toLowerCase())
        );
        return withinPart
          ? (okName || okMuscles) && inPart
          : okName || okMuscles;
      });
    } else {
      arr = arr.filter((ex) =>
        (ex.primaryMuscles || []).some((m) =>
          m.toLowerCase().includes(bodyPart.toLowerCase())
        )
      );
    }

    const score = (ex) => {
      if (!q) return 0;
      const name = (ex.name || "").toLowerCase();
      let s = 0;
      if (name === q) s += 5;
      if (name.startsWith(q)) s += 3;
      if (name.includes(q)) s += 2;
      const prim = (ex.primaryMuscles || []).join(" ").toLowerCase();
      const sec = (ex.secondaryMuscles || []).join(" ").toLowerCase();
      if (prim.includes(q)) s += 1;
      if (sec.includes(q)) s += 1;
      return s;
    };

    if (sortBy === "name") {
      arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "level") {
      const order = { beginner: 0, intermediate: 1, advanced: 2 };
      arr.sort(
        (a, b) =>
          (order[normalizeLevel(a.level)] ?? 9) -
          (order[normalizeLevel(b.level)] ?? 9)
      );
    } else {
      arr.sort(
        (a, b) =>
          score(b) - score(a) || (a.name || "").localeCompare(b.name || "")
      );
    }

    return arr;
  }, [searchDebounced, level, bodyPart, withinPart, sortBy]);

  const fetchExercises = () => {
    setLoading(true);
    setExpanded(null);
    setPage(1);
    setTimeout(() => {
      setExercises(filteredSorted);
      setLoading(false);
    }, 700);
  };
  useEffect(() => {
    fetchExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyPart, level, searchDebounced, withinPart, sortBy]);

  const total = exercises.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return exercises.slice(start, start + pageSize);
  }, [exercises, page]);

  const changePage = (dir) => {
    setPage((p) => Math.min(maxPage, Math.max(1, p + dir)));
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const clearAll = () => {
    setSearch("");
    setLevel("");
    setBodyPart("abdominals");
    setWithinPart(false);
    setSortBy("relevance");
    setExpanded(null);
  };

  const isSelected = (ex) =>
    selected.some((s) => keyForExercise(s) === keyForExercise(ex));
  const addToSelected = (ex) => {
    if (isSelected(ex)) return;
    setSelected((cur) => (cur.length >= 20 ? cur : [...cur, ex])); // cap
  };
  const removeFromSelected = (ex) => {
    const key = keyForExercise(ex);
    setSelected((cur) => cur.filter((s) => keyForExercise(s) !== key));
  };
  const clearSelected = () => setSelected([]);

  const copySelectedAsJson = async () => {
    const payload = {
      count: selected.length,
      exercises: selected,
      createdAt: new Date().toISOString(),
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      alert("Copied selected workout JSON ✅");
    } catch {
      alert("Copy failed. You can manually select and copy.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      {/* Hero — tamni, kompaktan, sa opcionalnom pozadinskom slikom */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/hero/gym-dark.jpg')", // opcionalno: stavi sliku u public/hero/
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(10%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
          >
            <div>
              <BokiGymLogo className="text-white text-2xl" />
              <p className="mt-1 text-white/80 text-sm md:text-base">
                Train smarter — search, filter & build your workout.
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="/generator"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Build a Workout
              </a>
              <a
                href="/hub"
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm"
              >
                Open Fitness Hub
              </a>
            </div>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[#0b0b0c]" />
      </section>

      {/* Controls */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 bg-white/5 rounded-2xl p-4 ring-1 ring-white/10">
            <select
              value={bodyPart}
              onChange={(e) => {
                setSearch("");
                setBodyPart(e.target.value);
              }}
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {BODY_PARTS.map((bp) => (
                <option
                  key={bp.value}
                  value={bp.value}
                  className="bg-[#0b0b0c]"
                >
                  {bp.label}
                </option>
              ))}
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value} className="bg-[#0b0b0c]">
                  {l.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search exercise (e.g. curl)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="w-full inline-flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 cursor-pointer text-sm">
              <span className="text-white/80">Search within body part</span>
              <input
                type="checkbox"
                checked={withinPart}
                onChange={(e) => setWithinPart(e.target.checked)}
              />
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#0b0b0c]">
                  {s.label}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={fetchExercises}
                className="w-full px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Search
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white"
                title="Reset filters"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active filters chips */}
      <div className="flex flex-wrap justify-center gap-2 px-6 pt-3">
        {searchDebounced && (
          <span className="px-2 py-1 rounded-lg text-xs bg-yellow-500/15 text-yellow-300">
            🔎 {searchDebounced}
          </span>
        )}
        {level && (
          <span className="px-2 py-1 rounded-lg text-xs bg-green-500/15 text-green-300">
            🏆 {normalizeLevel(level)}
          </span>
        )}
        {bodyPart && !searchDebounced && (
          <span className="px-2 py-1 rounded-lg text-xs bg-purple-500/15 text-purple-300">
            💪 {bodyPart}
          </span>
        )}
        {sortBy !== "relevance" && (
          <span className="px-2 py-1 rounded-lg text-xs bg-blue-500/15 text-blue-300">
            ↕ Sort: {SORTS.find((s) => s.value === sortBy)?.label}
          </span>
        )}
      </div>

      {/* Summary */}
      <div className="max-w-7xl mx-auto px-4 pb-3 pt-2" aria-live="polite">
        <p className="text-sm text-white/70">
          {loading
            ? "Loading…"
            : `${exercises.length} exercise${
                exercises.length === 1 ? "" : "s"
              } found`}
        </p>
      </div>

      {/* Layout: grid + sidebar */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8"
          ref={listRef}
        >
          {/* Grid */}
          <div>
            {loading ? (
              <Loader />
            ) : exercises.length === 0 ? (
              <p className="text-center text-white/70">No exercises found.</p>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pageData.map((ex, i) => {
                    const added = selected.some(
                      (s) => keyForExercise(s) === keyForExercise(ex)
                    );
                    return (
                      <motion.div
                        key={`${ex.name}-${i}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (i % pageSize) * 0.03 }}
                        className="relative bg-white/5 ring-1 ring-white/10 backdrop-blur rounded-xl p-5 hover:ring-white/20 transition flex flex-col"
                      >
                        {added && (
                          <span className="absolute right-3 top-3 text-[11px] px-2 py-0.5 rounded bg-green-600 text-white">
                            Added
                          </span>
                        )}

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {Array.isArray(ex.images) && ex.images.length > 0 ? (
                            ex.images
                              .slice(0, 2)
                              .map((img, idx) => (
                                <ImgOrFallback
                                  key={idx}
                                  src={`/exercises/${img}`}
                                  alt={ex.name}
                                  className="w-full"
                                />
                              ))
                          ) : (
                            <div className="col-span-2 rounded-lg bg-white/10 grid place-items-center text-white/60 h-32">
                              No images
                            </div>
                          )}
                        </div>

                        <h2 className="text-lg font-semibold mb-2">
                          <Highlight text={ex.name} query={searchDebounced} />
                        </h2>
                        <p className="text-sm text-white/80">
                          <span className="font-medium">Primary Muscles:</span>{" "}
                          {Array.isArray(ex.primaryMuscles)
                            ? ex.primaryMuscles.join(", ")
                            : "—"}
                        </p>
                        <p className="text-sm text-white/80">
                          <span className="font-medium">Equipment:</span>{" "}
                          {ex.equipment || "—"}
                        </p>
                        <p className="text-sm text-white/80">
                          <span className="font-medium">Level:</span>{" "}
                          {normalizeLevel(ex.level) || "—"}
                        </p>
                        <p className="text-sm text-white/80">
                          <span className="font-medium">Category:</span>{" "}
                          {ex.category || "—"}
                        </p>

                        {Array.isArray(ex.instructions) &&
                          ex.instructions.length > 0 && (
                            <div className="mt-3">
                              <button
                                onClick={() =>
                                  setExpanded(expanded === i ? null : i)
                                }
                                className="text-blue-300 hover:underline font-medium"
                              >
                                {expanded === i
                                  ? "Hide Instructions"
                                  : "Show Instructions"}
                              </button>
                              <AnimatePresence initial={false}>
                                {expanded === i && (
                                  <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-2 space-y-1 text-white/85 overflow-hidden list-disc list-inside"
                                  >
                                    {ex.instructions.map((step, idx) => (
                                      <li key={idx} className="text-sm">
                                        {step}
                                      </li>
                                    ))}
                                  </motion.ul>
                                )}
                              </AnimatePresence>
                            </div>
                          )}

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => setQuick(ex)}
                            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
                          >
                            Quick view
                          </button>
                          {!added ? (
                            <button
                              onClick={() => setSelected((cur) => [...cur, ex])}
                              className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                            >
                              Add
                            </button>
                          ) : (
                            <button
                              onClick={() => removeFromSelected(ex)}
                              className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {maxPage > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                      onClick={() => changePage(-1)}
                      disabled={page <= 1}
                      className="px-3 py-2 rounded-lg bg-white/10 disabled:opacity-40"
                    >
                      ← Prev
                    </button>
                    <span className="text-sm text-white/70">
                      Page {page} / {maxPage}
                    </span>
                    <button
                      onClick={() => changePage(1)}
                      disabled={page >= maxPage}
                      className="px-3 py-2 rounded-lg bg-white/10 disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar selection */}
          <aside className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white/5 ring-1 ring-white/10 rounded-2xl p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  Workout ({selected.length})
                </h3>
                <button
                  onClick={() => setSelected([])}
                  disabled={selected.length === 0}
                  className="text-sm px-2 py-1 rounded bg-white/10 disabled:opacity-40"
                >
                  Clear
                </button>
              </div>

              {selected.length === 0 ? (
                <p className="mt-3 text-sm text-white/70">
                  Add exercises to build your workout.
                </p>
              ) : (
                <>
                  <ul className="mt-3 space-y-2 max-h-[360px] overflow-auto pr-1">
                    {selected.map((ex) => (
                      <li
                        key={keyForExercise(ex)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10"
                      >
                        <ImgOrFallback
                          src={
                            Array.isArray(ex.images)
                              ? `/exercises/${ex.images[0]}`
                              : null
                          }
                          alt={ex.name}
                          className="w-16 aspect-square rounded-md object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {ex.name}
                          </p>
                          <p className="text-[11px] text-white/60 truncate">
                            {normalizeLevel(ex.level)} • {ex.equipment || "—"}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromSelected(ex)}
                          className="px-2 py-1 text-xs rounded bg-red-600/20 text-red-200"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={copySelectedAsJson}
                      className="px-4 py-2 rounded-lg bg-white text-black"
                    >
                      Copy as JSON
                    </button>
                    <button
                      onClick={() =>
                        alert("Coming soon: send to Workout Generator")
                      }
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Use in Generator
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Quick view modal */}
      <QuickViewModal
        open={!!quick}
        onClose={() => setQuick(null)}
        exercise={quick}
        onAdd={(ex) => {
          if (!selected.some((s) => keyForExercise(s) === keyForExercise(ex))) {
            setSelected((cur) => (cur.length >= 20 ? cur : [...cur, ex]));
          }
          setQuick(null);
        }}
        isSelected={
          quick
            ? selected.some((s) => keyForExercise(s) === keyForExercise(quick))
            : false
        }
      />
    </div>
  );
}

export default Exercises;
