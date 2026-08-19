"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  UserCircle, 
  MessageSquare,
  ClipboardList,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const getMenuItems = (role: string) => {
  const items = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  if (role === "admin" || role === "pimpinan" || role === "petugas") {
    items.push({ name: "Jadwal Piket", href: "/piket", icon: CalendarDays });
    items.push({ name: "Eskalasi Pelanggan", href: "/pelanggan", icon: MessageSquare });
  }

  if (role === "admin") {
    items.push({ name: "Data Pegawai", href: "/pegawai", icon: Users });
    items.push({ name: "Master Data", href: "/master", icon: ClipboardList });
  }

  if (role === "admin" || role === "pimpinan") {
    items.push({ name: "Monitoring", href: "/monitoring", icon: ClipboardList }); // Update icon if needed
  }

  items.push({ name: "Profil Saya", href: "/profile", icon: UserCircle });

  return items;
};

export function DashboardSidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const menuItems = getMenuItems(userRole);

  return (
    <div className="hidden border-r bg-muted/20 md:flex md:w-64 md:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Image src="/logo-bps.svg" alt="Logo" width={28} height={28} className="h-7 w-auto" style={{ width: "auto" }} />
          <span className="text-xl text-primary font-bold">Humas</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <nav className="grid items-start gap-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted",
                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={async () => await logoutAction()}
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </div>
      </div>
    </div>
  );
}
