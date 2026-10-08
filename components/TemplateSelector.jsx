"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TemplateCard from "@/components/TemplateCard";

// EXACTLY three templates. There is no fourth.
const TEMPLATES = [
  {
    key: "simple",
    name: "Simple",
    description: "Clean and minimal with a white background and a traditional single-column layout. Easy to read.",
  },
  {
    key: "modern",
    name: "Modern",
    description: "Rounded cards, skill badges, project cards, and a navigation bar for a polished look.",
  },
  {
    key: "creative",
    name: "Creative",
    description: "A bold dark design with a visual timeline and a unique layout that stands out.",
  },
];

export default function TemplateSelector({ portfolioId, currentTemplate }) {
  const router = useRouter();
  const [savingKey, setSavingKey] = useState(null); // which card is saving
  const [error, setError] = useState("");

  async function choose(key) {
    setError("");
    setSavingKey(key);

    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: key }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Something went wrong. Please try again.");
        return;
      }

            router.push(`/portfolio/${portfolioId}?notice=ready`);
    } catch {
      setError("Could not reach the server. Check your internet connection and try again.");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div>
      {error && (
        <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {TEMPLATES.map((template) => (
          <TemplateCard
            key={template.key}
            template={template}
            isCurrent={currentTemplate === template.key}
            disabled={!portfolioId || savingKey !== null}
            loading={savingKey === template.key}
            onSelect={() => choose(template.key)}
          />
        ))}
      </div>
    </div>
  );
}