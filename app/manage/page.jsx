import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Toast from "@/components/ui/Toast";
import ManageList from "@/components/ManageList";

export const metadata = { title: "My Portfolios | Portfolio Generator" };
export const dynamic = "force-dynamic"; // always show fresh data

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila",
  });
}

export default async function ManagePage({ searchParams }) {
  const { notice } = await searchParams;

  const { data, error } = await supabase
    .from("portfolios")
    .select("id, full_name, email, profile_image, template, created_at")
    .order("created_at", { ascending: false }); // newest first

  if (error) console.error("Manage page load failed:", error.message);

  // Format dates here so the browser receives plain, ready-to-show text
  const portfolios = (data || []).map((p) => ({ ...p, created: formatDate(p.created_at) }));

  const stats = [
    { label: "Total", value: portfolios.length },
    { label: "Simple", value: portfolios.filter((p) => p.template === "simple").length },
    { label: "Modern", value: portfolios.filter((p) => p.template === "modern").length },
    { label: "Creative", value: portfolios.filter((p) => p.template === "creative").length },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <Toast notice={notice} />

      {/* HEADER */}
      <section className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-9 text-white sm:px-10 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
              My Portfolios
            </h1>
            <p className="mt-2 max-w-md text-indigo-100">
              View, edit, or delete your saved portfolios.
            </p>
          </div>
          <Button href="/create" variant="secondary" size="lg" className="shrink-0 border-0">
            + New Portfolio
          </Button>
        </div>

        <dl className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/15 p-4 backdrop-blur">
              <dd className="text-2xl font-extrabold">{stat.value}</dd>
              <dt className="text-xs uppercase tracking-wider text-indigo-100">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ERROR STATE */}
      {error && (
        <Alert tone="error" title="Could not load your portfolios">
          Please refresh the page and try again.
        </Alert>
      )}

      {/* EMPTY STATE */}
      {!error && portfolios.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-xl font-bold text-gray-900">No portfolios yet</p>
          <p className="mt-2 text-gray-600">
            Create your first one. It only takes a few minutes.
          </p>
          <Button href="/create" size="lg" className="mt-6">
            Create Portfolio
          </Button>
        </div>
      )}

      {/* LIST */}
      {!error && portfolios.length > 0 && <ManageList portfolios={portfolios} />}
    </div>
  );
}