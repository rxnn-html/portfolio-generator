const tones = {
  error: "border-red-200 bg-red-50 text-red-800",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200",
  info: "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-400/30 dark:text-indigo-200",
};

export default function Alert({ tone = "info", title, className = "", children }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-2xl border p-4 text-sm ${tones[tone]} ${className}`}
    >
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? "mt-1" : ""}>{children}</div>}
    </div>
  );
}