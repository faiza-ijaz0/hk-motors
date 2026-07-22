"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/services/activity";

import type { Enums } from "@/types/supabase";

export type ActionResult =
  { success: true } | { success: false; error: string };

export type EmployeeInput = {
  fullName: string;
  email: string;
  phone: string;
  cnic: string;
  designation: string;
  department: string;
  salary: string;
  joiningDate: string;
  workStartTime: string;
  workEndTime: string;
  status: Enums<"employee_status">;
  address: string;
  notes: string;
};

function validate(input: EmployeeInput): string | null {
  if (!input.fullName.trim()) return "Full name is required.";
  if (!input.email.trim()) return "Email is required.";
  if (!input.phone.trim()) return "Phone number is required.";
  if (!input.designation.trim()) return "Designation is required.";
  if (!input.department.trim()) return "Department is required.";
  if (!input.joiningDate) return "Joining date is required.";
  const salary = Number(input.salary);
  if (!Number.isFinite(salary) || salary < 0) {
    return "Salary must be a valid non-negative number.";
  }
  return null;
}

export async function createEmployeeAction(
  input: EmployeeInput,
): Promise<ActionResult> {
  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("employees")
      .insert({
        full_name: input.fullName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        cnic: input.cnic.trim() || null,
        designation: input.designation.trim(),
        department: input.department.trim(),
        salary: Number(input.salary),
        joining_date: input.joiningDate,
        work_start_time: input.workStartTime || "09:00",
        work_end_time: input.workEndTime || "18:00",
        status: input.status,
        address: input.address.trim() || null,
        notes: input.notes.trim() || null,
      })
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Added employee "${input.fullName.trim()}"`,
      entityTable: "employees",
      entityId: data.id,
    });
    revalidatePath("/super-admin/employees");
    revalidatePath("/super-admin");
    return { success: true };
  } catch (err) {
    console.error("createEmployeeAction failed", err);
    return {
      success: false,
      error: "Something went wrong adding the employee.",
    };
  }
}

export async function updateEmployeeAction(
  id: string,
  input: EmployeeInput,
): Promise<ActionResult> {
  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("employees")
      .update({
        full_name: input.fullName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        cnic: input.cnic.trim() || null,
        designation: input.designation.trim(),
        department: input.department.trim(),
        salary: Number(input.salary),
        joining_date: input.joiningDate,
        work_start_time: input.workStartTime || "09:00",
        work_end_time: input.workEndTime || "18:00",
        status: input.status,
        address: input.address.trim() || null,
        notes: input.notes.trim() || null,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Updated employee "${input.fullName.trim()}"`,
      entityTable: "employees",
      entityId: id,
    });
    revalidatePath("/super-admin/employees");
    revalidatePath("/super-admin/salaries");
    return { success: true };
  } catch (err) {
    console.error("updateEmployeeAction failed", err);
    return {
      success: false,
      error: "Something went wrong updating the employee.",
    };
  }
}

export async function deleteEmployeeAction(
  id: string,
  fullName: string,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    // Cascades to employee_salaries (on delete cascade) — deleting an
    // employee removes their full salary history too.
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Deleted employee "${fullName}"`,
      entityTable: "employees",
      entityId: id,
    });
    revalidatePath("/super-admin/employees");
    revalidatePath("/super-admin/salaries");
    revalidatePath("/super-admin");
    return { success: true };
  } catch (err) {
    console.error("deleteEmployeeAction failed", err);
    return {
      success: false,
      error: "Something went wrong deleting the employee.",
    };
  }
}
