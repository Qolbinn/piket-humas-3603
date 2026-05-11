"use client";

import { Bell, Menu, LayoutDashboard, CalendarDays, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mobileMenuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Jadwal Piket", href: "/piket", icon: CalendarDays },
  { name: "Data Pegawai", href: "/pegawai", icon: Users },
  { name: "Data Pelanggan", href: "/pelanggan", icon: MessageSquare },
];

export function DashboardNavbar() {
  const pathname = usePathname();

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between md:justify-end">
      {/* Mobile Menu Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="h-full flex flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-xl text-primary font-bold">Humas</span>
              </div>
            </div>
            <nav className="grid gap-2 p-4 text-sm font-medium">
               {mobileMenuItems.map((item) => {
                 const isActive = pathname.startsWith(item.href);
                 return (
                   <Link key={item.name} href={item.href} className={cn(
                     "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                     isActive ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted"
                   )}>
                     <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                     {item.name}
                   </Link>
                 );
               })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center justify-end gap-4">
        <Button variant="outline" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-4 w-4" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-secondary" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src="" alt="Avatar" />
                <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span>John Doe</span>
              <span className="text-xs text-muted-foreground font-normal">Petugas Humas</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Pengaturan</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Keluar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
