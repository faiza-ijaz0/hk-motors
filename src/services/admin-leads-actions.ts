"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/services/activity";

import type { Enums } from "@/types/supabase";

export type ActionResult =
  { success: true } | { success: false; error: string };

export async function updateLeadStatusAction(
  id: string,
  status: Enums<"lead_status">,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Set lead status to "${status}"`,
      entityTable: "leads",
      entityId: id,
    });
    revalidatePath("/super-admin/leads");
    revalidatePath(`/super-admin/leads/${id}`);
    revalidatePath("/super-admin");
    return { success: true };
  } catch (err) {
    console.error("updateLeadStatusAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}

/** Read/Unread is derived from `status` (see services/admin-leads.ts) —
 * this just moves the lead between the "new" (unread) and "contacted"
 * (read) states so the table/modal can offer a simple toggle without
 * exposing the full status enum. */
export async function setLeadReadStatusAction(
  id: string,
  isRead: boolean,
): Promise<ActionResult> {
  return updateLeadStatusAction(id, isRead ? "contacted" : "new");
}

export async function assignLeadAction(
  id: string,
  userId: string | null,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("leads")
      .update({ assigned_to: userId })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    await logActivity({
      action: userId ? "Assigned lead" : "Unassigned lead",
      entityTable: "leads",
      entityId: id,
    });
    revalidatePath("/super-admin/leads");
    revalidatePath(`/super-admin/leads/${id}`);
    return { success: true };
  } catch (err) {
    console.error("assignLeadAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}

export async function addLeadNoteAction(
  leadId: string,
  note: string,
): Promise<ActionResult> {
  if (!note.trim()) return { success: false, error: "Note can't be empty." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("lead_notes")
      .insert({ lead_id: leadId, note: note.trim() });
    if (error) return { success: false, error: error.message };

    revalidatePath(`/super-admin/leads/${leadId}`);
    return { success: true };
  } catch (err) {
    console.error("addLeadNoteAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}

export async function deleteLeadNoteAction(
  leadId: string,
  noteId: string,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("lead_notes")
      .delete()
      .eq("id", noteId);
    if (error) return { success: false, error: error.message };

    revalidatePath(`/super-admin/leads/${leadId}`);
    return { success: true };
  } catch (err) {
    console.error("deleteLeadNoteAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}
