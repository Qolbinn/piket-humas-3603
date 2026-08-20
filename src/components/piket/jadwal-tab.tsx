"use client";

import { useState, useEffect, useTransition } from "react";
import { format, addMonths, subMonths, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, isSameDay, eachWeekOfInterval } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, Users, CalendarCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getJadwalByRange, assignJadwal } from "@/lib/actions/jadwal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface JadwalTabProps {
  initialData: any[];
  templates: any[];
}

export function JadwalTab({ initialData, templates }: JadwalTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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

  // --- ASSIGN LOGIC ---
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [weekSelections, setWeekSelections] = useState<Record<string, string>>({}); // { [weekStart]: templateId }

  // Generate weeks for the selected month in the calendar
  const weeks = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 }
  ).map((weekStart, idx) => {
    const wStart = startOfWeek(weekStart, { weekStartsOn: 1 });
    const wEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    const displayStart = wStart < monthStart ? monthStart : wStart;
    const displayEnd = wEnd > monthEnd ? monthEnd : wEnd;

    return {
      id: `w-${idx}`,
      label: `Minggu ke-${idx + 1}`,
      start: format(displayStart, "yyyy-MM-dd"),
      end: format(displayEnd, "yyyy-MM-dd"),
      displayRange: `${format(displayStart, "d MMM", { locale: id })} - ${format(displayEnd, "d MMM yyyy", { locale: id })}`,
      isValid: displayStart <= monthEnd && displayEnd >= monthStart
    };
  }).filter(w => w.isValid);

  const applyToAll = (templateId: string) => {
    if (templateId === "none") {
      setWeekSelections({});
      return;
    }
    const newSelections: Record<string, string> = {};
    weeks.forEach(w => {
      newSelections[w.start] = templateId;
    });
    setWeekSelections(newSelections);
  };

  const openAssignDialog = () => {
    setWeekSelections({});
    setAssignDialogOpen(true);
  };

  const handleAssign = async () => {
    const weeksToAssign = weeks.filter(w => weekSelections[w.start] && weekSelections[w.start] !== "none");
    if (weeksToAssign.length === 0) return;

    startTransition(async () => {
      try {
        let totalCount = 0;
        for (const week of weeksToAssign) {
          const templateId = weekSelections[week.start];
          const res = await assignJadwal(templateId, week.start, week.end);
          if (res.success) totalCount += res.count || 0;
        }
        toast.success(`Berhasil menerapkan template ke ${weeksToAssign.length} minggu (${totalCount} baris jadwal)`);
        setAssignDialogOpen(false);
        router.refresh();
        
        // Refresh local data to show assigned changes immediately
        const data = await getJadwalByRange(
          format(adjustedStart, "yyyy-MM-dd"),
          format(adjustedEnd, "yyyy-MM-dd")
        );
        setJadwal(data);
      } catch (err: any) {
        toast.error(err.message);
      }
    });
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
          <Button variant="default" onClick={openAssignDialog} className="rounded-lg shadow-sm">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Assign Petugas
          </Button>
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
          <Button variant="default" size="sm" onClick={openAssignDialog} className="flex-[1.5] rounded-lg">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Assign Petugas
          </Button>
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

      {/* ASSIGN DIALOG */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Template ke Kalender</DialogTitle>
            <DialogDescription>
              Terapkan template alokasi pada bulan <b>{format(currentDate, "MMMM yyyy", { locale: id })}</b>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3 bg-muted/20 p-4 rounded-xl border">
              <Label className="text-primary font-semibold">Setel Serentak (Jalan Pintas)</Label>
              <Select onValueChange={applyToAll}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Pilih template untuk mengisi semua minggu..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-muted-foreground italic">-- Kosongkan Semua --</SelectItem>
                  {templates.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                  {templates.length === 0 && (
                    <SelectItem value="empty" disabled>Belum ada template</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Opsi ini akan mengubah semua pilihan di bawah secara otomatis.</p>
            </div>

            <div className="space-y-3">
              <Label>Daftar Minggu (Senin - Jumat)</Label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                {weeks.map((week) => {
                  const selectedVal = weekSelections[week.start] || "none";
                  const hasSelection = selectedVal !== "none";
                  return (
                    <div
                      key={week.id}
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border transition-all gap-3",
                        hasSelection ? "bg-primary/5 border-primary/40 shadow-sm" : "bg-background border-muted hover:border-border"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className={cn("text-sm font-medium", hasSelection ? "text-primary" : "text-foreground")}>{week.label}</span>
                        <span className="text-xs text-muted-foreground">{week.displayRange}</span>
                      </div>
                      
                      <Select 
                        value={selectedVal} 
                        onValueChange={(val) => setWeekSelections(prev => ({...prev, [week.start]: val}))}
                      >
                        <SelectTrigger className={cn("w-full sm:w-[180px] h-8 text-xs", !hasSelection && "text-muted-foreground")}>
                          <SelectValue placeholder="Lewati" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="text-muted-foreground italic">-- Lewati --</SelectItem>
                          {templates.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)} disabled={isPending}>Batal</Button>
            <Button disabled={Object.values(weekSelections).filter(v => v !== "none").length === 0 || isPending} onClick={handleAssign}>
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
              ) : (
                <><Users className="mr-2 h-4 w-4" /> Terapkan ({Object.values(weekSelections).filter(v => v !== "none").length} Minggu)</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
