"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/services/activity";
import { getEmployeeSalaryHistory } from "@/services/admin-salaries";

import type { AdminSalaryListItem } from "@/services/admin-salaries";
import type { Enums } from "@/types/supabase";

/** Thin Server Action wrapper so the View modal (a client component) can
 * lazily fetch a given employee's recent payment history on open, without
 * every row in the table having to fetch it up front. */
export async function getEmployeeSalaryHistoryAction(
  employeeId: string,
  excludeId?: string,
): Promise<AdminSalaryListItem[]> {
  return getEmployeeSalaryHistory(employeeId, excludeId);
}

export type ActionResult =
  { success: true } | { success: false; error: string };

export type SalaryInput = {
  employeeId: string;
  salaryMonth: string;
  salaryYear: string;
  salaryAmount: string;
  paymentDate: string;
  paymentStatus: Enums<"salary_payment_status">;
  notes: string;
};

function validate(input: SalaryInput): string | null {
  if (!input.employeeId) return "Please select an employee.";
  const month = Number(input.salaryMonth);
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return "Please select a valid month.";
  }
  const year = Number(input.salaryYear);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return "Please enter a valid year.";
  }
  const amount = Number(input.salaryAmount);
  if (!Number.isFinite(amount) || amount < 0) {
    return "Salary amount must be a valid non-negative number.";
  }
  return null;
}

function friendlyError(message: string): string {
  if (
    message.includes(
      "employee_salaries_employee_id_salary_month_salary_year_key",
    )
  ) {
    return "A salary record for this employee, month, and year already exists.";
  }
  return message;
}

export async function createSalaryAction(
  input: SalaryInput,
): Promise<ActionResult> {
  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("employee_salaries")
      .insert({
        employee_id: input.employeeId,
        salary_month: Number(input.salaryMonth),
        salary_year: Number(input.salaryYear),
        salary_amount: Number(input.salaryAmount),
        payment_date: input.paymentDate || null,
        payment_status: input.paymentStatus,
        notes: input.notes.trim() || null,
      })
      .select("id")
      .single();

    if (error) return { success: false, error: friendlyError(error.message) };

    await logActivity({
      action: `Added ${input.salaryMonth}/${input.salaryYear} salary record`,
      entityTable: "employee_salaries",
      entityId: data.id,
    });
    revalidatePath("/super-admin/salaries");
    return { success: true };
  } catch (err) {
    console.error("createSalaryAction failed", err);
    return {
      success: false,
      error: "Something went wrong adding the salary record.",
    };
  }
}

export async function updateSalaryAction(
  id: string,
  input: SalaryInput,
): Promise<ActionResult> {
  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("employee_salaries")
      .update({
        employee_id: input.employeeId,
        salary_month: Number(input.salaryMonth),
        salary_year: Number(input.salaryYear),
        salary_amount: Number(input.salaryAmount),
        payment_date: input.paymentDate || null,
        payment_status: input.paymentStatus,
        notes: input.notes.trim() || null,
      })
      .eq("id", id);

    if (error) return { success: false, error: friendlyError(error.message) };

    await logActivity({
      action: `Updated ${input.salaryMonth}/${input.salaryYear} salary record`,
      entityTable: "employee_salaries",
      entityId: id,
    });
    revalidatePath("/super-admin/salaries");
    return { success: true };
  } catch (err) {
    console.error("updateSalaryAction failed", err);
    return {
      success: false,
      error: "Something went wrong updating the salary record.",
    };
  }
}

/** Quick Mark Paid/Unpaid toggle — sets payment_date to today when marking
 * paid, and clears it when reverting to unpaid (no payment has been made). */
export async function setSalaryPaymentStatusAction(
  id: string,
  status: Enums<"salary_payment_status">,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("employee_salaries")
      .update({
        payment_status: status,
        payment_date:
          status === "paid" ? new Date().toISOString().slice(0, 10) : null,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Marked salary record as ${status}`,
      entityTable: "employee_salaries",
      entityId: id,
    });
    revalidatePath("/super-admin/salaries");
    return { success: true };
  } catch (err) {
    console.error("setSalaryPaymentStatusAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}

export async function deleteSalaryAction(id: string): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("employee_salaries")
      .delete()
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    await logActivity({
      action: "Deleted salary record",
      entityTable: "employee_salaries",
      entityId: id,
    });
    revalidatePath("/super-admin/salaries");
    return { success: true };
  } catch (err) {
    console.error("deleteSalaryAction failed", err);
    return {
      success: false,
      error: "Something went wrong deleting the salary record.",
    };
  }
}
