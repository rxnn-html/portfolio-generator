import { supabase } from "@/lib/supabase";
import { isValidId } from "@/lib/getPortfolio";
import TemplateSelector from "@/components/TemplateSelector";
import Stepper from "@/components/ui/Stepper";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";

export const metadata = { title: "Choose a Template | Portfolio Generator" };

// Always read fresh data, never a saved copy from build time
export const dynamic = "force-dynamic";

export default async function TemplatesPage({ searchParams }) {
  const { id } = await searchParams; // the ?id=... part of the URL

  let portfolio = null;
  if (isValidId(id)) {
    const { data } = await supabase
      .from("portfolios")
      .select("id, full_name, template")
      .eq("id", id)
      .maybeSingle();
    portfolio = data;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-9 text-white sm:px-10 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
        <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">
          Step 2 of 3
        </p>
        <h1 className="relative mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
          Choose a template
        </h1>
        <p className="relative mt-3 max-w-xl text-base text-indigo-100 sm:text-lg">
          {portfolio
            ? `Pick the design for ${portfolio.full_name}'s portfolio. You can change it any time.`
            : "Pick a design. You can change it any time."}
        </p>
      </section>

      <Stepper current={1} />

      {!portfolio && (
        <Alert tone="warning" title="No portfolio selected" className="mb-8">
          <p>Create a portfolio first, or choose an existing one to apply a template.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button href="/create" size="sm">Create portfolio</Button>
            <Button href="/manage" variant="secondary" size="sm">My portfolios</Button>
          </div>
        </Alert>
      )}

      <TemplateSelector
        portfolioId={portfolio ? portfolio.id : null}
        currentTemplate={portfolio ? portfolio.template : null}
      />
    </div>
  );
}