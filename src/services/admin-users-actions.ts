"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/services/activity";

import type { Enums } from "@/types/supabase";

export type ActionResult =
  { success: true } | { success: false; error: string };

export type CreateUserInput = {
  fullName: string;
  email: string;
  phone: string;
  role: Enums<"user_role">;
};

export async function createUserAction(
  input: CreateUserInput,
): Promise<ActionResult> {
  if (!input.fullName.trim() || !input.email.trim()) {
    return { success: false, error: "Name and email are required." };
  }

  try {
    const supabase = createAdminClient();

    // Provisions a real Supabase Auth account so the `users` FK constraint
    // (users.id references auth.users.id) is satisfied. No invite email is
    // sent and no login page exists yet — the account is created with
    // status "invited" and can't actually sign in until auth is built.
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email: input.email.trim(),
        email_confirm: true,
        password: randomUUID(),
        user_metadata: { full_name: input.fullName.trim() },
      });

    if (authError || !authUser.user) {
      return {
        success: false,
        error: authError?.message ?? "Failed to create the account.",
      };
    }

    const { error: profileError } = await supabase.from("users").insert({
      id: authUser.user.id,
      full_name: input.fullName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim() || null,
      role: input.role,
      status: "invited",
    });

    if (profileError) {
      // Roll back the orphaned auth account if the profile insert fails.
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return { success: false, error: profileError.message };
    }

    await logActivity({
      action: `Created user "${input.fullName.trim()}"`,
      entityTable: "users",
      entityId: authUser.user.id,
    });
    revalidatePath("/super-admin/users");
    revalidatePath("/super-admin");
    return { success: true };
  } catch (err) {
    console.error("createUserAction failed", err);
    return { success: false, error: "Something went wrong creating the user." };
  }
}

export type UpdateUserInput = {
  fullName: string;
  email: string;
  phone: string;
  role: Enums<"user_role">;
  status: Enums<"user_status">;
};

export async function updateUserAction(
  id: string,
  input: UpdateUserInput,
): Promise<ActionResult> {
  if (!input.fullName.trim() || !input.email.trim()) {
    return { success: false, error: "Name and email are required." };
  }

  try {
    const supabase = createAdminClient();

    const { error: authError } = await supabase.auth.admin.updateUserById(id, {
      email: input.email.trim(),
    });
    if (authError) return { success: false, error: authError.message };

    const { error } = await supabase
      .from("users")
      .update({
        full_name: input.fullName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim() || null,
        role: input.role,
        status: input.status,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Updated user "${input.fullName.trim()}"`,
      entityTable: "users",
      entityId: id,
    });
    revalidatePath("/super-admin/users");
    return { success: true };
  } catch (err) {
    console.error("updateUserAction failed", err);
    return { success: false, error: "Something went wrong updating the user." };
  }
}

export async function deleteUserAction(
  id: string,
  fullName: string,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();

    // Cascades to the public.users profile row automatically
    // (users.id references auth.users.id on delete cascade).
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Deleted user "${fullName}"`,
      entityTable: "users",
      entityId: id,
    });
    revalidatePath("/super-admin/users");
    revalidatePath("/super-admin");
    return { success: true };
  } catch (err) {
    console.error("deleteUserAction failed", err);
    return { success: false, error: "Something went wrong deleting the user." };
  }
}
