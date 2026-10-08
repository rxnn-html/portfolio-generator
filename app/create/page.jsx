import { notFound } from "next/navigation";
import PortfolioForm from "@/components/PortfolioForm";
import Stepper from "@/components/ui/Stepper";
import { getPortfolio } from "@/lib/getPortfolio";

export const metadata = { title: "Create Portfolio | Portfolio Generator" };
export const dynamic = "force-dynamic";

export default async function CreatePage({ searchParams }) {
  const { edit } = await searchParams; // the ?edit=... part of the URL

  let portfolio = null;
  if (edit) {
    portfolio = await getPortfolio(edit); // null if the id is wrong or missing
    if (!portfolio) notFound();
  }
  const isEditing = Boolean(portfolio);

  return (
    <div className="mx-auto max-w-6xl">
      {/* HEADER */}
      <section className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-9 text-white sm:px-10 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">
          {isEditing ? "Editing" : "New portfolio"}
        </p>
        <h1 className="relative mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
          {isEditing ? `Edit ${portfolio.full_name}'s portfolio` : "Let's build your portfolio"}
        </h1>
        <p className="relative mt-3 max-w-xl text-base text-indigo-100 sm:text-lg">
          {isEditing
            ? "Change anything you like, then save. Your template choice stays the same."
            : "Start with your name and email. Everything else is optional, so add as much as you like."}
        </p>
      </section>

      {!isEditing && <Stepper current={0} />}

      <PortfolioForm key={portfolio ? portfolio.id : "new"} portfolio={portfolio} />
    </div>
  );
}