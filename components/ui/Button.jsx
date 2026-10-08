import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

const variants = {
  primary: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500",
  secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  danger: "border border-red-300 text-red-600 hover:bg-red-50",
  "danger-ghost": "text-red-600 hover:bg-red-50",
  "danger-solid": "bg-red-600 text-white shadow-sm hover:bg-red-500",
};

// min-h-11 = 44px, the recommended minimum size for a touch target
const sizes = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" {...rest} className={classes} disabled={disabled || loading}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}