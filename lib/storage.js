export const BUCKET = "profile-images";

// Turns a public image URL back into its file name in the bucket:
// ".../profile-images/abc123.jpg"  ->  "abc123.jpg"
// Returns null for anything that doesn't look like one of OUR files,
// so we can never accidentally delete something else.
export function imagePathFromUrl(url) {
  if (typeof url !== "string") return null;

  const marker = `/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;

  const path = url.slice(index + marker.length).split("?")[0];
  return path && !path.includes("/") ? path : null; // our files are never in sub-folders
}