"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { TrashIcon } from "@/components/ui/Icons";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  loading = false,
  error = "",
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null);

  // Open or close the real <dialog> whenever "open" changes
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      // Esc key: let our own state decide, not the browser
      onCancel={(e) => {
        e.preventDefault();
        if (!loading) onCancel();
      }}
      // Click on the dark backdrop closes it (only the backdrop equals the <dialog> itself)
      onClick={(e) => {
        if (e.target === ref.current && !loading) onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-600">
            <TrashIcon />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{message}</p>
            {error && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger-solid" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}