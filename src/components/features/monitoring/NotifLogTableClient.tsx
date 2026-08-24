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
import { Search, CheckCircle2, XCircle, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
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

  const toggleSort = (field: keyof NotifLog) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: keyof NotifLog }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4 text-primary" />
    );
  };

  let filteredData = data.filter((item) =>
    item.tujuan_lid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tipe_notif.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filteredData = filteredData.sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    // Handle null values
    if (aVal === null) aVal = "";
    if (bVal === null) bVal = "";

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nomor WA atau tipe notif..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead 
                className="font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("created_at")}
              >
                <div className="flex items-center">
                  Waktu <SortIcon field="created_at" />
                </div>
              </TableHead>
              <TableHead 
                className="font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("tipe_notif")}
              >
                <div className="flex items-center">
                  Tipe Notif <SortIcon field="tipe_notif" />
                </div>
              </TableHead>
              <TableHead 
                className="font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("tujuan_lid")}
              >
                <div className="flex items-center">
                  Tujuan (No. WA) <SortIcon field="tujuan_lid" />
                </div>
              </TableHead>
              <TableHead 
                className="font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("status")}
              >
                <div className="flex items-center">
                  Status <SortIcon field="status" />
                </div>
              </TableHead>
              <TableHead className="font-semibold">Pesan Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(item.created_at), "dd MMM yyyy, HH:mm", { locale: localeId })}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground">
                      {item.tipe_notif}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.tujuan_lid}
                  </TableCell>
                  <TableCell>
                    {item.status.toLowerCase() === 'sukses' ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                        <CheckCircle2 className="h-4 w-4" /> Sukses
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 font-medium text-sm">
                        <XCircle className="h-4 w-4" /> Gagal
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                    {item.error_message || "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
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
