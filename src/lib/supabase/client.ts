import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

/**
 * Browser client (publishable key — safe to expose, access is governed by
 * RLS, not secrecy). Only needed where a client component must talk to
 * Supabase directly, e.g. a Realtime subscription — everything else should
 * go through a Server Component/Action using server.ts or admin.ts instead.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL and/or " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are missing from the " +
        "environment.",
    );
  }

  return createSupabaseClient<Database>(url, key);
}
