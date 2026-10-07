import Link from "next/link";
import RotatingWord from "@/components/home/RotatingWord";
import TemplatePreview from "@/components/TemplatePreview";
import { ArrowRightIcon, CheckIcon, SparkIcon } from "@/components/home/Icons";

const highlights = ["No sign-up needed", "3 designer templates", "Save as PDF"];

const cardBase =
  "absolute h-40 w-56 overflow-hidden rounded-2xl border border-slate-200 shadow-xl dark:border-white/10 sm:h-44 sm:w-64";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/60 px-6 py-14 dark:border-white/10 dark:bg-white/[0.03] sm:px-12 sm:py-20">
      {/* Soft glowing blobs (decoration only) */}
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/20" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl dark:bg-fuchsia-500/20" />

      <div className="relative grid items-center gap-14 lg:grid-cols-2">
        {/* LEFT: text */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-400/30 dark:text-indigo-300">
            <SparkIcon width={14} height={14} /> Free portfolio builder
          </p>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Your portfolio, made for a
            <RotatingWord />
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Enter your details once, pick a template, and get a clean portfolio that
            stays saved online. Edit it anytime and save it as a PDF.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
            >
              Create Portfolio <ArrowRightIcon />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3.5 text-base font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
            >
              See how it works
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckIcon width={16} height={16} className="text-emerald-500" /> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: a fan of the three templates */}
        <div className="relative mx-auto h-72 w-full max-w-sm sm:h-80 sm:max-w-md" aria-hidden>
          <div className={`${cardBase} left-0 top-0 -rotate-6`}>
            <TemplatePreview type="creative" />
          </div>
          <div className={`${cardBase} right-0 top-8 rotate-6`}>
            <TemplatePreview type="modern" />
          </div>
          <div className="absolute left-1/2 top-28 -translate-x-1/2 sm:top-32">
            <div className="motion-safe:animate-float">
              <div className={`${cardBase} relative`}>
                <TemplatePreview type="simple" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}