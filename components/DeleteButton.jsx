"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { TrashIcon } from "@/components/ui/Icons";

export default function DeleteButton({
  portfolioId,
  name,
  redirectTo,
  label = "Delete",
  className = "",
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function close() {
    if (deleting) return;
    setOpen(false);
    setError("");
  }

  async function handleDelete() {
    setError("");
    setDeleting(true);

    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Could not delete. Please try again.");
        return;
      }

      setOpen(false);
      if (redirectTo) router.push(redirectTo); // leave the preview page
      else router.refresh(); // re-read the list on the same page
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)} className={className}>
        <TrashIcon width={16} height={16} /> {label}
      </Button>

      <ConfirmDialog
        open={open}
        title={`Delete "${name}"?`}
        message="This permanently removes the portfolio, all of its information, and its profile picture. This cannot be undone."
        confirmLabel="Yes, delete it"
        loading={deleting}
        error={error}
        onConfirm={handleDelete}
        onCancel={close}
      />
    </>
  );
}