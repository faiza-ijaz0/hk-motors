"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitCarInquiryInput = {
  carId: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

export type SubmitCarInquiryResult =
  { success: true } | { success: false; error: string };

export async function submitCarInquiry(
  input: SubmitCarInquiryInput,
): Promise<SubmitCarInquiryResult> {
  if (!input.fullName.trim() || !input.message.trim()) {
    return { success: false, error: "Please fill in the required fields." };
  }
  if (!input.email.trim() && !input.phone.trim()) {
    return {
      success: false,
      error: "Please provide an email or phone number.",
    };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("leads").insert({
      full_name: input.fullName.trim(),
      email: input.email.trim() || null,
      phone: input.phone.trim() || null,
      message: input.message.trim(),
      lead_type: "car_inquiry",
      source: "website",
      car_id: input.carId,
    });

    if (error) {
      console.error("submitCarInquiry failed", error);
      return {
        success: false,
        error: "Something went wrong sending your inquiry. Please try again.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("submitCarInquiry: unexpected failure", err);
    return {
      success: false,
      error: "Something went wrong sending your inquiry. Please try again.",
    };
  }
}
