"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, differenceInCalendarDays } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, CheckCircle2, XCircle } from "lucide-react";
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
    <Card className="h-[400px] flex flex-col overflow-hidden shadow-xs rounded-2xl border border-border/80">
      <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-bold">Jadwal Piket Saya</CardTitle>
        </div>
        <div className="flex items-center justify-between border rounded-xl bg-background px-1 py-0.5 shadow-2xs">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-bold text-foreground">
            {format(currentDate, "MMMM yyyy", { locale: id })}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={nextMonth}>
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
          <div className="p-3.5 flex flex-col gap-2.5">
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
                      className={`flex flex-col gap-1.5 p-3 rounded-xl border transition-all ${isPast ? "bg-muted/30 opacity-60 grayscale-[0.3] border-dashed" : "bg-card hover:bg-muted/40 border-border/80 shadow-2xs"
                        }`}
                    >
                      <span className="text-xs font-bold text-foreground">
                        {format(new Date(item.tanggal), "EEEE, d MMMM yyyy", { locale: id })}
                      </span>
                      <div className="flex justify-between items-center mt-0.5">
                        <div>
                          {differenceInCalendarDays(new Date(item.tanggal), new Date()) <= 0 && (
                            <div className="flex items-center gap-1.5">
                              {item.is_hadir ? (
                                <span className="flex items-center text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-bold border border-emerald-200 dark:border-emerald-800">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Hadir
                                </span>
                              ) : (
                                <span className="flex items-center text-[10px] text-red-700 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full font-bold border border-red-200 dark:border-red-800">
                                  <XCircle className="w-3 h-3 mr-1" /> Absen
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${className}`}>
                          {text}
                        </span>
                      </div>
                    </div>
                  );
                })
            ) : (
              !isLoading && (
                <div className="text-center text-xs text-muted-foreground italic py-10 px-4">
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
