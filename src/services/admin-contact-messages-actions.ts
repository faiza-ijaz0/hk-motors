"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/services/activity";

export type ActionResult =
  { success: true } | { success: false; error: string };

export async function setContactMessageReadStatusAction(
  id: string,
  isRead: boolean,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: isRead })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Marked contact message as ${isRead ? "read" : "unread"}`,
      entityTable: "contact_messages",
      entityId: id,
    });

    revalidatePath("/super-admin/contact-leads");
    return { success: true };
  } catch (err) {
    console.error("setContactMessageReadStatusAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}
