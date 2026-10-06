import Link from "next/link";

const steps = [
  { number: "1", title: "Enter your info", text: "Add your details, skills, projects, and experience." },
  { number: "2", title: "Pick a template", text: "Choose Simple, Modern, or Creative." },
  { number: "3", title: "Share your portfolio", text: "Preview it, edit it anytime, and keep it saved online." },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero section */}
      <section className="py-12 text-center sm:py-20">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Build your online portfolio
          <span className="block text-indigo-600">in minutes</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Enter your information once, choose one of three professional
          templates, and get a portfolio that is saved online and ready to
          preview, edit, or delete anytime.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/create"
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-indigo-700 sm:w-auto"
          >
            Create Portfolio
          </Link>
          <Link
            href="/manage"
            className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
          >
            View My Portfolios
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
          How it works
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}