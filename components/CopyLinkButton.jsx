"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { CheckIcon, CopyIcon } from "@/components/ui/Icons";

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; fall back to a box the user can copy from
      window.prompt("Copy this link:", window.location.href);
    }
  }

  return (
    <Button variant="secondary" onClick={copy}>
      {copied ? (
        <>
          <CheckIcon width={16} height={16} className="text-emerald-500" /> Copied!
        </>
      ) : (
        <>
          <CopyIcon width={16} height={16} /> Copy link
        </>
      )}
    </Button>
  );
}