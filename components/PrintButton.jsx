"use client";

import Button from "@/components/ui/Button";
import { PrinterIcon } from "@/components/ui/Icons";

export default function PrintButton({ name }) {
  function handlePrint() {
    // The browser uses the page title as the default PDF file name
    const originalTitle = document.title;
    document.title = `${name} - Portfolio`;

    const restore = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);

    window.print();
  }

  return (
    <Button variant="secondary" onClick={handlePrint}>
      <PrinterIcon width={16} height={16} /> Print / Save as PDF
    </Button>
  );
}