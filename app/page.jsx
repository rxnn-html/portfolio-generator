import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import TemplateShowcase from "@/components/home/TemplateShowcase";
import FaqSection from "@/components/home/FaqSection";
import { ArrowRightIcon } from "@/components/home/Icons";

export default function HomePage() {
  return (
    <div className="space-y-20 sm:space-y-28">
      <HeroSection />
      <HowItWorks />
      <TemplateShowcase />
      <FaqSection />

      {/* FINAL CALL TO ACTION */}
      <section className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ready to build yours?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-indigo-100">
          It takes a few minutes, and you can change everything later.
        </p>
        <Link
          href="/create"
          className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-7 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition hover:bg-white"
        >
          Create Portfolio <ArrowRightIcon />
        </Link>
      </section>
    </div>
  );
}