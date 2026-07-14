"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/services/activity";

import type { Enums } from "@/types/supabase";

export type ActionResult =
  { success: true } | { success: false; error: string };

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    randomUUID().slice(0, 6)
  );
}

export type CarFormInput = {
  title: string;
  makeId: string;
  modelId: string;
  categoryId: string;
  year: string;
  vin: string;
  price: string;
  currencyCode: string;
  mileage: string;
  condition: Enums<"car_condition">;
  status: Enums<"car_status">;
  transmission: string;
  fuelType: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  engine: string;
  horsepower: string;
  seats: string;
  doors: string;
  description: string;
  isFeatured: boolean;
};

function buildCarRow(input: CarFormInput) {
  return {
    title: input.title.trim(),
    make_id: input.makeId,
    model_id: input.modelId,
    category_id: input.categoryId || null,
    year: Number(input.year),
    vin: input.vin.trim() || null,
    price: Number(input.price),
    currency_code: input.currencyCode.trim() || "PKR",
    mileage: input.mileage ? Number(input.mileage) : null,
    condition: input.condition,
    status: input.status,
    transmission: (input.transmission ||
      null) as Enums<"transmission_type"> | null,
    fuel_type: (input.fuelType || null) as Enums<"fuel_type"> | null,
    drivetrain: (input.drivetrain || null) as Enums<"drivetrain_type"> | null,
    exterior_color: input.exteriorColor.trim() || null,
    interior_color: input.interiorColor.trim() || null,
    engine: input.engine.trim() || null,
    horsepower: input.horsepower ? Number(input.horsepower) : null,
    seats: input.seats ? Number(input.seats) : null,
    doors: input.doors ? Number(input.doors) : null,
    description: input.description.trim() || null,
    is_featured: input.isFeatured,
  };
}

function validateCarInput(input: CarFormInput): string | null {
  if (!input.title.trim()) return "Title is required.";
  if (!input.makeId) return "Make is required.";
  if (!input.modelId) return "Model is required.";
  if (!input.year || Number.isNaN(Number(input.year))) {
    return "A valid year is required.";
  }
  if (!input.price || Number.isNaN(Number(input.price))) {
    return "A valid price is required.";
  }
  return null;
}

export async function createCarAction(
  input: CarFormInput,
): Promise<ActionResult> {
  const validationError = validateCarInput(input);
  if (validationError) return { success: false, error: validationError };

  let newCarId: string | undefined;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("cars")
      .insert({ ...buildCarRow(input), slug: slugify(input.title) })
      .select("id")
      .single();

    if (error || !data) {
      return {
        success: false,
        error: error?.message ?? "Failed to create the vehicle.",
      };
    }
    newCarId = data.id;

    await logActivity({
      action: `Created vehicle "${input.title.trim()}"`,
      entityTable: "cars",
      entityId: data.id,
    });
    revalidatePath("/super-admin/cars");
    revalidatePath("/super-admin");
  } catch (err) {
    console.error("createCarAction failed", err);
    return {
      success: false,
      error: "Something went wrong creating the vehicle.",
    };
  }

  redirect(`/super-admin/cars/${newCarId}/edit`);
}

export async function updateCarAction(
  id: string,
  input: CarFormInput,
): Promise<ActionResult> {
  const validationError = validateCarInput(input);
  if (validationError) return { success: false, error: validationError };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("cars")
      .update(buildCarRow(input))
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Updated vehicle "${input.title.trim()}"`,
      entityTable: "cars",
      entityId: id,
    });
    revalidatePath("/super-admin/cars");
    revalidatePath(`/super-admin/cars/${id}/edit`);
    revalidatePath("/super-admin");
    return { success: true };
  } catch (err) {
    console.error("updateCarAction failed", err);
    return {
      success: false,
      error: "Something went wrong updating the vehicle.",
    };
  }
}

export async function deleteCarAction(
  id: string,
  title: string,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Deleted vehicle "${title}"`,
      entityTable: "cars",
      entityId: id,
    });
    revalidatePath("/super-admin/cars");
    revalidatePath("/super-admin");
    return { success: true };
  } catch (err) {
    console.error("deleteCarAction failed", err);
    return {
      success: false,
      error: "Something went wrong deleting the vehicle.",
    };
  }
}

export async function toggleCarFeaturedAction(
  id: string,
  isFeatured: boolean,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("cars")
      .update({ is_featured: isFeatured })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath("/super-admin/cars");
    return { success: true };
  } catch (err) {
    console.error("toggleCarFeaturedAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}

export async function updateCarStatusAction(
  id: string,
  status: Enums<"car_status">,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("cars")
      .update({
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Set vehicle status to "${status}"`,
      entityTable: "cars",
      entityId: id,
    });
    revalidatePath("/super-admin/cars");
    revalidatePath("/super-admin");
    return { success: true };
  } catch (err) {
    console.error("updateCarStatusAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}

export async function createMakeAction(
  name: string,
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  if (!name.trim()) return { success: false, error: "Name is required." };

  try {
    const supabase = createAdminClient();
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    const { data, error } = await supabase
      .from("car_makes")
      .insert({ name: name.trim(), slug })
      .select("id")
      .single();

    if (error || !data) {
      return {
        success: false,
        error: error?.message ?? "Failed to create make.",
      };
    }
    revalidatePath("/super-admin/cars");
    return { success: true, id: data.id };
  } catch (err) {
    console.error("createMakeAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}

export async function createModelAction(
  makeId: string,
  name: string,
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  if (!name.trim()) return { success: false, error: "Name is required." };
  if (!makeId) return { success: false, error: "Select a make first." };

  try {
    const supabase = createAdminClient();
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    const { data, error } = await supabase
      .from("car_models")
      .insert({ make_id: makeId, name: name.trim(), slug })
      .select("id")
      .single();

    if (error || !data) {
      return {
        success: false,
        error: error?.message ?? "Failed to create model.",
      };
    }
    revalidatePath("/super-admin/cars");
    return { success: true, id: data.id };
  } catch (err) {
    console.error("createModelAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}

export async function uploadCarImageAction(
  carId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "No file selected." };
    }

    const supabase = createAdminClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${carId}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("cars")
      .upload(path, file, { contentType: file.type });
    if (uploadError) return { success: false, error: uploadError.message };

    const { count } = await supabase
      .from("car_images")
      .select("id", { count: "exact", head: true })
      .eq("car_id", carId);
    const isFirstImage = (count ?? 0) === 0;

    const { error: insertError } = await supabase.from("car_images").insert({
      car_id: carId,
      storage_path: path,
      position: count ?? 0,
      is_primary: isFirstImage,
    });
    if (insertError) return { success: false, error: insertError.message };

    revalidatePath(`/super-admin/cars/${carId}/edit`);
    return { success: true };
  } catch (err) {
    console.error("uploadCarImageAction failed", err);
    return {
      success: false,
      error: "Something went wrong uploading the image.",
    };
  }
}

export async function deleteCarImageAction(
  carId: string,
  imageId: string,
  storagePath: string,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    await supabase.storage.from("cars").remove([storagePath]);
    const { error } = await supabase
      .from("car_images")
      .delete()
      .eq("id", imageId);
    if (error) return { success: false, error: error.message };

    revalidatePath(`/super-admin/cars/${carId}/edit`);
    return { success: true };
  } catch (err) {
    console.error("deleteCarImageAction failed", err);
    return {
      success: false,
      error: "Something went wrong deleting the image.",
    };
  }
}

export async function setPrimaryCarImageAction(
  carId: string,
  imageId: string,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    await supabase
      .from("car_images")
      .update({ is_primary: false })
      .eq("car_id", carId);
    const { error } = await supabase
      .from("car_images")
      .update({ is_primary: true })
      .eq("id", imageId);
    if (error) return { success: false, error: error.message };

    revalidatePath(`/super-admin/cars/${carId}/edit`);
    return { success: true };
  } catch (err) {
    console.error("setPrimaryCarImageAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}
