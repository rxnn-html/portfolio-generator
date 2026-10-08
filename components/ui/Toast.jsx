"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/ui/Icons";

const MESSAGES = {
  saved: "Changes saved.",
  ready: "Your portfolio is ready!",
  deleted: "Portfolio deleted.",
};

export default function Toast({ notice }) {
  const message = MESSAGES[notice]; // unknown or missing notice = no toast
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) return;

    // Remove "?notice=..." from the address bar so a refresh doesn't show it again
    window.history.replaceState(null, "", window.location.pathname);

    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl print:hidden"
    >
      <CheckIcon width={18} height={18} className="shrink-0" />
      {message}
    </div>
  );
}