"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";

/**
 * Renders nothing — just keeps a Realtime subscription open on
 * `contact_messages` so new submissions (or read/unread changes made by
 * another admin in another tab) show up without a manual refresh. If
 * Realtime isn't enabled for this table the subscription simply never
 * fires; the page still works fully via normal revalidation either way.
 */
export function ContactLeadsRealtime() {
  const router = useRouter();

  useEffect(() => {
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch (err) {
      console.error("ContactLeadsRealtime: client unavailable", err);
      return;
    }

    const channel = supabase
      .channel("admin-contact-messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
