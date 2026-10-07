import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolio } from "@/lib/getPortfolio";
import DeleteButton from "@/components/DeleteButton";
import PrintButton from "@/components/PrintButton";
import SimpleTemplate from "@/components/templates/SimpleTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import CreativeTemplate from "@/components/templates/CreativeTemplate";

export const metadata = { title: "Portfolio Preview | Portfolio Generator" };
export const dynamic = "force-dynamic";

// The lookup table: the value saved in the database picks the component
const TEMPLATE_COMPONENTS = {
  simple: SimpleTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
};

export default async function PortfolioPage({ params }) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) notFound();

  const Template = TEMPLATE_COMPONENTS[portfolio.template] || SimpleTemplate;

  return (
    <div>
      {/* ACTION BAR (hidden when printing) */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between print:hidden">
        <p className="text-sm text-gray-600">
          Template: <strong className="capitalize">{portfolio.template}</strong>
        </p>
        <div className="flex flex-wrap items-start gap-2">
          <Link href="/manage"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Back to Manage Portfolios
          </Link>
          <Link href={`/create?edit=${portfolio.id}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Edit Portfolio
          </Link>
          <Link href={`/templates?id=${portfolio.id}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Change Template
          </Link>
          <PrintButton name={portfolio.full_name} />
          <DeleteButton
            portfolioId={portfolio.id}
            name={portfolio.full_name}
            redirectTo="/manage"
          />
        </div>
      </div>

            {/* Only this part appears in the PDF */}
      <div className="print-area" data-theme={portfolio.template}>
        <Template portfolio={portfolio} />
      </div>
    </div>
  );
}