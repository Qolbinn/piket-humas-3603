"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface SlaCardProps {
  sla: number;
}

export function SlaCard({ sla }: SlaCardProps) {
  return (
    <Card className="border border-border/80 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-emerald-500/10 via-background to-background relative overflow-hidden flex flex-col rounded-2xl">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rata-rata SLA Resolusi</CardTitle>
        <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
          <Clock className="h-4 w-4 stroke-[2.25]" />
        </div>
      </CardHeader>
      <CardContent className="z-10 relative flex-1 flex flex-col justify-between">
        <div>
          <div className="text-3xl font-extrabold text-foreground mb-1">
            {sla > 0 ? (
              <>
                {sla < 60 ? (
                  <>{sla} <span className="text-sm font-bold text-muted-foreground">menit</span></>
                ) : (
                  <>{Math.floor(sla / 60)} <span className="text-sm font-bold text-muted-foreground">jam</span> {sla % 60} <span className="text-sm font-bold text-muted-foreground">menit</span></>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Rata-rata kecepatan penanganan tiket</p>
        </div>
      </CardContent>
    </Card>
  );
}
