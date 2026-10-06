import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Stop early with a clear message if the .env.local file is missing or wrong
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env.local file."
  );
}

// One shared client used everywhere in the app.
// It carries the public key, so RLS policies decide what it may do.
export const supabase = createClient(supabaseUrl, supabaseKey); 