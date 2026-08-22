"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { 
  CheckCircle2, Clock, Loader2, MessageCircle, Send, ShieldAlert, User, 
  ArrowUpDown, ArrowDown, ArrowUp, RefreshCcw, Search, SlidersHorizontal,
  Mail, Users
} from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { Eskalasi } from "@/lib/types/database";
import { updateEskalasiStatus, triggerSurvey, updateEskalasiDetail } from "@/lib/actions/eskalasi";
import { cn } from "@/lib/utils";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  data: Eskalasi[];
  currentUserId?: string;
  kategoriList: { kode: string; nama: string }[];
}

type Column = "waktu" | "pelanggan" | "detail" | "petugas" | "status" | "diselesaikan" | "feedback";

export default function EskalasiTableClient({ data, currentUserId, kategoriList }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedEskalasi, setSelectedEskalasi] = useState<Eskalasi | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const statusFilter = searchParams.get("status") || "all";
  const channelFilter = searchParams.get("channel") || "all";
  const sortBy = searchParams.get("sortBy") || "created_at";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Record<Column, boolean>>({
    waktu: true,
    pelanggan: true,
    detail: true,
    petugas: true,
    status: true,
    diselesaikan: false,
    feedback: false,
  });

  // Sync Search with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("query", debouncedSearch);
      params.set("page", "1");
    } else {
      params.delete("query");
    }
    
    const newQuery = params.toString();
    if (searchParams.toString() !== newQuery) {
      router.push(`?${newQuery}`);
    }
  }, [debouncedSearch, router, searchParams]);

  const handleStatusFilter = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      params.set("status", val);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleChannelFilter = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      params.set("channel", val);
    } else {
      params.delete("channel");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const toggleSort = (column: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortBy === column) {
      params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", column);
      params.set("sortOrder", "asc");
    }
    router.push(`?${params.toString()}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleRowClick = (eskalasi: Eskalasi) => {
    setSelectedEskalasi(eskalasi);
    setIsSheetOpen(true);
  };

  const handleUpdateStatus = (newStatus: "OPEN" | "ON_PROCESS" | "RESOLVED") => {
    if (!selectedEskalasi) return;

    startTransition(async () => {
      try {
        await updateEskalasiStatus(selectedEskalasi.id, newStatus, currentUserId);
        toast.success(`Status berhasil diubah menjadi ${newStatus}`);
        setSelectedEskalasi({ ...selectedEskalasi, status: newStatus });
        setIsSheetOpen(false);
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  const handleUpdateDetail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEskalasi) return;
    const formData = new FormData(e.currentTarget);
    const payload = {
      nama_pelanggan: formData.get("nama_pelanggan") as string,
      channel: formData.get("channel") as string,
      kategori_kode: formData.get("kategori_kode") as string,
      detail: formData.get("detail") as string,
    };

    startTransition(async () => {
      try {
        await updateEskalasiDetail(selectedEskalasi.id, payload);
        toast.success("Detail berhasil diperbarui");
        setSelectedEskalasi({ ...selectedEskalasi, ...payload });
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  const handleTriggerSurvey = () => {
    if (!selectedEskalasi) return;

    startTransition(async () => {
      try {
        await triggerSurvey(selectedEskalasi.id);
        toast.success("Perintah pengiriman survei dikirim ke bot!");
        setSelectedEskalasi({ ...selectedEskalasi, feedback_status: 'PENDING' });
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">Open</Badge>;
      case "ON_PROCESS":
        return <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 text-white">Diproses</Badge>;
      case "RESOLVED":
        return <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3 text-blue-500" />;
      case 'kunjungan_langsung': return <Users className="h-3 w-3 text-orange-500" />;
      default: return <MessageCircle className="h-3 w-3 text-green-500" />;
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortOrder === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau deskripsi keluhan..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="ON_PROCESS">Diproses</SelectItem>
            <SelectItem value="RESOLVED">Selesai</SelectItem>
          </SelectContent>
        </Select>

        <Select value={channelFilter} onValueChange={handleChannelFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Channel</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="kunjungan_langsung">Kunjungan Langsung</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {Object.keys(visibleColumns).map((col) => (
              <DropdownMenuCheckboxItem
                key={col}
                className="capitalize"
                checked={visibleColumns[col as Column]}
                onCheckedChange={(val) => setVisibleColumns(prev => ({ ...prev, [col]: val }))}
              >
                {col}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCcw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {visibleColumns.waktu && (
                <TableHead className="w-[150px]">
                  <Button variant="ghost" onClick={() => toggleSort("created_at")} className="-ml-4 hover:bg-transparent">
                    Waktu Laporan <SortIcon column="created_at" />
                  </Button>
                </TableHead>
              )}
              {visibleColumns.pelanggan && (
                <TableHead>
                  <Button variant="ghost" onClick={() => toggleSort("nama_pelanggan")} className="-ml-4 hover:bg-transparent">
                    Pelanggan <SortIcon column="nama_pelanggan" />
                  </Button>
                </TableHead>
              )}
              {visibleColumns.detail && <TableHead className="min-w-[200px]">Detail Eskalasi</TableHead>}
              {visibleColumns.petugas && <TableHead>Petugas</TableHead>}
              {visibleColumns.status && (
                <TableHead>
                  <Button variant="ghost" onClick={() => toggleSort("status")} className="-ml-4 hover:bg-transparent">
                    Status <SortIcon column="status" />
                  </Button>
                </TableHead>
              )}
              {visibleColumns.diselesaikan && (
                <TableHead>
                  <Button variant="ghost" onClick={() => toggleSort("resolved_at")} className="-ml-4 hover:bg-transparent">
                    Waktu Diselesaikan <SortIcon column="resolved_at" />
                  </Button>
                </TableHead>
              )}
              {visibleColumns.feedback && <TableHead className="text-center">Feedback Status</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Tidak ada data eskalasi yang sesuai dengan filter.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRowClick(item)}
                >
                  {visibleColumns.waktu && (
                    <TableCell className="text-sm font-medium">
                      {format(new Date(item.created_at), "dd MMM yyyy", { locale: localeId })}<br />
                      <span className="text-xs text-muted-foreground">{format(new Date(item.created_at), "HH:mm", { locale: localeId })}</span>
                    </TableCell>
                  )}
                  {visibleColumns.pelanggan && (
                    <TableCell>
                      <div className="font-semibold">{item.nama_pelanggan}</div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        {getChannelIcon(item.channel)}
                        <span className="capitalize">{item.channel.replace("_", " ")}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.detail && (
                    <TableCell>
                      <Badge variant="outline" className="mb-1 bg-muted/30">
                        {item.kategori_layanan?.nama || "Umum"}
                      </Badge>
                      <div className="text-sm max-w-[450px] truncate" title={item.detail || ""}>
                        {item.detail || "-"}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.petugas && (
                    <TableCell>
                      {item.pegawai ? (
                        <span className="text-sm">{item.pegawai.name}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Belum ditugaskan</span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  )}
                  {visibleColumns.diselesaikan && (
                    <TableCell className="text-sm">
                      {item.resolved_at ? (
                        <>
                          {format(new Date(item.resolved_at), "dd MMM yyyy", { locale: localeId })}<br />
                          <span className="text-xs text-muted-foreground">{format(new Date(item.resolved_at), "HH:mm", { locale: localeId })}</span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.feedback && (
                    <TableCell className="text-center">
                      {item.feedback_status === 'SENT' && <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />}
                      {item.feedback_status === 'PENDING' && <Clock className="h-4 w-4 text-orange-500 mx-auto" />}
                      {!item.feedback_status && <span className="text-xs text-muted-foreground">-</span>}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Panel */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[800px] overflow-y-auto w-[95vw] p-8">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-2xl flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-primary" /> Detail Eskalasi
            </SheetTitle>
          </SheetHeader>

          {selectedEskalasi && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-full border shadow-sm">
                    {selectedEskalasi.status === 'OPEN' && <Clock className="h-5 w-5 text-red-500" />}
                    {selectedEskalasi.status === 'ON_PROCESS' && <Loader2 className="h-5 w-5 text-blue-500 animate-spin-slow" />}
                    {selectedEskalasi.status === 'RESOLVED' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status Saat Ini</p>
                    <div className="mt-1">{getStatusBadge(selectedEskalasi.status)}</div>
                  </div>
                </div>
              </div>

              {/* Editable Form */}
              <form onSubmit={handleUpdateDetail} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <User className="h-4 w-4" /> Informasi Pelanggan
                  </h3>
                  <div className="space-y-3 p-4 border rounded-xl bg-card">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Nama Pelanggan</Label>
                      <Input name="nama_pelanggan" defaultValue={selectedEskalasi.nama_pelanggan} required />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Channel</Label>
                      <Select name="channel" defaultValue={selectedEskalasi.channel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="kunjungan_langsung">Kunjungan Langsung</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedEskalasi.channel === 'whatsapp' && (
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">LID WhatsApp</Label>
                        <Input value={selectedEskalasi.pelanggan_lid?.replace('@s.whatsapp.net', '') || ""} disabled />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> Detail Kasus
                  </h3>
                  <div className="space-y-3 p-4 border rounded-xl bg-card">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Kategori Layanan</Label>
                      <Select name="kategori_kode" defaultValue={selectedEskalasi.kategori_kode || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {kategoriList.map(k => (
                            <SelectItem key={k.kode} value={k.kode}>{k.nama}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Deskripsi Kasus</Label>
                      <Textarea name="detail" defaultValue={selectedEskalasi.detail || ""} className="min-h-[100px]" required />
                    </div>
                    <div className="text-xs text-muted-foreground text-right pt-2">
                      Waktu Laporan: {format(new Date(selectedEskalasi.created_at), "dd MMM yyyy HH:mm", { locale: localeId })}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-xl" disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Simpan Perubahan
                </Button>
              </form>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Aksi Penanganan</h3>
                
                {selectedEskalasi.status === "OPEN" && (
                  <Button className="w-full rounded-xl" onClick={() => handleUpdateStatus("ON_PROCESS")} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Ambil Alih Penanganan
                  </Button>
                )}

                {selectedEskalasi.status === "ON_PROCESS" && (
                  <div className="space-y-2">
                    <p className="text-xs text-center text-muted-foreground mb-2 p-3 border rounded-xl bg-muted/20">
                      Kasus saat ini sedang ditangani oleh <span className="font-semibold">{selectedEskalasi.pegawai?.name || 'Petugas Lain'}</span>.
                    </p>
                    <Button className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus("RESOLVED")} disabled={isPending}>
                      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />} Tandai Selesai (Closed)
                    </Button>
                    <Button variant="outline" className="w-full rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleUpdateStatus("OPEN")} disabled={isPending}>
                      Batal Tangani
                    </Button>
                  </div>
                )}

                {selectedEskalasi.status === "RESOLVED" && (
                  <div className="space-y-2">
                    <p className="text-xs text-center text-green-600 font-medium mb-2 bg-green-50 p-3 rounded-xl border border-green-100">
                      Kasus ini sudah diselesaikan.
                    </p>
                    {selectedEskalasi.channel === 'whatsapp' && selectedEskalasi.pelanggan_lid && (
                      <Button 
                        variant={selectedEskalasi.feedback_status ? "outline" : "default"} 
                        className={cn("w-full rounded-xl", selectedEskalasi.feedback_status ? "" : "bg-primary")} 
                        onClick={handleTriggerSurvey} 
                        disabled={isPending || !!selectedEskalasi.feedback_status}
                      >
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {selectedEskalasi.feedback_status === 'SENT' ? "Survei Berhasil Dikirim" 
                          : selectedEskalasi.feedback_status === 'PENDING' ? "Kirim Survei (Tertunda)" 
                          : "Kirim Link Survei via Bot"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
