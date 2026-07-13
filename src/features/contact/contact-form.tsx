"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "submitting" | "success";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    // TODO: wire to Supabase `contact_messages` insert once the data layer
    // (src/services) and env-configured client exist. Anon insert is
    // already permitted by RLS — see docs/ARCHITECTURE.md §16.
    await new Promise((resolve) => setTimeout(resolve, 600));

    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="border-border bg-card flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <CheckCircle2 className="text-primary size-8" />
        <p className="font-display text-xl">Message sent</p>
        <p className="text-muted-foreground max-w-sm text-sm">
          Thanks for reaching out — a member of our team will get back to you
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" name="full_name" required autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject (optional)</Label>
          <Input id="subject" name="subject" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={5} />
      </div>

      <Button type="submit" disabled={status === "submitting"} size="lg">
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
