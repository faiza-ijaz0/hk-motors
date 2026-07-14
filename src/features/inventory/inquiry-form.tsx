"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitCarInquiry } from "@/services/leads";

type Status = "idle" | "submitting" | "success" | "error";

export function InquiryForm({
  carId,
  carTitle,
}: {
  carId: string;
  carTitle: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = new FormData(event.currentTarget);
    const result = await submitCarInquiry({
      carId,
      fullName: String(form.get("full_name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? ""),
    });

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  if (status === "success") {
    return (
      <div className="border-border bg-card flex flex-col items-center gap-3 rounded-xl border p-8 text-center">
        <CheckCircle2 className="text-primary size-8" />
        <p className="font-display text-lg">Inquiry sent</p>
        <p className="text-muted-foreground text-sm">
          Thanks for your interest in the {carTitle} — our team will reach out
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" name="full_name" required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          defaultValue={`I'm interested in the ${carTitle}. Please contact me with more details.`}
        />
      </div>
      {status === "error" && (
        <p className="text-destructive text-sm">{errorMessage}</p>
      )}
      <Button
        type="submit"
        disabled={status === "submitting"}
        className="w-full"
      >
        {status === "submitting" ? "Sending…" : "Send Inquiry"}
      </Button>
    </form>
  );
}
