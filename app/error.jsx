"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error); // technical details stay in the console, not on the page
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center">
      <p className="text-5xl" aria-hidden>⚠️</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 text-gray-600">
        We couldn&apos;t load this page. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => reset()} size="lg">Try again</Button>
        <Button href="/" variant="secondary" size="lg">Go home</Button>
      </div>
    </div>
  );
}