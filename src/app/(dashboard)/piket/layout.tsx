"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

export default function PiketLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  let activeTab = "jadwal";
  if (pathname.includes("/alokasi")) {
    activeTab = "alokasi";
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <PageHeader
        title="Jadwal Piket"
        description="Kelola jadwal piket harian dan alokasi petugas humas."
        breadcrumbText="Jadwal Piket"
        breadcrumbIcon={CalendarDays}
      />
      
      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 h-11 p-1 bg-muted/60 rounded-2xl border border-border/60 mb-6">
          <TabsTrigger 
            value="jadwal" 
            className="flex items-center justify-center gap-2 rounded-xl font-bold text-xs sm:text-sm h-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xs transition-all"
            onClick={() => router.push('/piket/jadwal')}
          >
            <CalendarDays className="h-4 w-4" />
            <span>Jadwal Piket</span>
          </TabsTrigger>
          <TabsTrigger 
            value="alokasi" 
            className="flex items-center justify-center gap-2 rounded-xl font-bold text-xs sm:text-sm h-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xs transition-all"
            onClick={() => router.push('/piket/alokasi')}
          >
            <Users className="h-4 w-4" />
            <span>Alokasi Petugas</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-0">
          {children}
        </div>
      </Tabs>
    </div>
  );
}
