import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

/**
 * Server-side client for anonymous, RLS-governed public reads (Server
 * Components only). No session/cookie handling — there's no auth flow yet.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL and/or " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are missing from the " +
        "environment. Set them wherever this is running (see .env.example).",
    );
  }

  return createSupabaseClient<Database>(url, key);
}
