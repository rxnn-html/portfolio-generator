import Button from "@/components/ui/Button";

export const metadata = { title: "Page not found | Portfolio Generator" };

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center">
      <p className="bg-linear-to-r from-indigo-600 via-fuchsia-500 to-amber-500 bg-clip-text text-8xl font-black tracking-tight text-transparent">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-gray-600">
        The link may be wrong, or the portfolio may have been deleted.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/" size="lg">Go home</Button>
        <Button href="/manage" variant="secondary" size="lg">My portfolios</Button>
      </div>
    </div>
  );
}