"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, addMonths } from "date-fns";
import { id } from "date-fns/locale";
import { Plus, Users, CheckCircle2, Pencil, Trash2, CalendarCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_TEMPLATES = [
  {
    id: "tpl-1",
    name: "Template Tim Alpha (Utama)",
    schedule: {
      "Senin": [{ name: "Budi Santoso", gender: "L" }, { name: "Rina Kartika", gender: "P" }],
      "Selasa": [{ name: "Andi Permana", gender: "L" }, { name: "Dewi Lestari", gender: "P" }],
      "Rabu": [{ name: "Budi Santoso", gender: "L" }, { name: "Siti Aminah", gender: "P" }],
      "Kamis": [{ name: "Andi Permana", gender: "L" }, { name: "Rina Kartika", gender: "P" }],
      "Jumat": [{ name: "Siti Aminah", gender: "P" }, { name: "Dewi Lestari", gender: "P" }, { name: "Budi Santoso", gender: "L" }],
    }
  },
  {
    id: "tpl-2",
    name: "Template Tim Beta (Cadangan)",
    schedule: {
      "Senin": [{ name: "Andi Permana", gender: "L" }, { name: "Siti Aminah", gender: "P" }],
      "Selasa": [{ name: "Budi Santoso", gender: "L" }, { name: "Rina Kartika", gender: "P" }],
      "Rabu": [{ name: "Dewi Lestari", gender: "P" }, { name: "Andi Permana", gender: "L" }],
      "Kamis": [{ name: "Budi Santoso", gender: "L" }, { name: "Siti Aminah", gender: "P" }],
      "Jumat": [{ name: "Rina Kartika", gender: "P" }, { name: "Dewi Lestari", gender: "P" }],
    }
  }
];

export function AlokasiTab() {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<string>("0");
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);

  const activeTemplateForAssign = MOCK_TEMPLATES.find(t => t.id === selectedTemplateId);

  // Assignment Logic
  const baseDate = new Date();
  const targetDate = addMonths(baseDate, parseInt(selectedMonthOffset));
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(monthStart);

  const weeks = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 }
  ).map((weekStart, idx) => {
    let workingStart = weekStart;
    let workingEnd = new Date(weekStart);
    workingEnd.setDate(workingStart.getDate() + 4);

    if (workingStart < monthStart) workingStart = monthStart;
    if (workingEnd > monthEnd) workingEnd = monthEnd;

    const isValidWeek = workingStart <= monthEnd && workingEnd >= monthStart;

    return {
      id: `w-${idx}`,
      label: `Minggu ke-${idx + 1}`,
      dateRange: `${format(workingStart, "d MMM", { locale: id })} - ${format(workingEnd, "d MMM yyyy", { locale: id })}`,
      isValid: isValidWeek
    };
  }).filter(w => w.isValid);

  const toggleWeek = (weekId: string) => {
    setSelectedWeeks(prev =>
      prev.includes(weekId) ? prev.filter(id => id !== weekId) : [...prev, weekId]
    );
  };

  const toggleAllWeeks = () => {
    if (selectedWeeks.length === weeks.length) {
      setSelectedWeeks([]);
    } else {
      setSelectedWeeks(weeks.map(w => w.id));
    }
  };

  const openAssignDialog = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setSelectedMonthOffset("0");
    setSelectedWeeks([]);
    setAssignDialogOpen(true);
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
            <Input placeholder="Cari template..." className="pl-9" />
          </div>
          <Button onClick={() => setTemplateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Template Baru
          </Button>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 gap-6">
        {MOCK_TEMPLATES.map((tpl) => (
          <Card key={tpl.id} className="overflow-hidden border-muted/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-muted/20 pb-4 border-b flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">{tpl.name}</CardTitle>
                <CardDescription>Alokasi 5 hari kerja (Senin - Jumat)</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-5 divide-x">
                {Object.entries(tpl.schedule).map(([day, petugas]) => (
                  <div key={day} className="p-3 bg-card hover:bg-muted/10 transition-colors">
                    <div className="text-xs font-bold text-muted-foreground mb-2 text-center border-b pb-2">{day}</div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      {petugas.map((p, i) => (
                        <div key={i} className={cn(
                          "text-[10px] sm:text-[11px] px-1.5 py-1 rounded truncate border flex items-center gap-1.5",
                          p.gender === 'L'
                            ? "bg-blue-50/50 text-blue-700 border-blue-100"
                            : "bg-pink-50/50 text-pink-700 border-pink-100"
                        )}>
                          <div className={cn("w-1 h-1 rounded-full shrink-0", p.gender === 'L' ? "bg-blue-500" : "bg-pink-500")} />
                          <span className="truncate">{p.name.split(' ')[0]}</span>
                        </div>
                      ))}
                      {petugas.length === 0 && (
                        <span className="text-xs text-center text-muted-foreground italic py-1">Kosong</span>
                      )}
                    </div>
                  </div>
                ))}
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
            <div className="space-y-3">
              <Label>Bulan Target</Label>
              <Select value={selectedMonthOffset} onValueChange={(v) => { setSelectedMonthOffset(v); setSelectedWeeks([]); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{format(baseDate, "MMMM yyyy", { locale: id })} (Bulan Ini)</SelectItem>
                  <SelectItem value="1">{format(addMonths(baseDate, 1), "MMMM yyyy", { locale: id })}</SelectItem>
                  <SelectItem value="2">{format(addMonths(baseDate, 2), "MMMM yyyy", { locale: id })}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Pilih Minggu</Label>
                <Button variant="ghost" size="sm" onClick={toggleAllWeeks} className="text-xs h-7 px-2">
                  {selectedWeeks.length === weeks.length ? "Batal Pilih Semua" : "Pilih Semua"}
                </Button>
              </div>

              <div className="space-y-2 border rounded-xl p-2 bg-muted/10 max-h-[200px] overflow-y-auto">
                {weeks.map((week) => {
                  const isChecked = selectedWeeks.includes(week.id);
                  return (
                    <label
                      key={week.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
                        isChecked ? "bg-primary/5 border-primary shadow-sm" : "bg-background border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleWeek(week.id)}
                          className={isChecked ? "border-primary bg-primary text-primary-foreground" : ""}
                        />
                        <div className="flex flex-col">
                          <span className={cn("text-sm font-medium", isChecked ? "text-primary" : "text-foreground")}>{week.label}</span>
                          <span className="text-xs text-muted-foreground">{week.dateRange}</span>
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
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Batal</Button>
            <Button disabled={selectedWeeks.length === 0}>
              <Users className="mr-2 h-4 w-4" />
              Terapkan ({selectedWeeks.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Template Dialog (Placeholder for Prototyping) */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Buat Template Baru</DialogTitle>
            <DialogDescription>
              Tentukan formasi petugas piket untuk 5 hari kerja (Senin-Jumat).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Template</Label>
              <Input placeholder="Misal: Tim Charlie" />
            </div>

            <div className="space-y-2 pt-4">
              <Label>Alokasi Petugas per Hari (Max 3)</Label>
              <div className="grid grid-cols-5 gap-2 border rounded-lg p-2 bg-muted/20">
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((day) => (
                  <div key={day} className="flex flex-col gap-2">
                    <div className="text-xs font-semibold text-center py-1 bg-muted rounded">{day}</div>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-dashed text-muted-foreground">
                      <Plus className="mr-1 h-3 w-3" /> Tambah
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Batal</Button>
            <Button onClick={() => setTemplateDialogOpen(false)}>Simpan Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
