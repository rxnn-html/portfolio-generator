"use client";

import { PrintIcon } from "@/components/templates/Icons";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 print:hidden"
    >
      <PrintIcon /> Print / Save as PDF
    </button>
  );
}