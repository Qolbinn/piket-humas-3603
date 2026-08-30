"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";
import * as React from "react";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  UserCircle, 
  MessageSquare,
  ClipboardList,
  LogOut,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

type MenuItem = {
  name: string
  href: string
  icon: any
  subItems?: { name: string, href: string }[]
}

const getMenuItems = (role: string): MenuItem[] => {
  const items: MenuItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  if (role === "admin" || role === "pimpinan" || role === "petugas") {
    items.push({ name: "Jadwal Piket", href: "/piket", icon: CalendarDays });
    items.push({ name: "Eskalasi Pelanggan", href: "/eskalasi", icon: MessageSquare });
  }

  if (role === "admin") {
    items.push({ name: "Data Pegawai", href: "/pegawai", icon: Users });
    items.push({ 
      name: "Master Data", 
      href: "/master", 
      icon: ClipboardList,
      subItems: [
        { name: "Kategori Layanan", href: "/master/layanan" },
        { name: "FAQ", href: "/master/faq" },
        { name: "Template Chat", href: "/master/template" }
      ]
    });
  }

  if (role === "admin" || role === "pimpinan") {
    items.push({ 
      name: "Monitoring", 
      href: "/monitoring", 
      icon: ClipboardList,
      subItems: [
        { name: "Kinerja Petugas", href: "/monitoring/petugas" },
        { name: "Log Notifikasi", href: "/monitoring/notif-log" }
      ]
    });
  }

  items.push({ name: "Profil Saya", href: "/profile", icon: UserCircle });

  return items;
};

export function DashboardSidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const menuItems = getMenuItems(userRole);

  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>(() => {
    // Auto open if current path is inside a submenu
    const initialOpen: Record<string, boolean> = {};
    menuItems.forEach(item => {
      if (item.subItems && pathname.startsWith(item.href)) {
        initialOpen[item.name] = true;
      }
    });
    return initialOpen;
  });

  const toggleMenu = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="hidden border-r border-border/60 bg-muted/20 md:flex md:w-64 md:flex-col shadow-xs">
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-border/60 px-5">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold group">
          <Image src="/logo-bps.svg" alt="Logo BPS" width={32} height={32} className="h-8 w-8 object-contain transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">SIPASTI</span>
              <span className="text-[9px] font-extrabold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">3603</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium -mt-1">Piket & Layanan Humas</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <nav className="grid items-start gap-1.5">
          {menuItems.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname.startsWith(item.href);
              
            const isOpen = openMenus[item.name];

            return (
              <div key={item.name} className="flex flex-col gap-1">
                {item.subItems ? (
                  <button
                    onClick={(e) => toggleMenu(item.name, e)}
                    className="w-full text-left"
                  >
                    <span
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary border-l-4 border-primary shadow-xs"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("h-4 w-4 shrink-0 stroke-[2.25]", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span>{item.name}</span>
                      </div>
                      {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 opacity-70" /> : <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />}
                    </span>
                  </button>
                ) : (
                  <Link href={item.href}>
                    <span
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary border-l-4 border-primary shadow-xs"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("h-4 w-4 shrink-0 stroke-[2.25]", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span>{item.name}</span>
                      </div>
                    </span>
                  </Link>
                )}
                
                {/* Submenu rendering */}
                {item.subItems && isOpen && (
                  <div className="ml-4 flex flex-col gap-1 border-l-2 border-border/60 pl-3 my-1 transition-all duration-200">
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname.startsWith(sub.href);
                      return (
                        <Link key={sub.name} href={sub.href}>
                          <span
                            className={cn(
                              "block rounded-lg px-3 py-2 text-xs sm:text-sm transition-all duration-200",
                              isSubActive 
                                ? "bg-primary/10 text-primary font-bold border-l-2 border-primary" 
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
                            )}
                          >
                            {sub.name}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        {/* Logout Footer Button */}
        <div className="mt-auto pt-4 border-t border-border/60">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors font-semibold text-sm rounded-xl px-3.5 h-10"
            onClick={async () => await logoutAction()}
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar Sistem</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
