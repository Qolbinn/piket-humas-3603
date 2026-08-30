"use client";

import { Bell, Menu, LayoutDashboard, CalendarDays, Users, MessageSquare, UserCircle, LogOut, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";
import BotStatusBadge from "@/components/features/monitoring/bot-status-badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mobileMenuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Jadwal Piket", href: "/piket", icon: CalendarDays },
  { name: "Eskalasi Pelanggan", href: "/eskalasi", icon: MessageSquare },
  { name: "Data Pegawai", href: "/pegawai", icon: Users },
  { name: "Profil Saya", href: "/profile", icon: UserCircle },
];

interface DashboardNavbarProps {
  userName: string;
  userRole: string;
  initials: string;
}

export function DashboardNavbar({ userName, userRole, initials }: DashboardNavbarProps) {
  const pathname = usePathname();

  // Role Badge Styling Helper
  const getRoleBadgeClass = (roleStr: string) => {
    const lower = roleStr.toLowerCase();
    if (lower.includes('admin')) {
      return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    }
    if (lower.includes('pimpinan')) {
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    }
    return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border/60 bg-background px-4 md:px-6 justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden rounded-xl h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="h-full flex flex-col">
              <div className="flex h-16 items-center border-b px-5">
                <Link href="/dashboard" className="flex items-center gap-3 font-semibold">
                  <Image src="/logo-bps.svg" alt="Logo" width={28} height={28} className="h-7 w-7 object-contain" />
                  <div className="flex flex-col">
                    <span className="text-base font-extrabold text-primary">SIPASTI 3603</span>
                    <span className="text-[10px] text-muted-foreground font-medium -mt-1">BPS Kabupaten Tangerang</span>
                  </div>
                </Link>
              </div>
              <nav className="grid gap-1.5 p-4 text-sm font-medium">
                {mobileMenuItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link key={item.name} href={item.href} className={cn(
                      "flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all font-semibold",
                      isActive ? "bg-primary/10 text-primary border-l-4 border-primary" : "text-muted-foreground hover:bg-muted"
                    )}>
                      <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Bot Status Indicator */}
        <BotStatusBadge />
      </div>

      <div className="flex items-center justify-end gap-3 sm:gap-4">
        {/* Notification Bell Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-9 w-9 rounded-xl border-border/80">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 shadow-lg border-border/80">
            <DropdownMenuLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground px-2 py-1.5">
              Notifikasi Eskalasi Baru
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem asChild className="p-3 cursor-pointer items-start flex-col gap-1 rounded-xl">
              <Link href="/eskalasi">
                <div className="font-bold text-xs sm:text-sm text-foreground">Tiket Masuk Baru</div>
                <div className="text-xs text-muted-foreground">Pantau pesan eskalasi pelanggan yang memerlukan respons petugas.</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <Link href="/eskalasi">
              <Button variant="ghost" className="w-full text-xs font-bold text-center text-primary h-9 rounded-xl">
                Lihat Semua Eskalasi
              </Button>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Info Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-xl px-2 sm:px-3 h-10 hover:bg-muted/70 flex items-center gap-2.5 transition-colors">
              <Avatar className="h-8 w-8 border border-primary/20 shrink-0">
                <AvatarImage src="" alt="Avatar" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px]">{userName}</span>
                <span className={cn("text-[10px] font-extrabold px-1.5 py-0.2 rounded-md border mt-0.5 leading-none uppercase", getRoleBadgeClass(userRole))}>
                  {userRole}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 opacity-60 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-lg border-border/80">
            <DropdownMenuLabel className="flex flex-col p-2">
              <span className="font-bold text-sm text-foreground">{userName}</span>
              <span className="text-xs text-muted-foreground font-medium">{userRole}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/profile" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                <span>Profil Saya</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem 
              className="text-destructive cursor-pointer rounded-xl flex items-center gap-2 focus:bg-destructive/10 focus:text-destructive"
              onClick={async () => await logoutAction()}
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar Sistem</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
