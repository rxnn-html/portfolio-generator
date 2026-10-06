// A tiny fake "screenshot" of each template, built with Tailwind boxes.
function Preview({ type }) {
  if (type === "simple") {
    return (
      <div className="flex h-full flex-col items-center gap-2 bg-white p-4">
        <div className="h-8 w-8 rounded-full bg-gray-300" />
        <div className="h-2 w-24 rounded bg-gray-800" />
        <div className="my-1 h-px w-full bg-gray-200" />
        <div className="h-1.5 w-full rounded bg-gray-200" />
        <div className="h-1.5 w-5/6 rounded bg-gray-200" />
        <div className="my-1 h-px w-full bg-gray-200" />
        <div className="h-1.5 w-full rounded bg-gray-200" />
        <div className="h-1.5 w-2/3 rounded bg-gray-200" />
      </div>
    );
  }

  if (type === "modern") {
    return (
      <div className="h-full space-y-2 bg-slate-100 p-3">
        <div className="flex items-center gap-2 rounded-xl bg-indigo-600 p-3">
          <div className="h-8 w-8 rounded-full bg-white/70" />
          <div className="space-y-1">
            <div className="h-2 w-20 rounded bg-white" />
            <div className="h-1.5 w-12 rounded bg-white/60" />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="h-3 w-10 rounded-full bg-indigo-200" />
          <div className="h-3 w-8 rounded-full bg-indigo-200" />
          <div className="h-3 w-12 rounded-full bg-indigo-200" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 rounded-lg bg-white shadow" />
          <div className="h-12 rounded-lg bg-white shadow" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-3 bg-slate-900 p-3">
      <div className="w-1/3 space-y-2">
        <div className="h-10 w-10 rotate-6 rounded-lg bg-amber-400" />
        <div className="h-2.5 w-full rounded bg-fuchsia-400" />
        <div className="h-1.5 w-2/3 rounded bg-slate-600" />
      </div>
      <div className="relative flex-1 border-l-2 border-fuchsia-500/50 pl-3">
        <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-amber-400" />
        <div className="absolute -left-[5px] top-8 h-2 w-2 rounded-full bg-amber-400" />
        <div className="absolute -left-[5px] top-[60px] h-2 w-2 rounded-full bg-amber-400" />
        <div className="h-2 w-3/4 rounded bg-slate-300" />
        <div className="mt-1 h-1.5 w-full rounded bg-slate-600" />
        <div className="mt-5 h-2 w-2/3 rounded bg-slate-300" />
        <div className="mt-1 h-1.5 w-full rounded bg-slate-600" />
        <div className="mt-5 h-2 w-1/2 rounded bg-slate-300" />
      </div>
    </div>
  );
}

export default function TemplateCard({ template, isCurrent, disabled, loading, onSelect }) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm ${
        isCurrent ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-200"
      }`}
    >
      <div className="h-44 overflow-hidden border-b border-gray-200">
        <Preview type={template.key} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{template.name}</h2>
          {isCurrent && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              Current
            </span>
          )}
        </div>
        <p className="mt-2 flex-1 text-sm text-gray-600">{template.description}</p>

        <button
          type="button"
          onClick={onSelect}
          disabled={disabled || loading}
          className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Use This Template"}
        </button>
      </div>
    </div>
  );
}