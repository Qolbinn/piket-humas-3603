import { format, startOfMonth, endOfMonth } from "date-fns";
import { ShieldAlert, ChevronLeft, ChevronRight, Inbox, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import PageHeader from "@/components/layout/page-header";
import { getEskalasi, getEskalasiSummary } from "@/lib/actions/eskalasi";
import { getCurrentPegawai } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import EskalasiTableClient from "@/components/features/eskalasi/EskalasiTableClient";
import { DateRangeFilter } from "@/components/features/eskalasi/DateRangeFilter";
import { CreateEskalasiDialog } from "@/components/features/eskalasi/CreateEskalasiDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Eskalasi Pelanggan — Piket Humas",
  description: "Manajemen eskalasi keluhan pelanggan dari chatbot.",
};

export default async function EskalasiPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPegawai = await getCurrentPegawai();

  let { page, from, to, query, status, channel, sortBy, sortOrder } = resolvedSearchParams;
  
  // Default to current month if no dates provided
  if (!from || !to) {
    const now = new Date();
    const defaultFrom = format(startOfMonth(now), "yyyy-MM-dd");
    const defaultTo = format(endOfMonth(now), "yyyy-MM-dd");
    
    // Redirect to ensure URL matches state, keeping existing params
    const newParams = new URLSearchParams();
    if (page) newParams.set("page", page);
    if (query) newParams.set("query", query);
    if (status) newParams.set("status", status);
    if (channel) newParams.set("channel", channel);
    if (sortBy) newParams.set("sortBy", sortBy);
    if (sortOrder) newParams.set("sortOrder", sortOrder);
    
    newParams.set("from", defaultFrom);
    newParams.set("to", defaultTo);
    
    redirect(`/eskalasi?${newParams.toString()}`);
  }

  const currentPage = parseInt(page || "1", 10);
  const limit = 10;

  // Fetch paginated table data
  const { data, count, totalPages } = await getEskalasi({
    page: currentPage,
    limit,
    from,
    to,
    query,
    status,
    channel,
    sortBy,
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  // Fetch summary stats for cards (ignores search/status filters to show global period stats)
  const summary = await getEskalasiSummary(from, to);

  // Fetch Kategori Layanan
  const supabase = await createClient();
  const { data: kategoriList } = await supabase
    .from("kategori_layanan")
    .select("kode, nama")
    .eq("is_active", true)
    .order("nama", { ascending: true });

  // Base URL for pagination links
  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (query) params.set("query", query);
    if (status) params.set("status", status);
    if (channel) params.set("channel", channel);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    params.set("page", newPage.toString());
    return `/eskalasi?${params.toString()}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <PageHeader
          title="Eskalasi Pelanggan"
          description="Daftar aduan pelanggan yang diteruskan oleh bot untuk ditangani petugas."
          breadcrumbText="Layanan"
          breadcrumbIcon={ShieldAlert}
        />
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeFilter />
          <CreateEskalasiDialog kategoriList={kategoriList || []} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-border/80 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Eskalasi</CardTitle>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20">
              <Inbox className="h-4 w-4 stroke-[2.25]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{summary.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Pada rentang waktu terpilih</p>
          </CardContent>
        </Card>
        
        <Card className="border border-border/80 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-amber-500/10 via-background to-background relative overflow-hidden rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Belum Selesai</CardTitle>
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20">
              <Clock className="h-4 w-4 stroke-[2.25]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{summary.unresolved}</div>
            <p className="text-xs text-muted-foreground mt-1">Status OPEN & ON PROCESS</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-emerald-500/10 via-background to-background relative overflow-hidden rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Telah Selesai</CardTitle>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 stroke-[2.25]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{summary.resolved}</div>
            <p className="text-xs text-muted-foreground mt-1">Status RESOLVED</p>
          </CardContent>
        </Card>
      </div>

      <EskalasiTableClient 
        data={data} 
        currentUserId={currentPegawai?.id} 
        kategoriList={kategoriList || []}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages} (Total filter: {count})
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              asChild
            >
              <Link href={currentPage <= 1 ? "#" : createPageUrl(currentPage - 1)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Sebelumnya
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              asChild
            >
              <Link href={currentPage >= totalPages ? "#" : createPageUrl(currentPage + 1)}>
                Selanjutnya
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
