"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  { key: "simple", label: "Simple" },
  { key: "modern", label: "Modern" },
  { key: "creative", label: "Creative" },
];

export default function TemplateSwitcher({ portfolioId, current }) {
  const router = useRouter();
  const [selected, setSelected] = useState(current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const busy = saving || isPending;

  async function choose(key) {
    if (key === selected || busy) return;

    const previous = selected;
    setSelected(key); // optimistic: the button highlights immediately
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: key }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setSelected(previous); // undo the highlight
        setError(result.message || "The template could not be saved. Please try again.");
        return;
      }

      // Ask the server to re-render the preview with the new template
      startTransition(() => router.refresh());
    } catch {
      setSelected(previous);
      setError("Could not reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Portfolio template"
        className="inline-flex rounded-xl bg-gray-100 p-1"
      >
        {OPTIONS.map((option) => {
          const active = selected === option.key;
          return (
            <button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={busy}
              onClick={() => choose(option.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-wait ${
                active
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {busy && (
        <p role="status" className="mt-2 text-xs text-gray-500">
          Updating preview...
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}