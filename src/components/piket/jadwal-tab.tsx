"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getJadwalByRange } from "@/lib/actions/jadwal";

interface JadwalTabProps {
  initialData: any[];
}

export function JadwalTab({ initialData }: JadwalTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jadwal, setJadwal] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  const startDay = monthStart.getDay();
  const adjustedStart = new Date(monthStart);
  adjustedStart.setDate(monthStart.getDate() - (startDay === 0 ? 6 : startDay - 1));

  const endDay = monthEnd.getDay();
  const adjustedEnd = new Date(monthEnd);
  adjustedEnd.setDate(monthEnd.getDate() + (endDay === 0 ? 0 : 7 - endDay));

  // Fetch data when month changes
  useEffect(() => {
    const fetchNewJadwal = async () => {
      setIsLoading(true);
      try {
        const data = await getJadwalByRange(
          format(adjustedStart, "yyyy-MM-dd"),
          format(adjustedEnd, "yyyy-MM-dd")
        );
        setJadwal(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // Skip initial fetch if it's the current month (already has initialData)
    const now = new Date();
    if (currentDate.getFullYear() === now.getFullYear() && currentDate.getMonth() === now.getMonth()) {
      setJadwal(initialData);
    } else {
      fetchNewJadwal();
    }
  }, [currentDate.getMonth(), currentDate.getFullYear(), initialData]);

  const getScheduleForDay = (date: Date) => {
    return jadwal.filter(item => isSameDay(new Date(item.tanggal), date));
  };

  // --- DESKTOP LOGIC (MONTH) ---
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const monthDays = eachDayOfInterval({ start: adjustedStart, end: adjustedEnd });

  // --- MOBILE LOGIC (WEEK) ---
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  const weekDaysInterval = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weekDaysLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const shortWeekDaysLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      
      {/* --- DESKTOP HEADER (Hidden on mobile) --- */}
      <div className="hidden md:flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card border rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            {isLoading ? <Loader2 className="h-6 w-6 text-primary animate-spin" /> : <CalendarIcon className="h-6 w-6 text-primary" />}
          </div>
          <div>
            <h2 className="text-xl font-bold capitalize">
              {format(currentDate, "MMMM yyyy", { locale: id })}
            </h2>
            <p className="text-sm text-muted-foreground">
              Jadwal Piket Petugas Bulanan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={goToToday} className="rounded-lg">
            Hari Ini
          </Button>
          <div className="flex items-center rounded-lg border overflow-hidden shadow-sm">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-none border-r hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-none hover:bg-muted">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- MOBILE HEADER (Hidden on desktop) --- */}
      <div className="flex md:hidden flex-col gap-4 p-4 bg-card border rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {format(weekStart, "d MMM", { locale: id })} - {format(weekEnd, "d MMM yyyy", { locale: id })}
              </h2>
              <p className="text-xs text-muted-foreground">
                Jadwal Mingguan
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" onClick={goToToday} className="flex-1 rounded-lg">
            Hari Ini
          </Button>
          <div className="flex items-center rounded-lg border overflow-hidden shadow-sm flex-1">
            <Button variant="ghost" onClick={prevWeek} className="flex-1 rounded-none border-r hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={nextWeek} className="flex-1 rounded-none hover:bg-muted">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- DESKTOP CALENDAR GRID (Hidden on mobile) --- */}
      <div className="hidden md:block bg-card border rounded-2xl shadow-sm overflow-hidden relative">
        {isLoading && <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>}
        <div className="grid grid-cols-7 border-b bg-muted/40">
          {shortWeekDaysLabels.map((day, idx) => (
            <div key={day} className={cn("p-3 text-center text-sm font-semibold", 
              idx >= 5 ? "text-red-500" : "text-muted-foreground"
            )}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-[140px]">
          {monthDays.map((day, dayIdx) => {
            const schedule = getScheduleForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDate = isToday(day);

            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "border-b border-r p-2.5 flex flex-col gap-2 hover:bg-muted/30 transition-colors relative group",
                  !isCurrentMonth && "bg-muted/10 text-muted-foreground/50",
                  dayIdx % 7 === 6 && "border-r-0",
                  dayIdx >= monthDays.length - 7 && "border-b-0"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full transition-all",
                    isTodayDate ? "bg-primary text-primary-foreground shadow-md scale-110" : "",
                    !isCurrentMonth && !isTodayDate ? "opacity-50" : "text-foreground group-hover:text-primary"
                  )}>
                    {format(day, "d")}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
                  {schedule.slice(0, 3).map((item, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "text-[11px] px-2 py-1.5 rounded-md font-medium truncate border shadow-sm transition-all hover:scale-[1.02]",
                        item.pegawai.gender === 'L' 
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" 
                          : "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800"
                      )}
                      title={item.pegawai.name}
                    >
                      {item.pegawai.name}
                    </div>
                  ))}
                  {schedule.length > 3 && (
                    <div className="text-[10px] text-muted-foreground font-medium px-1">
                      +{schedule.length - 3} lainnya
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MOBILE CALENDAR LIST (Hidden on desktop) --- */}
      <div className="md:hidden flex flex-col gap-3 relative">
        {isLoading && <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>}
        {weekDaysInterval.map((day, idx) => {
          const schedule = getScheduleForDay(day);
          const isTodayDate = isToday(day);
          const isWeekend = idx >= 5;

          return (
            <div 
              key={day.toString()} 
              className={cn(
                "bg-card border rounded-xl p-4 flex flex-col gap-3 shadow-sm",
                isTodayDate ? "ring-2 ring-primary border-primary/50" : ""
              )}
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    isWeekend ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {weekDaysLabels[idx]}
                  </span>
                </div>
                <div className={cn(
                  "px-3 py-1 text-sm font-bold rounded-full",
                  isTodayDate ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                )}>
                  {format(day, "d MMM", { locale: id })}
                </div>
              </div>

              {schedule.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {schedule.map((item, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "text-sm px-3 py-2 rounded-lg font-medium border flex items-center justify-between",
                        item.pegawai.gender === 'L' 
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" 
                          : "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full", 
                          item.pegawai.gender === 'L' ? "bg-blue-500" : "bg-pink-500"
                        )} />
                        {item.pegawai.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground italic bg-muted/20 rounded-lg border border-dashed">
                  Tidak ada jadwal piket
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
