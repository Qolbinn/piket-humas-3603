import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Clock, LayoutDashboard } from "lucide-react";
import { getJadwalByRange, getTodaySchedule } from "@/lib/actions/jadwal";
import PageHeader from "@/components/layout/page-header";
import PresenceChecklist from "@/components/features/monitoring/presence-checklist";
import { id } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MyScheduleCard } from "@/components/dashboard/my-schedule-card";
import { StatsFilter } from "@/components/features/dashboard/stats-filter";
import ChatDensityChart from "@/components/features/dashboard/chat-density-chart";
import { DashboardPieCharts } from "@/components/features/dashboard/dashboard-pie-charts";
import { SlaCard } from "@/components/features/dashboard/sla-card";
import { getDashboardStats, getCategoryDistribution, getChannelDistribution } from "@/lib/actions/dashboard";
import { DateRangeFilter } from "@/components/features/eskalasi/DateRangeFilter";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  let { from, to, stats_filter } = resolvedSearchParams;
  
  const filter = (stats_filter as 'today' | 'week' | 'month') || 'today';
  const filterLabel = filter === 'week' ? 'Minggu Ini' : filter === 'month' ? 'Bulan Ini' : 'Hari Ini';

  if (!from || !to) {
    const end = new Date();
    const start = subDays(end, 6); // Last 7 days
    const defaultFrom = format(start, "yyyy-MM-dd");
    const defaultTo = format(end, "yyyy-MM-dd");
    
    const newParams = new URLSearchParams();
    newParams.set("from", defaultFrom);
    newParams.set("to", defaultTo);
    
    redirect(`/dashboard?${newParams.toString()}`);
  }
  const now = new Date();
  const pieFrom = resolvedSearchParams.pie_from || format(startOfMonth(now), "yyyy-MM-dd");
  const pieTo = resolvedSearchParams.pie_to || format(endOfMonth(now), "yyyy-MM-dd");

  const todayStr = format(now, "yyyy-MM-dd");
  let officersToday: any[] = [];
  let myTodaySchedule: any = null;
  let stats: any = { totalPercakapan: 0, eskalasiOpen: 0, eskalasiOnProcess: 0, petugas: [], averageSla: 0 };
  let categoryData: any[] = [];
  let channelData: any[] = [];

  try {
    officersToday = await getJadwalByRange(todayStr, todayStr);
    myTodaySchedule = await getTodaySchedule();
    stats = await getDashboardStats(filter);
    categoryData = await getCategoryDistribution(pieFrom, pieTo);
    channelData = await getChannelDistribution(pieFrom, pieTo);
  } catch (err) {
    console.error("Gagal mengambil data dashboard:", err);
  }
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <PageHeader 
          title="Dashboard" 
          description="Ringkasan aktivitas chatbot dan status layanan piket humas hari ini." 
          breadcrumbText="Beranda" 
          breadcrumbIcon={LayoutDashboard} 
        />
        
        <div className="flex items-center gap-2.5">
          <StatsFilter />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl flex items-center gap-2 font-bold h-10 shadow-sm">
                <Users className="h-4 w-4" />
                <span>Cek Petugas Piket</span>
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-bold text-lg">Petugas Piket Aktif ({format(new Date(), "dd MMMM yyyy", { locale: id })})</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2.5 py-3">
              {officersToday.length > 0 ? (
                officersToday.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${item.pegawai?.gender === 'L' ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300' : 'bg-pink-500/15 text-pink-700 dark:text-pink-300'}`}>
                        {item.pegawai?.name ? item.pegawai.name.charAt(0) : 'P'}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-foreground block">{item.pegawai?.name}</span>
                        <span className="text-[11px] text-muted-foreground">{item.pegawai?.role === 'admin' ? 'Administrator' : 'Petugas Piket'}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${item.pegawai?.gender === 'L' ? 'bg-blue-500/10 text-blue-700 border-blue-200' : 'bg-pink-500/10 text-pink-700 border-pink-200'}`}>
                      {item.pegawai?.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-muted-foreground italic border border-dashed rounded-xl">
                  Tidak ada petugas yang ditugaskan hari ini.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {myTodaySchedule && (
        <PresenceChecklist 
          jadwalId={myTodaySchedule.id} 
          isHadir={myTodaySchedule.is_hadir} 
          hadirAt={myTodaySchedule.hadir_at} 
        />
      )}

      {/* Stat Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border/80 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden rounded-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chat Masuk {filterLabel}</CardTitle>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20">
              <MessageSquare className="h-4 w-4 stroke-[2.25]" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-3xl font-extrabold text-foreground">{stats.totalPercakapan}</div>
            <p className="text-xs text-muted-foreground mt-1">Interaksi pelanggan via chatbot</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-secondary/10 via-background to-background relative overflow-hidden rounded-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Eskalasi OPEN</CardTitle>
            <div className="p-2.5 bg-secondary/10 text-secondary rounded-xl border border-secondary/20">
              <Users className="h-4 w-4 stroke-[2.25]" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-3xl font-extrabold text-foreground">{stats.eskalasiOpen}</div>
            <p className="text-xs text-muted-foreground mt-1">Menunggu ditangani petugas</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-amber-500/10 via-background to-background relative overflow-hidden rounded-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Eskalasi ON PROCESS</CardTitle>
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20">
              <Clock className="h-4 w-4 stroke-[2.25]" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-3xl font-extrabold text-foreground">{stats.eskalasiOnProcess}</div>
            <p className="text-xs text-muted-foreground mt-1">Sedang ditangani petugas piket</p>
          </CardContent>
        </Card>

        <SlaCard 
          sla={stats.averageSla} 
        />
      </div>

      {/* Main Charts & Schedule Grid */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-3 h-[400px] rounded-2xl border border-border/80 bg-card text-card-foreground shadow-xs flex flex-col items-center justify-center text-muted-foreground overflow-hidden relative p-4">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
          <div className="z-10 w-full h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-base text-foreground">Kepadatan Interaksi Chatbot</h3>
                <p className="text-xs text-muted-foreground">Total percakapan pelanggan per hari</p>
              </div>
              <DateRangeFilter />
            </div>
            <div className="flex-1 w-full relative">
              <ChatDensityChart from={from} to={to} />
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1 lg:col-span-1">
          <MyScheduleCard />
        </div>
      </div>

      {/* Pie Charts */}
      <DashboardPieCharts 
        categoryData={categoryData} 
        channelData={channelData} 
        defaultFrom={startOfMonth(now)}
        defaultTo={endOfMonth(now)}
      />
    </div>
  );
}
