import { CheckIcon } from "@/components/ui/Icons";

const STEPS = ["Your details", "Choose a template", "Preview"];

export default function Stepper({ current = 0 }) {
  return (
    <ol className="mb-8 flex items-center gap-2 sm:gap-3" aria-label="Progress">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;

        return (
          <li
            key={label}
            className="flex flex-1 items-center gap-2 last:flex-none sm:gap-3"
          >
            <span
              aria-current={active ? "step" : undefined}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                done
                  ? "bg-emerald-500 text-white"
                  : active
                  ? "bg-indigo-600 text-white ring-4 ring-indigo-500/20"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {done ? <CheckIcon width={16} height={16} /> : i + 1}
            </span>
            {/* On phones only the current step shows its label */}
            <span
              className={`text-sm font-medium ${
                active ? "inline text-gray-900" : "hidden text-gray-500 sm:inline"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-gray-200" />}
          </li>
        );
      })}
    </ol>
  );
}