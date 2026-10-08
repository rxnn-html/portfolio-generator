import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolio } from "@/lib/getPortfolio";
import { getInitials } from "@/lib/format";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import { ArrowLeftIcon, PencilIcon } from "@/components/ui/Icons";
import DeleteButton from "@/components/DeleteButton";
import PrintButton from "@/components/PrintButton";
import CopyLinkButton from "@/components/CopyLinkButton";
import TemplateSwitcher from "@/components/TemplateSwitcher";
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

// ["a", "b", "c"] -> "a, b and c"
function joinNice(items) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export default async function PortfolioPage({ params }) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) notFound();

  const Template = TEMPLATE_COMPONENTS[portfolio.template] || SimpleTemplate;

  const updated = new Date(portfolio.updated_at).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila",
  });

  // What is still missing? Used for the progress bar and the tip box.
  const missing = [
    !portfolio.profile_image && "a profile photo",
    !portfolio.about_me && "an introduction",
    portfolio.skills.length === 0 && "your skills",
    portfolio.projects.length === 0 && "a project",
    portfolio.experiences.length === 0 && "work experience",
    portfolio.education.length === 0 && "your education",
    portfolio.social_links.length === 0 && "social links",
  ].filter(Boolean);
  const percent = Math.round(((7 - missing.length) / 7) * 100);

  return (
    <div>
      {/* ---------- HEADER (hidden when printing) ---------- */}
      <div className="mb-6 space-y-4 print:hidden">
        <Button href="/manage" variant="ghost" size="sm" className="-ml-2">
          <ArrowLeftIcon width={16} height={16} /> Back to Manage Portfolios
        </Button>

        <Card className="overflow-hidden">
          <div className="h-20 bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 sm:h-24" />

          <div className="px-5 pb-6 sm:px-7">
            {/* Identity */}
            <div className="-mt-10 flex items-end gap-4 sm:-mt-12">
              {portfolio.profile_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={portfolio.profile_image}
                  alt={portfolio.full_name}
                  className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-white dark:ring-[#131a2b] sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white ring-4 ring-white dark:ring-[#131a2b] sm:h-24 sm:w-24 sm:text-3xl">
                  {getInitials(portfolio.full_name)}
                </div>
              )}
              <div className="min-w-0 pb-1">
                <h1 className="truncate text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  {portfolio.full_name}
                </h1>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <Badge className="capitalize">{portfolio.template} template</Badge>
                  <Badge tone="gray">Updated {updated}</Badge>
                </div>
              </div>
            </div>

            {/* Profile strength */}
            <div className="mt-5 flex items-center gap-3">
              <div className="h-2 w-full max-w-48 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-linear-to-r from-indigo-500 to-fuchsia-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-500">{percent}% complete</span>
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-col gap-5 border-t border-gray-200 pt-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Change template
                </p>
                <TemplateSwitcher portfolioId={portfolio.id} current={portfolio.template} />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button href={`/create?edit=${portfolio.id}`}>
                  <PencilIcon width={16} height={16} /> Edit Portfolio
                </Button>
                <CopyLinkButton />
                <PrintButton name={portfolio.full_name} />
                <DeleteButton
                  portfolioId={portfolio.id}
                  name={portfolio.full_name}
                  redirectTo="/manage"
                  label="Delete Portfolio"
                />
              </div>
            </div>
          </div>
        </Card>

        {missing.length > 0 && (
          <Alert tone="info" title="Make it shine">
            Add {joinNice(missing.slice(0, 3))} to make your portfolio stand out.{" "}
            <Link href={`/create?edit=${portfolio.id}`} className="font-semibold underline">
              Edit portfolio
            </Link>
          </Alert>
        )}
      </div>

      {/* ---------- PREVIEW FRAME ---------- */}
      <div className="rounded-3xl border border-gray-200 bg-gray-100 p-2 sm:p-3 print:border-0 print:bg-transparent print:p-0">
        <div className="mb-2 flex items-center gap-2 px-2 pt-1 print:hidden">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-xs capitalize text-gray-500">
            Live preview · {portfolio.template} template
          </span>
        </div>

        {/* Only this part appears in the PDF */}
        <div className="print-area theme-fixed" data-theme={portfolio.template}>
          <Template portfolio={portfolio} />
        </div>
      </div>
    </div>
  );
}