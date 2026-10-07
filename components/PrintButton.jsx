"use client";

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
    <button
      type="button"
      onClick={handlePrint}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Print / Save as PDF
    </button>
  );
}