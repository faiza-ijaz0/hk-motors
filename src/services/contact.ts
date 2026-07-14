"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitContactMessageInput = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type SubmitContactMessageResult =
  { success: true } | { success: false; error: string };

export async function submitContactMessage(
  input: SubmitContactMessageInput,
): Promise<SubmitContactMessageResult> {
  if (!input.fullName.trim() || !input.email.trim() || !input.message.trim()) {
    return { success: false, error: "Please fill in the required fields." };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert({
      full_name: input.fullName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim() || null,
      subject: input.subject.trim() || null,
      message: input.message.trim(),
    });

    if (error) {
      console.error("submitContactMessage failed", error);
      return {
        success: false,
        error: "Something went wrong sending your message. Please try again.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("submitContactMessage: unexpected failure", err);
    return {
      success: false,
      error: "Something went wrong sending your message. Please try again.",
    };
  }
}
