import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JadwalTab } from "@/components/piket/jadwal-tab";
import { AlokasiTab } from "@/components/piket/alokasi-tab";
import { CalendarDays, Users } from "lucide-react";

import { getJadwalByRange } from "@/lib/actions/jadwal";
import { getTemplates } from "@/lib/actions/template";
import { getPegawai } from "@/lib/actions/pegawai";

import { format, startOfMonth, endOfMonth } from "date-fns";

export default async function PiketPage() {
  const now = new Date();
  
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(monthStart);
  
  const startDay = monthStart.getDay();
  const adjustedStart = new Date(monthStart);
  adjustedStart.setDate(monthStart.getDate() - (startDay === 0 ? 6 : startDay - 1));

  const endDay = monthEnd.getDay();
  const adjustedEnd = new Date(monthEnd);
  adjustedEnd.setDate(monthEnd.getDate() + (endDay === 0 ? 0 : 7 - endDay));

  const [jadwalInitial, templates, pegawais] = await Promise.all([
    getJadwalByRange(format(adjustedStart, "yyyy-MM-dd"), format(adjustedEnd, "yyyy-MM-dd")),
    getTemplates(),
    getPegawai()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Jadwal Piket</h1>
        <p className="text-muted-foreground text-lg">Kelola jadwal piket harian dan alokasi petugas humas.</p>
      </div>
      
      <Tabs defaultValue="jadwal" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-6">
          <TabsTrigger value="jadwal" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Jadwal Piket
          </TabsTrigger>
          <TabsTrigger value="alokasi" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Alokasi Petugas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="jadwal" className="mt-0">
          <JadwalTab initialData={jadwalInitial} />
        </TabsContent>
        
        <TabsContent value="alokasi" className="mt-0">
          <AlokasiTab templates={templates} pegawais={pegawais} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
