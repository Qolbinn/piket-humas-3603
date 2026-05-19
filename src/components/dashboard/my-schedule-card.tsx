"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, differenceInCalendarDays } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMySchedule } from "@/lib/actions/jadwal";

export function MyScheduleCard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mySchedule, setMySchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const data = await getMySchedule(year, month);
        if (isMounted) setMySchedule(data);
      } catch (err) {
        console.error("Gagal mengambil jadwal:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchSchedule();
    return () => { isMounted = false; };
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getRelativeDayInfo = (dateStr: string) => {
    const targetDate = new Date(dateStr);
    const today = new Date();
    const diff = differenceInCalendarDays(targetDate, today);

    if (diff === 0) {
      return { text: "Hari ini", className: "bg-primary text-primary-foreground shadow-sm" };
    } else if (diff > 0) {
      return {
        text: diff === 1 ? "Besok" : `${diff} hari lagi`,
        className: "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
      };
    } else {
      return {
        text: diff === -1 ? "Kemarin" : `${Math.abs(diff)} hari lalu`,
        className: "bg-secondary text-secondary-foreground"
      };
    }
  };

  return (
    <Card className="h-[400px] flex flex-col overflow-hidden shadow-sm">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Jadwal Piket Saya</CardTitle>
        </div>
        <div className="flex items-center justify-between border rounded-md bg-background px-1 py-0.5">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(currentDate, "MMMM yyyy", { locale: id })}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative min-h-0">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <ScrollArea className="h-full">
          <div className="p-4 flex flex-col gap-3">
            {mySchedule.length > 0 ? (
              [...mySchedule]
                .sort((a, b) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dateA = new Date(a.tanggal);
                  const dateB = new Date(b.tanggal);
                  const isPastA = dateA < today;
                  const isPastB = dateB < today;

                  if (isPastA && !isPastB) return 1;
                  if (!isPastA && isPastB) return -1;
                  return dateA.getTime() - dateB.getTime();
                })
                .map((item, idx) => {
                  const { text, className } = getRelativeDayInfo(item.tanggal);
                  const isPast = differenceInCalendarDays(new Date(item.tanggal), new Date()) < 0;

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col gap-1.5 p-3 rounded-lg border transition-colors shadow-sm ${isPast ? "bg-muted/30 opacity-60 grayscale-[0.3] border-dashed" : "bg-card hover:bg-muted/50"
                        }`}
                    >
                      <span className="text-sm font-semibold text-foreground">
                        {format(new Date(item.tanggal), "EEEE, d MMMM yyyy", { locale: id })}
                      </span>
                      <div className="flex justify-end items-center">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${className}`}>
                          {text}
                        </span>
                      </div>
                    </div>
                  );
                })
            ) : (
              !isLoading && (
                <div className="text-center text-sm text-muted-foreground italic py-10 px-4">
                  Tidak ada jadwal piket di bulan ini.
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
