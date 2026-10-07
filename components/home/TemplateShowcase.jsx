import Link from "next/link";
import SectionHeading from "@/components/home/SectionHeading";
import TemplatePreview from "@/components/TemplatePreview";
import { ArrowRightIcon } from "@/components/home/Icons";

const templates = [
  {
    key: "simple",
    name: "Simple",
    text: "Clean, minimal, and print-friendly. A classic resume layout.",
  },
  {
    key: "modern",
    name: "Modern",
    text: "Rounded cards, skill badges, and a sticky navigation bar.",
  },
  {
    key: "creative",
    name: "Creative",
    text: "A bold dark design with a timeline and oversized type.",
  },
];

export default function TemplateShowcase() {
  return (
    <section>
      <SectionHeading
        eyebrow="Templates"
        title="Three looks, one click apart"
        text="Same information, completely different personality. Switch anytime."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {templates.map((template) => (
          <Link
            key={template.key}
            href="/create"
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10"
          >
            <div className="h-44 overflow-hidden border-b border-slate-200 dark:border-white/10">
              <TemplatePreview type={template.key} />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{template.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {template.text}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                Try it
                <ArrowRightIcon width={16} height={16} className="transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}