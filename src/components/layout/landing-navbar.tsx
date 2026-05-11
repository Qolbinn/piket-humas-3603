import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Image src="/logo-bps.svg" alt="Logo BPS" width={32} height={32} className="h-8 w-auto" />
          <span className="text-xl font-bold tracking-tight text-primary">Humas</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">Fitur</Link>
          <Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="default">Login Petugas</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
