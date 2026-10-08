"use client";

import { useState } from "react";

// The four points where the thirds lines cross (left %, top %)
const INTERSECTIONS = [
  ["33.333%", "33.333%"],
  ["66.666%", "33.333%"],
  ["33.333%", "66.666%"],
  ["66.666%", "66.666%"],
];

export default function GridOverlay() {
  const [on, setOn] = useState(false);

  return (
    <>
      {on && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 print:hidden">
          <span className="absolute inset-y-0 left-1/3 w-px bg-rose-500/70" />
          <span className="absolute inset-y-0 left-2/3 w-px bg-rose-500/70" />
          <span className="absolute inset-x-0 top-1/3 h-px bg-rose-500/70" />
          <span className="absolute inset-x-0 top-2/3 h-px bg-rose-500/70" />
          {INTERSECTIONS.map(([left, top]) => (
            <span
              key={`${left}-${top}`}
              className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 ring-4 ring-amber-400/30"
              style={{ left, top }}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOn((value) => !value)}
        aria-pressed={on}
        className="absolute bottom-4 right-4 z-20 min-h-9 rounded-full border border-slate-300 bg-white/90 px-3.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/20 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900 print:hidden"
      >
        {on ? "Hide" : "Show"} rule-of-thirds grid
      </button>
    </>
  );
}