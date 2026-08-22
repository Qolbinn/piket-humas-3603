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
    items.push({ name: "Monitoring", href: "/monitoring", icon: ClipboardList });
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
            // Dashboard exact match, others startsWith
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname.startsWith(item.href);
              
            const isOpen = openMenus[item.name];

            return (
              <div key={item.name} className="flex flex-col gap-1">
                <Link href={item.href} onClick={(e) => item.subItems ? toggleMenu(item.name, e) : null}>
                  <span
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted",
                      isActive ? "bg-muted text-primary" : "text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                      {item.name}
                    </div>
                    {item.subItems && (
                      isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                </Link>
                
                {/* Submenu rendering */}
                {item.subItems && isOpen && (
                  <div className="ml-9 flex flex-col gap-1 border-l pl-2 mt-1 transition-all duration-200">
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname.startsWith(sub.href);
                      return (
                        <Link key={sub.name} href={sub.href}>
                          <span
                            className={cn(
                              "block rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-muted",
                              isSubActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
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
