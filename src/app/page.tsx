"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Route model
 type Route =
  | "home"
  | "streaming"
  | "sports"
  | "workouts"
  | "workouts-week"; // route kept for compatibility, label changed to "Activity Calendar"

export default function Page() {
  // ---- Router (hash-based) ----
  const [route, setRoute] = useState<Route>("home");

  useEffect(() => {
    const parse = () => {
      const h = typeof window !== "undefined" ? window.location.hash : "";
      const key = (h.replace(/^#\//, "") as Route) || "home";
      setRoute(key);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    };
    parse();
    window.addEventListener("hashchange", parse);
    return () => window.removeEventListener("hashchange", parse);
  }, []);

  // ---- Local state: monthly activity/workout calendar ----
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() }; // month: 0-11
  });

  const [calData, setCalData] = useState<Record<string, Record<string, DayEntry>>>({});
  const CAL_KEY = "calendar-workouts";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CAL_KEY);
      if (raw) setCalData(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CAL_KEY, JSON.stringify(calData));
    } catch {}
  }, [calData]);

  // Manual save (explicit button)
  const [saved, setSaved] = useState(false);
  const manualSave = () => {
    try {
      localStorage.setItem(CAL_KEY, JSON.stringify(calData));
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch {}
  };

  // ---- Streaming links (with brand colors, Apple Music instead of Spotify) ----
  const streaming = useMemo(
    () => [
      { name: "Netflix", url: "https://www.netflix.com", color: "#E50914" },
      { name: "Disney+", url: "https://www.disneyplus.com", color: "#113CCF" },
      { name: "Prime Video", url: "https://www.primevideo.com", color: "#00A8E1" },
      { name: "YouTube", url: "https://www.youtube.com", color: "#FF0000" },
      { name: "Apple Music", url: "https://music.apple.com", color: "#FA243C" },
      { name: "Apple TV+", url: "https://tv.apple.com", color: "#0A0A0A" },
    ],
    []
  );

  // ---- Footer date string (fix hydration) ----
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 text-white grid place-items-center font-semibold">R</div>
            <h1 className="text-lg font-semibold tracking-tight">Roey — Personal Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-2">
              <a href="#/home" className={navBtn(route === "home")}>Home</a>
              <a href="#/streaming" className={navBtn(route === "streaming")}>Streaming</a>
              <a href="#/sports" className={navBtn(route === "sports")}>Sports</a>
            </nav>
            <button onClick={manualSave} className="ml-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-900 text-white hover:shadow">Save</button>
            {saved && <span className="text-xs text-emerald-600" aria-live="polite">Saved</span>}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {route === "home" && <Home />}
        {route === "streaming" && <Streaming items={streaming} />}
        {route === "sports" && <Sports />}
        {route === "workouts" && <WorkoutsPlan />}
        {route === "workouts-week" && (
          <MonthCalendar
            year={current.year}
            month={current.month}
            data={calData}
            onPrev={() => setCurrent((c) => prevMonth(c))}
            onNext={() => setCurrent((c) => nextMonth(c))}
            onSave={(dateStr, entry) =>
              setCalData((s) => saveDay(s, dateStr, entry))
            }
            onClear={(dateStr) =>
              setCalData((s) => clearDay(s, dateStr))
            }
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 flex items-center justify-between">
          <span>Made for me — fast, clean, practical.</span>
          <span suppressHydrationWarning>{today}</span>
        </div>
      </footer>
    </div>
  );
}

// ---------- Types ----------
interface DayEntry { label: string; note: string; }

// ---------- Subcomponents ----------

function Home() {
  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Welcome</h2>
        <p className="mt-2 text-slate-600">
          Quick access to the stuff I actually use. One clean hub.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a href="#/streaming" className="group rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4 hover:shadow-md transition-transform">
            <div className="flex items-center justify-between">
              <span className="font-medium">Streaming Services</span>
              <span className="opacity-60 group-hover:translate-x-0.5 transition">→</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">All my platforms in one place.</p>
          </a>
          <a href="#/sports" className="group rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4 hover:shadow-md transition-transform">
            <div className="flex items-center justify-between">
              <span className="font-medium">Sports</span>
              <span className="opacity-60 group-hover:translate-x-0.5 transition">→</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">Personal split & activity calendar.</p>
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold">Today</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a href="#/workouts" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:shadow">
              Personal Split
            </a>
            <a href="#/workouts-week" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:shadow">
              Activity Calendar
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <div className="mt-3 grid gap-2">
            <a className="underline text-slate-700" href="#/streaming">Streaming hub</a>
            <a className="underline text-slate-700" href="#/sports">Sports hub</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Streaming({
  items,
}: {
  items: { name: string; url: string; color: string }[];
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Streaming Services</h2>
        <a href="#/home" className="text-sm underline">Back to home</a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200 text-white"
            style={{ backgroundColor: s.color }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{s.name}</span>
              <span className="opacity-90">↗</span>
            </div>
            <p className="mt-1 text-sm opacity-90">Open {s.name}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function Sports() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sports</h2>
        <a href="#/home" className="text-sm underline">Back to home</a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a href="#/workouts" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-medium">Workouts</span>
            <span className="opacity-60">→</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">Your A/B split & guidance.</p>
        </a>
        <a href="#/workouts-week" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-medium">Activity Calendar</span>
            <span className="opacity-60">→</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">Tap days you trained; add notes.</p>
        </a>
      </div>
    </section>
  );
}

// ---- Personal A/B split based on preferences ----
function WorkoutsPlan() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Personal Split (A/B)</h2>
        <a href="#/sports" className="text-sm underline">Back to sports</a>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <p className="text-slate-600">
          Goal: <strong>hypertrophy</strong> (6–12 reps), training <strong>3–4 days/week</strong> at home with a Technogym cable machine and power rack. Priorities: <strong>legs, chest, lower back</strong>. Keep sessions ~60–75 min. Alternate <strong>A ↔ B</strong> every workout (Week 1: A/B/A, Week 2: B/A/B, etc.).
        </p>

        <SplitCard
          title="Workout A — Lower (quads focus) + Chest"
          items={[
            "Back Squat or Hack Squat — 4×6–10",
            "Bulgarian Split Squat — 3×8–12/leg",
            "Cable Leg Extension — 3×10–12 (1s squeeze)",
            "Bench Press or DB Press — 4×6–10",
            "Incline DB Press — 3×8–12",
            "Optional: Cable Fly (mid) — 2×10–15"
          ]}
        />

        <SplitCard
          title="Workout B — Posterior Chain + Back/Shoulders"
          items={[
            "Romanian Deadlift — 4×6–10",
            "Front Squat or Goblet Squat — 3×8–10",
            "Cable Hamstring Curl — 3×10–12",
            "Barbell or One‑Arm Cable Row — 4×6–10",
            "Lat Pulldown or Assisted Pull‑ups — 3×8–12",
            "Lateral Raise (cable) + Face Pulls — 2–3×12–15"
          ]}
        />

        <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
          <h4 className="font-medium">Guidelines</h4>
          <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1">
            <li>Warm‑up: 5–8 min easy cardio + 2 light ramp sets for the first big lift.</li>
            <li>Progression: when you hit the top of a rep range, add ~2.5–5 kg or 1–2 reps next time.</li>
            <li>Leave ~1 rep in reserve on most sets; avoid constant failure.</li>
            <li>Mobility 2–3×/week (8–10 min): hip flexors, hamstrings, T‑spine, pecs.</li>
            <li>Tennis/padel: place on non‑lower days when possible, or separate by 6–8 hours.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function SplitCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

// ---- Activity Calendar ----
function MonthCalendar({
  year,
  month,
  data,
  onPrev,
  onNext,
  onSave,
  onClear,
}: {
  year: number;
  month: number; // 0-11
  data: Record<string, Record<string, DayEntry>>;
  onPrev: () => void;
  onNext: () => void;
  onSave: (dateStr: string, entry: DayEntry) => void;
  onClear: (dateStr: string) => void;
}) {
  const { weeks, monthKey } = useMemo(() => buildCalendar(year, month), [year, month]);
  const [dialog, setDialog] = useState<null | { dateStr: string; label: string; note: string }>(null);
  const monthData = data[monthKey] || {};

  const openForNew = (dateStr: string) => setDialog({ dateStr, label: "", note: "" });
  const openForEdit = (dateStr: string, entry: DayEntry) => setDialog({ dateStr, label: entry.label, note: entry.note });

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Activity Calendar</h2>
        <a href="#/sports" className="text-sm underline">Back to sports</a>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onPrev} className="rounded-lg border px-3 py-1 hover:shadow">← Prev</button>
          <div className="font-semibold">
            {monthName(month)} {year}
          </div>
          <button onClick={onNext} className="rounded-lg border px-3 py-1 hover:shadow">Next →</button>
        </div>

        {/* Weekday headers (Sun–Sat for IL) */}
        <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-500 mb-2">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d)=> (<div key={d} className="py-1">{d}</div>))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {weeks.map((wk, wi) => (
            <>
              {wk.map((cell, ci) => {
                const inMonth = cell.inMonth;
                const dateStr = cell.iso;
                const entry = monthData[dateStr];
                const worked = !!entry;
                return (
                  <button
                    key={`${wi}-${ci}`}
                    onClick={() => (worked ? openForEdit(dateStr, entry) : openForNew(dateStr))}
                    className={
                      "relative aspect-square rounded-xl border p-2 text-left transition " +
                      (inMonth ? "bg-slate-50 hover:bg-slate-100" : "bg-white opacity-50")
                    }
                    disabled={!inMonth}
                  >
                    <div className="text-xs font-medium text-slate-500">{cell.day}</div>
                    {worked && (
                      <div className="mt-2 text-xs rounded-lg px-2 py-1 bg-emerald-100 text-emerald-800">
                        {entry.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-500">Click a day you worked out. You'll be asked what workout it was and a short note. Data saves automatically; you can also hit the Save button at the top.</p>
      </div>

      {/* Dialog */}
      {dialog && (
        <EditDialog
          dateStr={dialog.dateStr}
          label={dialog.label}
          note={dialog.note}
          onCancel={() => setDialog(null)}
          onSave={(label, note) => {
            onSave(dialog.dateStr, { label, note });
            setDialog(null);
          }}
          onClear={() => {
            onClear(dialog.dateStr);
            setDialog(null);
          }}
        />
      )}
    </section>
  );
}

function EditDialog({
  dateStr,
  label,
  note,
  onCancel,
  onSave,
  onClear,
}: {
  dateStr: string;
  label: string;
  note: string;
  onCancel: () => void;
  onSave: (label: string, note: string) => void;
  onClear: () => void;
}) {
  const [l, setL] = useState(label);
  const [n, setN] = useState(note);
  const title = new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="mb-3 text-sm text-slate-500">{title}</div>
        <label className="block text-sm font-medium">What workout was it?</label>
        <input
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="e.g., Workout A, Workout B, Tennis"
          value={l}
          onChange={(e) => setL(e.target.value)}
        />
        <label className="mt-3 block text-sm font-medium">Small note</label>
        <textarea
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200 min-h-[90px]"
          placeholder="How it felt, PRs, anything"
          value={n}
          onChange={(e) => setN(e.target.value)}
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={onCancel} className="rounded-xl border px-3 py-2 hover:shadow">Cancel</button>
            <button onClick={() => onSave(l.trim(), n.trim())} className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:shadow">Save</button>
          </div>
          <button onClick={onClear} className="text-sm text-red-600 underline">Clear day</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Utilities ----------
function navBtn(active?: boolean) {
  const base = "px-3 py-2 rounded-xl transition hover:shadow-sm hover:bg-slate-100";
  return active ? `${base} bg-slate-100` : `${base}`;
}

function monthName(m: number) {
  return new Date(2025, m, 1).toLocaleString(undefined, { month: 'long' });
}

function prevMonth(c: {year: number; month: number}) {
  const d = new Date(c.year, c.month, 1);
  d.setMonth(d.getMonth() - 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}
function nextMonth(c: {year: number; month: number}) {
  const d = new Date(c.year, c.month, 1);
  d.setMonth(d.getMonth() + 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function pad(n: number) { return String(n).padStart(2, '0'); }
function monthKeyOf(year: number, month: number) { return `${year}-${pad(month+1)}`; }

function buildCalendar(year: number, month: number) {
  // Sunday-first weeks for IL
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const weeks: { day: number; inMonth: boolean; iso: string }[][] = [];

  // Start from Sunday of the week containing the 1st
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay()); // 0=Sun

  // Build 6 rows * 7 days grid
  let cursor = new Date(start);
  for (let w = 0; w < 6; w++) {
    const row: { day: number; inMonth: boolean; iso: string }[] = [];
    for (let d = 0; d < 7; d++) {
      const inMonth = cursor >= first && cursor <= last;
      const iso = `${cursor.getFullYear()}-${pad(cursor.getMonth()+1)}-${pad(cursor.getDate())}`;
      row.push({ day: cursor.getDate(), inMonth, iso });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(row);
  }

  return { weeks, monthKey: monthKeyOf(year, month) };
}

function saveDay(
  state: Record<string, Record<string, DayEntry>>,
  dateStr: string,
  entry: DayEntry
) {
  const d = new Date(dateStr);
  const key = monthKeyOf(d.getFullYear(), d.getMonth());
  const monthMap = { ...(state[key] || {}) };
  if (!entry.label && !entry.note) return state; // ignore empty saves
  monthMap[dateStr] = entry;
  return { ...state, [key]: monthMap };
}

function clearDay(state: Record<string, Record<string, DayEntry>>, dateStr: string) {
  const d = new Date(dateStr);
  const key = monthKeyOf(d.getFullYear(), d.getMonth());
  if (!state[key]) return state;
  const monthMap = { ...state[key] };
  delete monthMap[dateStr];
  return { ...state, [key]: monthMap };
}
