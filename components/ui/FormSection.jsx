export default function FormSection({ id, number, icon: Icon, title, description, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <header className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
          <Icon />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold tracking-widest text-gray-400">
            {String(number).padStart(2, "0")}
          </p>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
        </div>
      </header>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}