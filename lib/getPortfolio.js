import { supabase } from "@/lib/supabase";

// A UUID looks like 3f2a9c1e-5b7d-4c2a-9e1f-0a1b2c3d4e5f
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Checks the id looks right BEFORE asking the database
export function isValidId(id) {
  return typeof id === "string" && UUID_PATTERN.test(id);
}

// Loads one portfolio AND all of its related rows in a single request.
// Returns null if it does not exist.
export async function getPortfolio(id) {
  if (!isValidId(id)) return null;

  const { data, error } = await supabase
    .from("portfolios")
    .select("*, education(*), skills(*), projects(*), experiences(*), social_links(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getPortfolio failed:", error.message); // private log
    throw new Error("Could not load the portfolio."); // generic message
  }

  return data;
}