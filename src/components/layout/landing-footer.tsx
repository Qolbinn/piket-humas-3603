import Image from 'next/image';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/40 py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo-bps.svg" alt="Logo BPS" width={32} height={32} className="h-8 w-auto grayscale opacity-70" style={{ width: "auto" }} />
            <span className="text-xl font-bold tracking-tight text-muted-foreground">Piket Humas</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Badan Pusat Statistik. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Login Petugas
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
