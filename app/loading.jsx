export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="mx-auto max-w-6xl animate-pulse space-y-6">
      <div className="h-40 rounded-3xl bg-gray-200" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="h-52 rounded-2xl bg-gray-100" />
        <div className="h-52 rounded-2xl bg-gray-100" />
        <div className="hidden h-52 rounded-2xl bg-gray-100 xl:block" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}