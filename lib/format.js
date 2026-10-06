// Small text helpers used by the three templates.

// "Juan Dela Cruz" -> "JD" (used when there is no profile picture)
export function getInitials(name) {
  return (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

// "React, Node.js, Supabase" -> ["React", "Node.js", "Supabase"]
export function splitList(text) {
  return text
    ? text.split(",").map((item) => item.trim()).filter(Boolean)
    : [];
}

// Builds "Jan 2024 – Present" from a start and end date
export function dateRange(start, end) {
  if (start && end) return `${start} – ${end}`;
  if (start) return `${start} – Present`;
  return end || "";
}

// "https://github.com/juan/" -> "github.com/juan" (cleaner link text)
export function displayUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.host}${parsed.pathname}`.replace(/\/$/, "");
  } catch {
    return url;
  }
}