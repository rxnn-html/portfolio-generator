export const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-xs transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25";

// Shared wrapper: label on top, hint underneath, optional counter on the right
function Shell({ label, required, hint, counter, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-2 text-sm font-medium text-gray-700">
        <span>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
        {counter}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  hint,
  maxLength,
  autoComplete,
}) {
  return (
    <Shell label={label} required={required} hint={hint}>
      <input
        type={type}
        className={inputClass}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
    </Shell>
  );
}

export function TextArea({ label, value, onChange, placeholder, hint, maxLength, rows = 4 }) {
  // Live "123/1500" counter that turns amber near the limit
  const counter = maxLength ? (
    <span
      className={`text-xs tabular-nums ${
        value.length > maxLength * 0.9 ? "text-amber-600" : "text-gray-400"
      }`}
    >
      {value.length}/{maxLength}
    </span>
  ) : null;

  return (
    <Shell label={label} hint={hint} counter={counter}>
      <textarea
        rows={rows}
        className={`${inputClass} resize-y`}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </Shell>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <Shell label={label}>
      <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Shell>
  );
}