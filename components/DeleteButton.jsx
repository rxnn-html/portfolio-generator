"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ portfolioId, name, redirectTo, className = "" }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    // Browser's built-in confirmation box. Cancel = nothing happens.
    const confirmed = window.confirm(
      `Delete the portfolio of "${name}"?\n\nThis permanently removes all of its information and cannot be undone.`
    );
    if (!confirmed) return;

    setError("");
    setDeleting(true);

    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Could not delete. Please try again.");
        return;
      }

      if (redirectTo) router.push(redirectTo); // e.g. leave the preview page
      router.refresh(); // re-read the server data so the list updates
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className={`rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}