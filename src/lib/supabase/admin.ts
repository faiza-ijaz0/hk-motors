import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

/**
 * Service-role client — bypasses RLS entirely. Server Actions / route
 * handlers only. The `server-only` import above turns an accidental
 * client-side import into a build error, not just a lint warning.
 *
 * This exists because /super-admin has no auth session yet to satisfy the
 * staff-only RLS policies (current_staff_role() / is_staff()). Once real
 * auth exists, admin writes should move to the RLS-governed client with a
 * real session instead of this one — see docs/ARCHITECTURE.md.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase admin client is not configured: NEXT_PUBLIC_SUPABASE_URL " +
        "and/or SUPABASE_SERVICE_ROLE_KEY are missing from the environment.",
    );
  }

  return createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
