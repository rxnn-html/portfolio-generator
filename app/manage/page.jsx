import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DeleteButton from "@/components/DeleteButton";
import Toast from "@/components/ui/Toast";

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
  const { data: portfolios, error } = await supabase
    .from("portfolios")
    .select("id, full_name, template, created_at")
    .order("created_at", { ascending: false }); // newest first

  if (error) console.error("Manage page load failed:", error.message);

  return (
    <div className="mx-auto max-w-4xl">
            <Toast notice={notice} />
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Portfolios</h1>
          <p className="mt-1 text-gray-600">View, edit, or delete your saved portfolios.</p>
        </div>
        <Link
          href="/create"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + New Portfolio
        </Link>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Your portfolios could not be loaded. Please refresh the page and try again.
        </div>
      )}

      {/* EMPTY STATE */}
      {!error && portfolios.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-gray-900">No portfolios yet</p>
          <p className="mt-1 text-gray-600">Create your first one. It only takes a few minutes.</p>
          <Link
            href="/create"
            className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Create Portfolio
          </Link>
        </div>
      )}

      {/* LIST */}
      {!error && portfolios.length > 0 && (
        <ul className="space-y-4">
          {portfolios.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-gray-900">{p.full_name}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Created {formatDate(p.created_at)}
                  <span className="mx-2">•</span>
                  Template:{" "}
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium capitalize text-indigo-700">
                    {p.template}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-start gap-2">
                <Link
                  href={`/portfolio/${p.id}`}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  View
                </Link>
                <Link
                  href={`/create?edit=${p.id}`}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </Link>
                <DeleteButton portfolioId={p.id} name={p.full_name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}