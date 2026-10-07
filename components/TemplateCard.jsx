import TemplatePreview from "@/components/TemplatePreview";

export default function TemplateCard({ template, isCurrent, disabled, loading, onSelect }) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm ${
        isCurrent ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-200"
      }`}
    >
      <div className="h-44 overflow-hidden border-b border-gray-200">
        <TemplatePreview type={template.key} />
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