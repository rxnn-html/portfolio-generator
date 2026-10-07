import Link from "next/link";
import SectionHeading from "@/components/home/SectionHeading";
import {
  ArrowRightIcon,
  DownloadIcon,
  EyeIcon,
  LayoutIcon,
  PencilIcon,
} from "@/components/home/Icons";

const steps = [
  {
    title: "Add your details",
    text: "Your name and email are all you need to start. Add skills, projects, and experience whenever you like.",
    time: "About 5 minutes",
    Icon: PencilIcon,
  },
  {
    title: "Pick a template",
    text: "Choose Simple, Modern, or Creative. You can switch later without retyping anything.",
    time: "One click",
    Icon: LayoutIcon,
  },
  {
    title: "Preview it",
    text: "See your portfolio instantly, on desktop or phone. Want a change? Edit it and save.",
    time: "Instant",
    Icon: EyeIcon,
  },
  {
    title: "Keep or share it",
    text: "It stays saved online. Save it as a PDF, or update it anytime from My Portfolios.",
    time: "Always saved",
    Icon: DownloadIcon,
  },
];

const required = ["Full name", "Email"];
const optional = [
  "Profile photo",
  "About me",
  "Education",
  "Skills",
  "Projects",
  "Experience",
  "Social links",
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24">
      <SectionHeading
        eyebrow="How it works"
        title="From blank page to portfolio in four steps"
        text="No design skills needed. Here is what to expect."
      />

      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="relative rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                <step.Icon />
              </div>
              <span className="font-mono text-sm font-bold text-slate-300 dark:text-slate-600">
                0{i + 1}
              </span>
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {step.text}
            </p>
            <p className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
              {step.time}
            </p>

            {/* Little arrow between cards (large screens only) */}
            {i < steps.length - 1 && (
              <ArrowRightIcon
                aria-hidden
                className="absolute -right-[18px] top-10 hidden h-4 w-4 text-slate-300 dark:text-slate-600 lg:block"
              />
            )}
          </li>
        ))}
      </ol>

      {/* WHAT YOU'LL NEED */}
      <div className="mt-8 grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 md:grid-cols-[1fr_2fr] md:p-8">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">What you&apos;ll need</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Only two things are required. Start small and add more later.
          </p>
          <Link
            href="/create"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300"
          >
            Start now <ArrowRightIcon width={16} height={16} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Required
            </p>
            <div className="flex flex-wrap gap-2">
              {required.map((item) => (
                <span key={item} className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Optional
            </p>
            <div className="flex flex-wrap gap-2">
              {optional.map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}