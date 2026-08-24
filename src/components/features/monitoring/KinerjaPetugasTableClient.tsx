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
import { Search, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

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
      setSortDirection("desc"); // Default to desc for new sort
    }
  };

  const SortIcon = ({ field }: { field: keyof KinerjaData }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4 text-primary" />
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama petugas..."
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
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center">
                  Nama Petugas <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead 
                className="font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("compliancePercentage")}
              >
                <div className="flex items-center justify-center">
                  Kepatuhan Jadwal <SortIcon field="compliancePercentage" />
                </div>
              </TableHead>
              <TableHead 
                className="font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("totalAssigned")}
              >
                <div className="flex items-center justify-center">
                  Eskalasi Ditangani <SortIcon field="totalAssigned" />
                </div>
              </TableHead>
              <TableHead 
                className="font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => toggleSort("totalResolved")}
              >
                <div className="flex items-center justify-center">
                  Selesai <SortIcon field="totalResolved" />
                </div>
              </TableHead>
              <TableHead 
                className="font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
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
              filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{item.role}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`font-semibold ${item.compliancePercentage >= 80 ? 'text-green-600' : item.compliancePercentage >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                        {Math.round(item.compliancePercentage)}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.totalHadir} / {item.totalJadwal} hari
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.totalAssigned}
                  </TableCell>
                  <TableCell className="text-center font-medium text-green-600">
                    {item.totalResolved}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {formatDuration(item.averageResolutionTimeMinutes)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
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
