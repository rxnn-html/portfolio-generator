import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isValidId } from "@/lib/getPortfolio";
import TemplateSelector from "@/components/TemplateSelector";

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
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Choose a template</h1>

      {portfolio ? (
        <p className="mb-8 mt-2 text-gray-600">
          Pick the design for <strong>{portfolio.full_name}</strong>&apos;s portfolio. You can change it later.
        </p>
      ) : (
        <div className="mb-8 mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          No portfolio selected.{" "}
          <Link href="/create" className="font-semibold underline">Create one</Link> or{" "}
          <Link href="/manage" className="font-semibold underline">choose one from your list</Link>{" "}
          to use a template.
        </div>
      )}

      <TemplateSelector
        portfolioId={portfolio ? portfolio.id : null}
        currentTemplate={portfolio ? portfolio.template : null}
      />
    </div>
  );
}