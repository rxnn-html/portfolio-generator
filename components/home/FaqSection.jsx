import SectionHeading from "@/components/home/SectionHeading";
import { ChevronDownIcon } from "@/components/home/Icons";

const faqs = [
  {
    q: "Do I need an account?",
    a: "No. There is no sign-up. Open the form, fill it in, and your portfolio is saved.",
  },
  {
    q: "Can I edit my portfolio later?",
    a: "Yes. Open My Portfolios and press Edit. You can also change the template at any time without losing your information.",
  },
  {
    q: "Can I download it as a PDF?",
    a: "Yes. Open your portfolio and click Print / Save as PDF. For the dark Creative template, tick Background graphics in the print window so the colors are included.",
  },
  {
    q: "Is my information private?",
    a: "There are no accounts yet, so saved portfolios can be seen by anyone who visits the My Portfolios page. Please don't enter anything you want to keep private.",
  },
  {
    q: "Does it work on my phone?",
    a: "Yes. Every page and all three templates adapt to phones, tablets, and desktops.",
  },
];

export default function FaqSection() {
  return (
    <section>
      <SectionHeading eyebrow="FAQ" title="Questions? Answered." />

      {/* <details> is built into HTML: it opens and closes with no JavaScript */}
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 open:shadow-sm dark:border-white/10"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDownIcon className="shrink-0 text-slate-400 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}