// src/pages/Home.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import exercisesData from "../data/exercises.json";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- helpers ---------- */
// why: smanji re-render pri tipkanju
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// why: dataset nivoi znaju da variraju
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

/* ---------- Quick View Modal ---------- */
function QuickViewModal({ open, onClose, exercise, onAdd, isSelected }) {
  // why: ESC za11brzo zatvaranje
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && exercise && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-[61] w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-4">
                <div className="flex gap-3">
                  {Array.isArray(exercise.images) &&
                  exercise.images.length > 0 ? (
                    exercise.images
                      .slice(0, 2)
                      .map((img, i) => (
                        <ImgOrFallback
                          key={i}
                          src={`/exercises/${img}`}
                          alt={exercise.name}
                          className="w-1/2"
                        />
                      ))
                  ) : (
                    <ImgOrFallback
                      src={null}
                      alt={exercise.name}
                      className="w-full"
                    />
                  )}
                </div>
              </div>
              <div className="md:w-1/2 p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold">{exercise.name}</h3>
                  <button
                    onClick={onClose}
                    className="rounded-lg px-2 py-1 bg-gray-100 dark:bg-gray-800"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="font-medium">Equipment:</span>{" "}
                    {exercise.equipment || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Level:</span>{" "}
                    {normalizeLevel(exercise.level) || "—"}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Primary:</span>{" "}
                    {Array.isArray(exercise.primaryMuscles)
                      ? exercise.primaryMuscles.join(", ")
                      : "—"}
                  </div>
                  {Array.isArray(exercise.secondaryMuscles) &&
                    exercise.secondaryMuscles.length > 0 && (
                      <div className="col-span-2">
                        <span className="font-medium">Secondary:</span>{" "}
                        {exercise.secondaryMuscles.join(", ")}
                      </div>
                    )}
                  {exercise.category && (
                    <div className="col-span-2">
                      <span className="font-medium">Category:</span>{" "}
                      {exercise.category}
                    </div>
                  )}
                </div>

                {Array.isArray(exercise.instructions) &&
                  exercise.instructions.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-1">Instructions</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300 max-h-40 overflow-auto pr-2">
                        {exercise.instructions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* optional tips/mistakes if dataset has them */}
                {Array.isArray(exercise.tips) && exercise.tips.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Tips</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {exercise.tips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(exercise.mistakes) &&
                  exercise.mistakes.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">
                        Common mistakes
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {exercise.mistakes.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => onAdd(exercise)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-white",
                      isSelected
                        ? "bg-green-700"
                        : "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    {isSelected ? "Added" : "Add to workout"}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800"
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
function Home() {
  const [bodyPart, setBodyPart] = useState("abdominals");
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const searchDebounced = useDebouncedValue(search, 300);

  const [withinPart, setWithinPart] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const [exercises, setExercises] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);

  // selection
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

  // quick view
  const [quick, setQuick] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 12;
  const listRef = useRef(null);

  // filter + sort
  const filteredSorted = useMemo(() => {
    const q = (searchDebounced || "").trim().toLowerCase();
    const lvl = normalizeLevel(level);
    let arr = exercisesData.slice();

    if (lvl) {
      arr = arr.filter((ex) => normalizeLevel(ex.level) === lvl);
    }

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

  // fetch (fake loader stay)
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

  // pagination
  const total = exercises.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return exercises.slice(start, start + pageSize);
  }, [exercises, page]);

  const changePage = (dir) => {
    setPage((p) => {
      const next = Math.min(maxPage, Math.max(1, p + dir));
      return next;
    });
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
    setSelected((cur) => (cur.length >= 20 ? cur : [...cur, ex])); // why: cap da ne buja beskonačno
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero */}
      <section className="relative text-center py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold"
        >
          Welcome to GymMaster 💪
        </motion.h1>
        <p className="mt-3 text-lg opacity-90">
          Your interactive exercise guide with animations, images & filters
        </p>
      </section>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 p-6">
        <select
          value={bodyPart}
          onChange={(e) => {
            setSearch("");
            setBodyPart(e.target.value);
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        >
          {BODY_PARTS.map((bp) => (
            <option key={bp.value} value={bp.value}>
              {bp.label}
            </option>
          ))}
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search exercise (e.g. curl)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 w-64 focus:ring-2 focus:ring-blue-500"
        />

        <label className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer">
          <input
            type="checkbox"
            checked={withinPart}
            onChange={(e) => setWithinPart(e.target.checked)}
          />
          <span>Search within body part</span>
        </label>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          onClick={fetchExercises}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>

        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
          title="Reset filters"
        >
          Reset
        </button>
      </div>

      {/* Active filters chips */}
      <div className="flex flex-wrap justify-center gap-2 px-6 -mt-2">
        {searchDebounced && (
          <span className="px-2 py-1 rounded-lg text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
            🔎 {searchDebounced}
          </span>
        )}
        {level && (
          <span className="px-2 py-1 rounded-lg text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200">
            🏆 {normalizeLevel(level)}
          </span>
        )}
        {bodyPart && !searchDebounced && (
          <span className="px-2 py-1 rounded-lg text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
            💪 {bodyPart}
          </span>
        )}
        {sortBy !== "relevance" && (
          <span className="px-2 py-1 rounded-lg text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
            ↕ Sort: {SORTS.find((s) => s.value === sortBy)?.label}
          </span>
        )}
      </div>

      {/* Summary */}
      <div className="max-w-6xl mx-auto px-4 pb-3 pt-2" aria-live="polite">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loading
            ? "Loading…"
            : `${exercises.length} exercise${
                exercises.length === 1 ? "" : "s"
              } found`}
        </p>
      </div>

      {/* Layout: grid + sidebar */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8"
          ref={listRef}
        >
          {/* Grid */}
          <div>
            {loading ? (
              <Loader />
            ) : exercises.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No exercises found.
              </p>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pageData.map((ex, i) => {
                    const added = isSelected(ex);
                    return (
                      <motion.div
                        key={`${ex.name}-${i}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (i % pageSize) * 0.03 }}
                        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition flex flex-col"
                      >
                        {/* Added ribbon */}
                        {added && (
                          <span className="absolute right-3 top-3 text-[11px] px-2 py-0.5 rounded bg-green-600 text-white">
                            Added
                          </span>
                        )}

                        <div className="flex gap-3 mb-4">
                          {Array.isArray(ex.images) && ex.images.length > 0 ? (
                            ex.images
                              .slice(0, 2)
                              .map((img, idx) => (
                                <ImgOrFallback
                                  key={idx}
                                  src={`/exercises/${img}`}
                                  alt={ex.name}
                                />
                              ))
                          ) : (
                            <div className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 grid place-items-center text-gray-400 h-32">
                              No images
                            </div>
                          )}
                        </div>

                        <h2 className="text-xl font-semibold mb-2">
                          <Highlight text={ex.name} query={searchDebounced} />
                        </h2>
                        <p className="text-sm">
                          <span className="font-medium">Primary Muscles:</span>{" "}
                          {Array.isArray(ex.primaryMuscles)
                            ? ex.primaryMuscles.join(", ")
                            : "—"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Equipment:</span>{" "}
                          {ex.equipment || "—"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Level:</span>{" "}
                          {normalizeLevel(ex.level) || "—"}
                        </p>
                        <p className="text-sm">
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
                                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
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
                                    className="mt-2 space-y-1 text-gray-700 dark:text-gray-300 overflow-hidden list-disc list-inside"
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
                            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                          >
                            Quick view
                          </button>
                          {!added ? (
                            <button
                              onClick={() => addToSelected(ex)}
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

                {/* Pagination */}
                {maxPage > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                      onClick={() => changePage(-1)}
                      disabled={page <= 1}
                      className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                    >
                      ← Prev
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Page {page} / {maxPage}
                    </span>
                    <button
                      onClick={() => changePage(1)}
                      disabled={page >= maxPage}
                      className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  Workout ({selected.length})
                </h3>
                <button
                  onClick={clearSelected}
                  disabled={selected.length === 0}
                  className="text-sm px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>

              {selected.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Add exercises to build your workout.
                </p>
              ) : (
                <>
                  <ul className="mt-3 space-y-2 max-h-[360px] overflow-auto pr-1">
                    {selected.map((ex) => (
                      <li
                        key={keyForExercise(ex)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40"
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
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {normalizeLevel(ex.level)} • {ex.equipment || "—"}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromSelected(ex)}
                          className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={copySelectedAsJson}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white"
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
          addToSelected(ex);
          setQuick(null);
        }}
        isSelected={quick ? isSelected(quick) : false}
      />
    </div>
  );
}

export default Home;
