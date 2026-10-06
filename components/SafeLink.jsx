import { isSafeUrl } from "@/lib/validation";

// Renders a link ONLY if the URL starts with http:// or https://.
// Anything else (like "javascript:...") is not shown at all.
export default function SafeLink({ href, className, children }) {
  if (!isSafeUrl(href)) return null;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}