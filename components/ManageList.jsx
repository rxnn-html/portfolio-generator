"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import DeleteButton from "@/components/DeleteButton";
import { PencilIcon } from "@/components/ui/Icons";
import { getInitials } from "@/lib/format";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "simple", label: "Simple" },
  { key: "modern", label: "Modern" },
  { key: "creative", label: "Creative" },
];

// Each template gets its own cover color so cards are easy to tell apart
const COVERS = {
  simple: "from-slate-500 to-slate-700",
  modern: "from-indigo-600 to-violet-600",
  creative: "from-fuchsia-600 to-amber-500",
};

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function ManageList({ portfolios }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Recalculated only when the list, search, or filter changes
  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return portfolios.filter((p) => {
      const matchesFilter = filter === "all" || p.template === filter;
      const matchesText =
        !text ||
        p.full_name.toLowerCase().includes(text) ||
        p.email.toLowerCase().includes(text);
      return matchesFilter && matchesText;
    });
  }, [portfolios, query, filter]);

  return (
    <div>
      {/* SEARCH + FILTERS */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative lg:w-96">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            aria-label="Search portfolios"
            className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
          />
        </div>

        <div role="radiogroup" aria-label="Filter by template"
          className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1">
          {FILTERS.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setFilter(item.key)}
                className={`min-h-9 rounded-lg px-4 text-sm font-semibold transition ${
                  active ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* NO RESULTS */}
      {visible.length === 0 && (
        <Card className="border-dashed p-10 text-center">
          <p className="text-lg font-semibold text-gray-900">No matches found</p>
          <p className="mt-1 text-sm text-gray-600">Try a different name or template filter.</p>
          <Button variant="secondary" className="mt-5"
            onClick={() => { setQuery(""); setFilter("all"); }}>
            Clear search
          </Button>
        </Card>
      )}

      {/* CARD GRID */}
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((p) => (
          <li key={p.id}>
            <Card className="group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
              {/* Cover */}
              <div className={`h-20 bg-linear-to-r ${COVERS[p.template] || COVERS.simple}`} />

              <div className="flex flex-1 flex-col px-5 pb-5">
                {/* Avatar overlaps the cover */}
                <div className="-mt-9">
                  {p.profile_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.profile_image} alt={p.full_name}
                      className="h-[4.5rem] w-[4.5rem] rounded-full object-cover ring-4 ring-white dark:ring-[#131a2b]" />
                  ) : (
                    <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white ring-4 ring-white dark:ring-[#131a2b]">
                      {getInitials(p.full_name)}
                    </div>
                  )}
                </div>

                <h2 className="mt-3 truncate text-lg font-bold text-gray-900">{p.full_name}</h2>
                <p className="truncate text-sm text-gray-500">{p.email}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="capitalize">{p.template}</Badge>
                  <Badge tone="gray">Created {p.created}</Badge>
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  <Button href={`/portfolio/${p.id}`} size="sm">View</Button>
                  <Button href={`/create?edit=${p.id}`} variant="secondary" size="sm">
                    <PencilIcon width={14} height={14} /> Edit
                  </Button>
                  <DeleteButton portfolioId={p.id} name={p.full_name} label="" className="px-3" />
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}