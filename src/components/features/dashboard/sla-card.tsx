"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface SlaCardProps {
  sla: number;
}

export function SlaCard({ sla }: SlaCardProps) {
  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-green-500/10 via-background to-background relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
        <CardTitle className="text-sm font-semibold text-muted-foreground">Rata-rata Resolusi (SLA)</CardTitle>
        <div className="p-2 bg-green-500/10 rounded-lg">
          <Clock className="h-5 w-5 text-green-600" />
        </div>
      </CardHeader>
      <CardContent className="z-10 relative flex-1 flex flex-col justify-between">
        <div>
          <div className="text-3xl font-extrabold text-foreground mb-1">
            {sla > 0 ? (
              <>
                {sla < 60 ? (
                  <>{sla} <span className="text-lg font-semibold text-muted-foreground">menit</span></>
                ) : (
                  <>{Math.floor(sla / 60)} <span className="text-lg font-semibold text-muted-foreground">jam</span> {sla % 60} <span className="text-lg font-semibold text-muted-foreground">menit</span></>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Kecepatan penanganan eskalasi</p>
        </div>
      </CardContent>
    </Card>
  );
}
