"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function StatsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentFilter = searchParams.get("stats_filter") || "today";

  const setFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("stats_filter", filter);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex bg-muted/50 p-1 rounded-lg">
      <button 
        onClick={() => setFilter("today")}
        className={cn("text-xs font-medium px-3 py-1.5 rounded-md transition-colors", currentFilter === "today" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
      >
        Hari Ini
      </button>
      <button 
        onClick={() => setFilter("week")}
        className={cn("text-xs font-medium px-3 py-1.5 rounded-md transition-colors", currentFilter === "week" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
      >
        Minggu Ini
      </button>
      <button 
        onClick={() => setFilter("month")}
        className={cn("text-xs font-medium px-3 py-1.5 rounded-md transition-colors", currentFilter === "month" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
      >
        Bulan Ini
      </button>
    </div>
  );
}
