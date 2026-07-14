import { createAdminClient } from "@/lib/supabase/admin";

import type { Json } from "@/types/supabase";

/**
 * Best-effort activity log write — never throws, since a logging failure
 * must never break the mutation it's attached to. `actor_id` is left null:
 * there's no auth session yet, so there's no real staff member to
 * attribute the action to (see src/lib/supabase/admin.ts).
 */
export async function logActivity({
  action,
  entityTable,
  entityId,
  diff,
}: {
  action: string;
  entityTable: string;
  entityId?: string;
  diff?: Record<string, unknown>;
}) {
  try {
    const supabase = createAdminClient();
    await supabase.from("activity_logs").insert({
      action,
      entity_table: entityTable,
      entity_id: entityId ?? null,
      diff: (diff as Json) ?? null,
      actor_id: null,
    });
  } catch (err) {
    console.error("logActivity failed", err);
  }
}
