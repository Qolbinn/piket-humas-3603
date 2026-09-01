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
import { Search, CheckCircle2, XCircle, ArrowUpDown, ChevronDown, ChevronUp, Bell, SendHorizonal, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

type NotifLog = {
  id: string;
  tipe_notif: string;
  tujuan_lid: string;
  status: string;
  error_message: string | null;
  created_at: string;
};

export default function NotifLogTableClient({ data }: { data: NotifLog[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof NotifLog>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSort = (field: keyof NotifLog) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: keyof NotifLog }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/40" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1.5 h-3.5 w-3.5 text-primary" />
    ) : (
      <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-primary" />
    );
  };

  let filteredData = data.filter((item) =>
    item.tujuan_lid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tipe_notif.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filteredData = filteredData.sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === null) aVal = "";
    if (bVal === null) bVal = "";

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalLog = data.length;
  const totalSukses = data.filter(d => d.status.toLowerCase() === 'sukses' || d.status.toLowerCase() === 'success').length;
  const totalGagal = data.filter(d => d.status.toLowerCase() !== 'sukses' && d.status.toLowerCase() !== 'success').length;

  return (
    <div className="space-y-6">
      {/* Stat Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Notifikasi */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/5" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Total Notifikasi</p>
              <p className="text-3xl font-extrabold text-foreground">{totalLog}</p>
              <p className="text-xs text-muted-foreground">log tercatat</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Bell className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Card 2: Pengiriman Sukses */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background border border-emerald-500/20 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-emerald-500/5" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Pengiriman Sukses</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{totalSukses}</p>
              <div className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden mt-1 max-w-[120px]">
                <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${totalLog > 0 ? Math.round((totalSukses / totalLog) * 100) : 0}%` }} />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <SendHorizonal className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Card 3: Pengiriman Gagal */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-500/10 via-red-500/5 to-background border border-red-500/20 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-red-500/5" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Pengiriman Gagal</p>
              <p className="text-3xl font-extrabold text-red-600 dark:text-red-400">{totalGagal}</p>
              <p className="text-xs text-muted-foreground">perlu ditinjau</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nomor WA atau tipe notif..."
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
                onClick={() => toggleSort("created_at")}
              >
                <div className="flex items-center">
                  Waktu <SortIcon field="created_at" />
                </div>
              </TableHead>
              <TableHead 
                className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("tipe_notif")}
              >
                <div className="flex items-center">
                  Tipe Notif <SortIcon field="tipe_notif" />
                </div>
              </TableHead>
              <TableHead 
                className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("tujuan_lid")}
              >
                <div className="flex items-center">
                  Tujuan (No. WA) <SortIcon field="tujuan_lid" />
                </div>
              </TableHead>
              <TableHead 
                className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("status")}
              >
                <div className="flex items-center">
                  Status <SortIcon field="status" />
                </div>
              </TableHead>
              <TableHead className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">Pesan Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const isSukses = item.status.toLowerCase() === 'sukses' || item.status.toLowerCase() === 'success';

                return (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors border-border/60">
                    <TableCell className="whitespace-nowrap font-bold text-xs py-3.5">
                      {format(new Date(item.created_at), "dd MMM yyyy, HH:mm", { locale: localeId })}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                        {item.tipe_notif}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      <div className="flex items-center gap-1.5">
                        <span>{item.tujuan_lid}</span>
                        <button
                          onClick={() => handleCopy(item.tujuan_lid, item.id)}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted"
                          title="Salin No. WA"
                        >
                          {copiedId === item.id ? (
                            <span className="text-[10px] text-emerald-600 font-bold">Tersalin!</span>
                          ) : (
                            <span className="text-[10px] underline">Salin</span>
                          )}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isSukses ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Sukses
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          Gagal
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground text-xs font-mono">
                      {item.error_message || "-"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                  Tidak ada data log yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
