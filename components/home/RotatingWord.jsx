"use client";

import { useEffect, useState } from "react";

const WORDS = ["developer", "designer", "student", "freelancer", "creator"];

export default function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Respect people who turned off animations in their device settings
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % WORDS.length);
    }, 2200);

    return () => clearInterval(timer); // cleanup when the component disappears
  }, []);

  return (
    // key={word}: React sees a "new" element each time, so the animation replays
    <span
      key={WORDS[index]}
      className="block animate-word-in bg-linear-to-r from-indigo-600 via-fuchsia-500 to-amber-500 bg-clip-text pb-1 leading-[1.15] text-transparent motion-reduce:animate-none dark:from-indigo-300 dark:via-fuchsia-300 dark:to-amber-200"
    >
      {WORDS[index]}
    </span>
  );
}