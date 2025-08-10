"use client";

import { Fragment, useEffect, useMemo, useState } from "react";

// Route model
 type Route =
  | "home"
  | "streaming"
  | "sports"
  | "workouts"
  | "workouts-week"; // route kept for compatibility, label shown as "Activity Calendar"

// ---------- Types ----------
interface DayEntry { label: string; note: string; }
interface Exercise { name: string; sets: number; reps: string; weight: string; }
interface ABPlan { warmup: string[]; A: Exercise[]; B: Exercise[]; }

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

  // ---- Activity calendar (monthly) ----
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() }; // 0-11
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
    try { localStorage.setItem(CAL_KEY, JSON.stringify(calData)); } catch {}
  }, [calData]);

  // ---- A/B Plan (editable) ----
  const PLAN_KEY = "ab-plan-v1";
  const defaultPlan: ABPlan = {
    warmup: [
      "3 min easy cardio (bike/row/jog)",
      "Mobility: 90/90 hips 30s/side, T-spine rotations 8/side, ankle rocks 10/side",
      "Activation: glute bridge 12, band pull-aparts 15, scap push-ups 10",
      "Potentiation: 2–3 ramp-up sets to first lift (≈40% / 70% working weight)"
    ],
    A: [
      { name: "Back Squat / Hack Squat", sets: 4, reps: "6–10", weight: "" },
      { name: "Bulgarian Split Squat", sets: 3, reps: "8–12/leg", weight: "" },
      { name: "Cable Leg Extension", sets: 3, reps: "10–12", weight: "" },
      { name: "Bench Press / DB Press", sets: 4, reps: "6–10", weight: "" },
      { name: "Incline DB Press", sets: 3, reps: "8–12", weight: "" },
      { name: "Cable Fly (mid)", sets: 2, reps: "10–15", weight: "" },
    ],
    B: [
      { name: "Romanian Deadlift", sets: 4, reps: "6–10", weight: "" },
      { name: "Front Squat / Goblet Squat", sets: 3, reps: "8–10", weight: "" },
      { name: "Cable Hamstring Curl", sets: 3, reps: "10–12", weight: "" },
      { name: "Barbell or One-Arm Cable Row", sets: 4, reps: "6–10", weight: "" },
      { name: "Lat Pulldown / Assisted Pull-ups", sets: 3, reps: "8–12", weight: "" },
      { name: "Lateral Raise + Face Pulls", sets: 2, reps: "12–15", weight: "" },
    ],
  };

  const [plan, setPlan] = useState<ABPlan>(defaultPlan);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PLAN_KEY);
      if (raw) setPlan(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(plan)); } catch {}
  }, [plan]);

  // ---- Manual Save button (saves calendar + plan) ----
  const [saved, setSaved] = useState(false);
  const manualSave = () => {
    try {
      localStorage.setItem(CAL_KEY, JSON.stringify(calData));
      localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch {}
  };

  // ---- Streaming links (Apple Music instead of Spotify) ----
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
        {route === "workouts" && (
          <WorkoutsPlan plan={plan} onChange={setPlan} />
        )}
        {route === "workouts-week" && (
          <MonthCalendar
            year={current.year}
            month={current.month}
            data={calData}
            onPrev={() => setCurrent((c) => prevMonth(c))}
            onNext={() => setCurrent((c) => nextMonth(c))}
            onSave={(dateStr, entry) => setCalData((s) => saveDay(s, dateStr, entry))}
            onClear={(dateStr) => setCalData((s) => clearDay(s, dateStr))}
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

// ---------- Subcomponents ----------

function Home() {
  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Welcome</h2>
        <p className="mt-2 text-slate-600">Quick access to the stuff I actually use. One clean hub.</p>
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
            <p className="mt-1 text-sm text-slate-600">A/B split & activity calendar.</p>
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold">Today</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a href="#/workouts" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:shadow">Personal Split</a>
            <a href="#/workouts-week" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:shadow">Activity Calendar</a>
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

function Streaming({ items }: { items: { name: string; url: string; color: string }[] }) {
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
          <p className="mt-1 text-sm text-slate-600">Your A/B split (editable sets/reps/weights).</p>
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

// ---- Editable A/B split ----
function WorkoutsPlan({ plan, onChange }: { plan: ABPlan; onChange: (p: ABPlan) => void }) {
  const updateExercise = (which: "A" | "B", index: number, patch: Partial<Exercise>) => {
    const next = { ...plan, [which]: plan[which].map((ex, i) => (i === index ? { ...ex, ...patch } : ex)) } as ABPlan;
    onChange(next);
  };
  const addExercise = (which: "A" | "B") => {
    const next = { ...plan } as ABPlan;
    next[which] = [...next[which], { name: "New Exercise", sets: 3, reps: "8–12", weight: "" }];
    onChange(next);
  };
  const removeExercise = (which: "A" | "B", index: number) => {
    const next = { ...plan } as ABPlan;
    next[which] = next[which].filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Personal Split (A/B)</h2>
        <a href="#/sports" className="text-sm underline">Back to sports</a>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
          <h4 className="font-medium">Perfect all‑around warm‑up (~10 min)</h4>
          <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1">
            {plan.warmup.map((w, i) => (
              <li key={`wu-${i}`}>{w}</li>
            ))}
          </ul>
        </div>

        <ABTable title="Workout A" items={plan.A} onChange={(i, patch) => updateExercise("A", i, patch)} onAdd={() => addExercise("A")} onRemove={(i) => removeExercise("A", i)} />
        <ABTable title="Workout B" items={plan.B} onChange={(i, patch) => updateExercise("B", i, patch)} onAdd={() => addExercise("B")} onRemove={(i) => removeExercise("B", i)} />

        <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
          <h4 className="font-medium">Guidelines</h4>
          <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1">
            <li>Alternate A ↔ B every workout (e.g., Week 1: A/B/A, Week 2: B/A/B).</li>
            <li>Progression: when you hit the top of a rep range, add 2.5–5 kg or 1–2 reps next time.</li>
            <li>Leave ~1 rep in reserve on most sets; avoid constant failure.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ABTable({ title, items, onChange, onAdd, onRemove }: {
  title: string;
  items: Exercise[];
  onChange: (index: number, patch: Partial<Exercise>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button onClick={onAdd} className="text-sm rounded-lg border px-3 py-1 hover:shadow">Add exercise</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2 pr-3">Exercise</th>
              <th className="py-2 pr-3">Sets</th>
              <th className="py-2 pr-3">Reps</th>
              <th className="py-2 pr-3">Weight</th>
              <th className="py-2 pl-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((ex, i) => (
              <tr key={`${title}-${i}`} className="border-t">
                <td className="py-2 pr-3 min-w-[220px]">
                  <input
                    value={ex.name}
                    onChange={(e) => onChange(i, { name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </td>
                <td className="py-2 pr-3 w-[90px]">
                  <input
                    type="number"
                    min={1}
                    value={ex.sets}
                    onChange={(e) => onChange(i, { sets: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </td>
                <td className="py-2 pr-3 w-[110px]">
                  <input
                    value={ex.reps}
                    onChange={(e) => onChange(i, { reps: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </td>
                <td className="py-2 pr-3 w-[120px]">
                  <input
                    value={ex.weight}
                    onChange={(e) => onChange(i, { weight: e.target.value })}
                    placeholder="kg"
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </td>
                <td className="py-2 pl-2">
                  <button onClick={() => onRemove(i)} className="text-xs underline opacity-70 hover:opacity-100">remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
          <div className="font-semibold">{monthName(month)} {year}</div>
          <button onClick={onNext} className="rounded-lg border px-3 py-1 hover:shadow">Next →</button>
        </div>

        {/* Weekday headers (Sun–Sat) */}
        <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-500 mb-2">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d)=> (<div key={d} className="py-1">{d}</div>))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {weeks.map((wk, wi) => (
            <Fragment key={`w-${wi}`}>
              {wk.map((cell, ci) => {
                const inMonth = cell.inMonth;
                const dateStr = cell.iso;
                const entry = monthData[dateStr];
                const worked = !!entry;
                return (
                  <button
                    key={`c-${wi}-${ci}`}
                    onClick={() => (worked ? openForEdit(dateStr, entry) : openForNew(dateStr))}
                    className={
                      "relative aspect-square rounded-xl border p-2 text-left transition " +
                      (inMonth ? "bg-slate-50 hover:bg-slate-100" : "bg-white opacity-50")
                    }
                    disabled={!inMonth}
                  >
                    <div className="text-xs font-medium text-slate-500">{cell.day}</div>
                    {worked && (
                      <div className="mt-2 text-xs rounded-lg px-2 py-1 bg-emerald-100 text-emerald-800">{entry.label}</div>
                    )}
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-500">Click a day you trained. You&apos;ll be asked what workout it was and a short note. Data auto-saves; you can also hit Save (top right).</p>
      </div>

      {/* Dialog */}
      {dialog && (
        <EditDialog
          dateStr={dialog.dateStr}
          label={dialog.label}
          note={dialog.note}
          onCancel={() => setDialog(null)}
          onSave={(label, note) => { onSave(dialog.dateStr, { label, note }); setDialog(null); }}
          onClear={() => { onClear(dialog.dateStr); setDialog(null); }}
        />
      )}
    </section>
  );
}

function EditDialog({ dateStr, label, note, onCancel, onSave, onClear }: {
  dateStr: string; label: string; note: string;
  onCancel: () => void; onSave: (label: string, note: string) => void; onClear: () => void;
}) {
  const [l, setL] = useState(label);
  const [n, setN] = useState(note);
  const title = new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="mb-3 text-sm text-slate-500">{title}</div>
        <label className="block text-sm font-medium">What workout was it?</label>
        <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="Workout A, Workout B, Tennis" value={l} onChange={(e) => setL(e.target.value)} />
        <label className="mt-3 block text-sm font-medium">Small note</label>
        <textarea className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200 min-h-[90px]" placeholder="How it felt, PRs, anything" value={n} onChange={(e) => setN(e.target.value)} />
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

function monthName(m: number) { return new Date(2025, m, 1).toLocaleString(undefined, { month: 'long' }); }
function prevMonth(c: {year: number; month: number}) { const d = new Date(c.year, c.month, 1); d.setMonth(d.getMonth() - 1); return { year: d.getFullYear(), month: d.getMonth() }; }
function nextMonth(c: {year: number; month: number}) { const d = new Date(c.year, c.month, 1); d.setMonth(d.getMonth() + 1); return { year: d.getFullYear(), month: d.getMonth() }; }
function pad(n: number) { return String(n).padStart(2, '0'); }
function monthKeyOf(year: number, month: number) { return `${year}-${pad(month+1)}`; }

function buildCalendar(year: number, month: number) {
  // Sunday-first weeks
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const weeks: { day: number; inMonth: boolean; iso: string }[][] = [];
  const start = new Date(first); start.setDate(first.getDate() - first.getDay());
  const cursor = new Date(start);
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

function saveDay(state: Record<string, Record<string, DayEntry>>, dateStr: string, entry: DayEntry) {
  const d = new Date(dateStr); const key = monthKeyOf(d.getFullYear(), d.getMonth());
  const monthMap = { ...(state[key] || {}) }; if (!entry.label && !entry.note) return state; monthMap[dateStr] = entry; return { ...state, [key]: monthMap };
}

function clearDay(state: Record<string, Record<string, DayEntry>>, dateStr: string) {
  const d = new Date(dateStr); const key = monthKeyOf(d.getFullYear(), d.getMonth());
  if (!state[key]) return state; const monthMap = { ...state[key] }; delete monthMap[dateStr]; return { ...state, [key]: monthMap };
}
