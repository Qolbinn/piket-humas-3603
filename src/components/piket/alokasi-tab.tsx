"use client";

import { useState, useTransition } from "react";
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, addMonths, startOfWeek, endOfWeek } from "date-fns";
import { id } from "date-fns/locale";
import { Plus, Users, CheckCircle2, Pencil, Trash2, CalendarCheck, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { deleteTemplate } from "@/lib/actions/template";
import { assignJadwal } from "@/lib/actions/jadwal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TemplateForm } from "@/components/template/template-form";

interface AlokasiTabProps {
  templates: any[];
  pegawais: any[];
}

export function AlokasiTab({ templates, pegawais }: AlokasiTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentYear = new Date().getFullYear();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [selectedWeeks, setSelectedWeeks] = useState<{start: string, end: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTemplateForAssign = templates.find(t => t.id === selectedTemplateId);

  // Assignment Logic
  const targetDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1);
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(monthStart);

  // Generate weeks for the selected month
  const weeks = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 }
  ).map((weekStart, idx) => {
    const wStart = startOfWeek(weekStart, { weekStartsOn: 1 });
    const wEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    // Clamp to month
    const displayStart = wStart < monthStart ? monthStart : wStart;
    const displayEnd = wEnd > monthEnd ? monthEnd : wEnd;

    // We only care about Mon-Fri
    const friday = new Date(wStart);
    friday.setDate(wStart.getDate() + 4);

    return {
      id: `w-${idx}`,
      label: `Minggu ke-${idx + 1}`,
      start: format(displayStart, "yyyy-MM-dd"),
      end: format(displayEnd, "yyyy-MM-dd"),
      displayRange: `${format(displayStart, "d MMM", { locale: id })} - ${format(displayEnd, "d MMM yyyy", { locale: id })}`,
      isValid: displayStart <= monthEnd && displayEnd >= monthStart
    };
  }).filter(w => w.isValid);

  const toggleWeek = (week: {start: string, end: string}) => {
    setSelectedWeeks(prev =>
      prev.some(w => w.start === week.start) 
        ? prev.filter(w => w.start !== week.start) 
        : [...prev, week]
    );
  };

  const toggleAllWeeks = () => {
    if (selectedWeeks.length === weeks.length) {
      setSelectedWeeks([]);
    } else {
      setSelectedWeeks(weeks.map(w => ({ start: w.start, end: w.end })));
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedWeeks([]);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setSelectedWeeks([]);
  };

  const openAssignDialog = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setSelectedYear(String(new Date().getFullYear()));
    setSelectedMonth(String(new Date().getMonth() + 1));
    setSelectedWeeks([]);
    setAssignDialogOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedTemplateId || selectedWeeks.length === 0) return;

    startTransition(async () => {
      try {
        let totalCount = 0;
        for (const week of selectedWeeks) {
          const res = await assignJadwal(selectedTemplateId, week.start, week.end);
          if (res.success) totalCount += res.count || 0;
        }
        toast.success(`Berhasil menerapkan template ke ${selectedWeeks.length} minggu (${totalCount} baris jadwal)`);
        setAssignDialogOpen(false);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus template ini?")) return;
    
    startTransition(async () => {
      try {
        await deleteTemplate(id);
        toast.success("Template berhasil dihapus");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Daftar Template Mingguan</h2>
          <p className="text-sm text-muted-foreground">Kelola pola jadwal petugas untuk di-assign secara massal.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari template..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => {
            setEditingTemplate(null);
            setTemplateDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Template Baru
          </Button>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTemplates.map((tpl) => (
          <Card key={tpl.id} className="overflow-hidden border-muted/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-muted/20 pb-4 border-b flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">{tpl.name}</CardTitle>
                <CardDescription>Alokasi 5 hari kerja (Senin - Jumat)</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => {
                    setEditingTemplate(tpl);
                    setTemplateDialogOpen(true);
                  }}
                  disabled={isPending}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteTemplate(tpl.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x">
                {[1, 2, 3, 4, 5].map((dayNum) => {
                  const dayName = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"][dayNum - 1];
                  const details = tpl.template_detail.filter((d: any) => d.day_of_week === dayNum);
                  
                  return (
                    <div key={dayNum} className="p-3 bg-card hover:bg-muted/10 transition-colors">
                      <div className="text-xs font-bold text-muted-foreground mb-2 text-center border-b pb-2">{dayName}</div>
                      <div className="flex flex-col gap-1.5 mt-2">
                        {details.map((d: any, i: number) => (
                          <div key={i} className={cn(
                            "text-[10px] sm:text-[11px] px-1.5 py-1 rounded truncate border flex items-center gap-1.5",
                            d.pegawai.gender === 'L'
                              ? "bg-blue-50/50 text-blue-700 border-blue-100"
                              : "bg-pink-50/50 text-pink-700 border-pink-100"
                          )}>
                            <div className={cn("w-1 h-1 rounded-full shrink-0", d.pegawai.gender === 'L' ? "bg-blue-500" : "bg-pink-500")} />
                            <span className="truncate">{d.pegawai.name}</span>
                          </div>
                        ))}
                        {details.length === 0 && (
                          <span className="text-xs text-center text-muted-foreground italic py-1">Kosong</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 pt-4 pb-4 border-t flex justify-end">
              <Button onClick={() => openAssignDialog(tpl.id)} className="shadow-sm">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Assign ke Kalender
              </Button>
            </CardFooter>
          </Card>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/5">
            <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Tidak ada template ditemukan</h3>
            <p className="text-sm text-muted-foreground">Silakan buat template alokasi petugas baru.</p>
          </div>
        )}
      </div>

      {/* Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Template ke Kalender</DialogTitle>
            <DialogDescription>
              Terapkan <b>{activeTemplateForAssign?.name}</b> ke minggu pilihan Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label>Tahun Target</Label>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(currentYear)}>{currentYear}</SelectItem>
                    <SelectItem value={String(currentYear + 1)}>{currentYear + 1}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Bulan Target</Label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Januari</SelectItem>
                    <SelectItem value="2">Februari</SelectItem>
                    <SelectItem value="3">Maret</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">Mei</SelectItem>
                    <SelectItem value="6">Juni</SelectItem>
                    <SelectItem value="7">Juli</SelectItem>
                    <SelectItem value="8">Agustus</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">Oktober</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">Desember</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Pilih Minggu (Senin - Jumat)</Label>
                <Button variant="ghost" size="sm" onClick={toggleAllWeeks} className="text-xs h-7 px-2">
                  {selectedWeeks.length === weeks.length ? "Batal Pilih Semua" : "Pilih Semua"}
                </Button>
              </div>

              <div className="space-y-2 border rounded-xl p-2 bg-muted/10 max-h-[250px] overflow-y-auto">
                {weeks.map((week) => {
                  const isChecked = selectedWeeks.some(w => w.start === week.start);
                  return (
                    <label
                      key={week.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
                        isChecked ? "bg-primary/5 border-primary shadow-sm" : "bg-background border-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleWeek({start: week.start, end: week.end})}
                          className={isChecked ? "border-primary bg-primary text-primary-foreground" : ""}
                        />
                        <div className="flex flex-col">
                          <span className={cn("text-sm font-medium", isChecked ? "text-primary" : "text-foreground")}>{week.label}</span>
                          <span className="text-xs text-muted-foreground">{week.displayRange}</span>
                        </div>
                      </div>
                      {isChecked && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)} disabled={isPending}>Batal</Button>
            <Button disabled={selectedWeeks.length === 0 || isPending} onClick={handleAssign}>
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
              ) : (
                <><Users className="mr-2 h-4 w-4" /> Terapkan ({selectedWeeks.length} Minggu)</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Create/Edit Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Buat Template Baru"}</DialogTitle>
            <DialogDescription>
              Tentukan formasi petugas piket untuk 5 hari kerja (Senin-Jumat).
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <TemplateForm 
              initialData={editingTemplate} 
              pegawais={pegawais} 
              onSuccess={() => setTemplateDialogOpen(false)}
              onCancel={() => setTemplateDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
