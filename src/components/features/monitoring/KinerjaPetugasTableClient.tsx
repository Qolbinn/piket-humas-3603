"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, ChevronDown, ChevronUp, Users, TrendingUp, CheckCircle2 } from "lucide-react";

type KinerjaData = {
  id: string;
  name: string;
  role: string;
  totalJadwal: number;
  totalHadir: number;
  compliancePercentage: number;
  totalAssigned: number;
  totalResolved: number;
  averageResolutionTimeMinutes: number;
};

function formatDuration(minutes: number) {
  if (minutes === 0) return "-";
  if (minutes < 60) return `${Math.round(minutes)} menit`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  if (remainingMinutes === 0) return `${hours} jam`;
  return `${hours} jam ${remainingMinutes} mnt`;
}

export default function KinerjaPetugasTableClient({ data }: { data: KinerjaData[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof KinerjaData>("compliancePercentage");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const toggleSort = (field: keyof KinerjaData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: keyof KinerjaData }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/40" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1.5 h-3.5 w-3.5 text-primary" />
    ) : (
      <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-primary" />
    );
  };

  let filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filteredData = filteredData.sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPetugas = data.length;
  const avgCompliance = data.length > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.compliancePercentage, 0) / data.length) : 0;
  const totalResolvedAll = data.reduce((acc, curr) => acc + curr.totalResolved, 0);

  return (
    <div className="space-y-6">
      {/* Top Stat Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Petugas */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/5" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Total Petugas</p>
              <p className="text-3xl font-extrabold text-foreground">{totalPetugas}</p>
              <p className="text-xs text-muted-foreground">orang dimonitor</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Card 2: Rata-rata Kepatuhan with circular progress */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-background border border-amber-500/20 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-amber-500/5" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Rata-rata Kepatuhan</p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{avgCompliance}%</p>
              <div className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden mt-1 max-w-[120px]">
                <div className={`h-full rounded-full transition-all duration-500 ${
                  avgCompliance >= 80 ? 'bg-emerald-500' : avgCompliance >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`} style={{ width: `${Math.min(100, Math.max(0, avgCompliance))}%` }} />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Card 3: Total Tiket Selesai */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background border border-emerald-500/20 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-emerald-500/5" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Tiket Selesai</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{totalResolvedAll}</p>
              <p className="text-xs text-muted-foreground">tiket terselesaikan</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama petugas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background rounded-xl h-10 border-border/80 text-sm shadow-2xs"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border/60">
              <TableHead 
                className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors py-3.5"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center">
                  Nama Petugas <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead 
                className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors text-center"
                onClick={() => toggleSort("compliancePercentage")}
              >
                <div className="flex items-center justify-center">
                  Kepatuhan Jadwal <SortIcon field="compliancePercentage" />
                </div>
              </TableHead>
              <TableHead 
                className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors text-center"
                onClick={() => toggleSort("totalAssigned")}
              >
                <div className="flex items-center justify-center">
                  Eskalasi Ditangani <SortIcon field="totalAssigned" />
                </div>
              </TableHead>
              <TableHead 
                className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors text-center"
                onClick={() => toggleSort("totalResolved")}
              >
                <div className="flex items-center justify-center">
                  Selesai <SortIcon field="totalResolved" />
                </div>
              </TableHead>
              <TableHead 
                className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors text-center"
                onClick={() => toggleSort("averageResolutionTimeMinutes")}
              >
                <div className="flex items-center justify-center">
                  Rata-rata Waktu (SLA) <SortIcon field="averageResolutionTimeMinutes" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const compliance = Math.round(item.compliancePercentage);
                const progressColor = compliance >= 80 ? "bg-emerald-500" : compliance >= 50 ? "bg-amber-500" : "bg-red-500";
                const textColor = compliance >= 80 ? "text-emerald-700 dark:text-emerald-300" : compliance >= 50 ? "text-amber-700 dark:text-amber-300" : "text-red-700 dark:text-red-300";

                return (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors border-border/60">
                    <TableCell className="font-bold py-3.5">
                      <div className="flex flex-col">
                        <span className="text-foreground font-extrabold text-sm">{item.name}</span>
                        <span className="text-xs text-muted-foreground capitalize mt-0.5">{item.role}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1.5 max-w-[140px] mx-auto">
                        <div className="flex items-center justify-between w-full text-xs">
                          <span className={`font-extrabold ${textColor}`}>
                            {compliance}%
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {item.totalHadir}/{item.totalJadwal} hari
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted/60 rounded-full overflow-hidden">
                          <div className={`h-full ${progressColor} transition-all duration-300 rounded-full`} style={{ width: `${Math.min(100, Math.max(0, compliance))}%` }} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-foreground">
                      {item.totalAssigned}
                    </TableCell>
                    <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {item.totalResolved}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 shadow-2xs">
                        {formatDuration(item.averageResolutionTimeMinutes)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                  Tidak ada data petugas yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
