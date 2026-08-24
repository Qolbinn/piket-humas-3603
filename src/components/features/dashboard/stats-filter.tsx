"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTransition, useState } from "react";

export function StatsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentFilter = searchParams.get("stats_filter") || "today";
  const [isPending, startTransition] = useTransition();
  const [pendingFilter, setPendingFilter] = useState<string | null>(null);

  const setFilter = (filter: string) => {
    setPendingFilter(filter);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("stats_filter", filter);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex bg-muted/50 p-1 rounded-lg">
      <button 
        onClick={() => setFilter("today")}
        disabled={isPending}
        className={cn("flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors", currentFilter === "today" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
      >
        {isPending && pendingFilter === "today" && <Loader2 className="h-3 w-3 animate-spin" />}
        Hari Ini
      </button>
      <button 
        onClick={() => setFilter("week")}
        disabled={isPending}
        className={cn("flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors", currentFilter === "week" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
      >
        {isPending && pendingFilter === "week" && <Loader2 className="h-3 w-3 animate-spin" />}
        Minggu Ini
      </button>
      <button 
        onClick={() => setFilter("month")}
        disabled={isPending}
        className={cn("flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors", currentFilter === "month" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
      >
        {isPending && pendingFilter === "month" && <Loader2 className="h-3 w-3 animate-spin" />}
        Bulan Ini
      </button>
    </div>
  );
}
