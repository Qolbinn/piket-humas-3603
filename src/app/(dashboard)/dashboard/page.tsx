import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Clock, LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="text-muted-foreground text-lg">Ringkasan aktivitas chatbot dan piket humas hari ini.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Percakapan Hari Ini</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-3xl font-extrabold text-foreground">145</div>
            <p className="text-sm text-green-600 font-medium mt-1 flex items-center gap-1">
              <span className="text-lg leading-none">+</span>20% <span className="text-muted-foreground font-normal">dari hari kemarin</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-secondary/10 via-background to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Eskalasi ke Petugas</CardTitle>
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Users className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-3xl font-extrabold text-foreground">12</div>
            <p className="text-sm text-secondary font-medium mt-1 flex items-center gap-1">
              4 pelanggan <span className="text-muted-foreground font-normal">sedang menunggu</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-green-500/10 via-background to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Petugas Piket Aktif</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-3xl font-extrabold text-foreground">3 <span className="text-lg font-semibold text-muted-foreground">Orang</span></div>
            <p className="text-sm text-muted-foreground mt-1">
              Shift Pagi (08:00 - 15:00)
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="h-[400px] rounded-2xl border bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center text-muted-foreground overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
        <div className="z-10 flex flex-col items-center gap-3">
          <div className="p-4 bg-muted rounded-full">
            <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">Area Chart Statistik Mingguan</p>
          <p className="text-sm text-muted-foreground max-w-sm text-center">Data chart akan diimplementasikan setelah koneksi database tersedia.</p>
        </div>
      </div>
    </div>
  );
}
