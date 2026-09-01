import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { UserCheck } from 'lucide-react';

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo-bps.svg" alt="Logo BPS" width={36} height={36} className="h-9 w-9 object-contain transition-transform group-hover:scale-105" priority />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">SIPASTI</span>
              <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">BPS 3603</span>
            </div>
            <span className="text-[11px] text-muted-foreground hidden sm:inline-block font-medium -mt-1">Piket & Layanan Humas Terpadu</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#fitur" className="text-muted-foreground hover:text-primary transition-colors">Fitur Utama</Link>
          <Link href="#cara-kerja" className="text-muted-foreground hover:text-primary transition-colors">Cara Kerja</Link>
          <Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary font-medium">
              <UserCheck className="h-4 w-4" />
              <span>Login Petugas</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
