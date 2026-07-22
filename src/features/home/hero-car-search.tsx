"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { FormEvent } from "react";

export function HeroCarSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/cars?q=${encodeURIComponent(trimmed)}` : "/cars");
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="focus-within:border-primary/60 flex flex-col gap-2 rounded-xl border border-white/25 bg-white/10 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md transition-colors sm:flex-row sm:items-center sm:rounded-full sm:p-1.5"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/50" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by make, model, e.g. BMW, Honda…"
            aria-label="Search for a car by brand or model"
            className="h-11 rounded-lg border-none bg-transparent pl-11 text-white placeholder:text-white/50 focus-visible:ring-0 sm:rounded-full dark:bg-transparent"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="shadow-luxury h-11 w-full gap-2 rounded-lg px-7 text-sm font-semibold tracking-[0.06em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-10px_rgba(192,0,0,0.6)] sm:w-auto sm:rounded-full"
        >
          <Search className="size-4" />
          Search
        </Button>
      </form>
    </div>
  );
}
