import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Mail, Phone, ExternalLink } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/60 pt-16 pb-12 text-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border/80">
          
          {/* Col 1: Brand & Desc */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo-bps.svg" alt="Logo BPS" width={36} height={36} className="h-9 w-9 object-contain" />
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">SIPASTI</span>
                <span className="text-xs block text-muted-foreground font-semibold -mt-1">BPS Kabupaten Tangerang</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Sistem Pelayanan Statistik Terintegrasi. Layanan informasi statistik resmi & konsultasi pengaduan via WhatsApp untuk masyarakat Kabupaten Tangerang.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">Navigasi Cepat</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="#fitur" className="hover:text-primary transition-colors">Fitur Layanan</Link>
              </li>
              <li>
                <Link href="#cara-kerja" className="hover:text-primary transition-colors">Cara Kerja</Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-primary transition-colors">Pertanyaan Umum (FAQ)</Link>
              </li>
              <li>
                <a href="https://tangerangkab.bps.go.id" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  <span>Website Resmi BPS</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">Kontak & Operasional</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Jl. Somawinata No. 1, Tigaraksa, Kec. Tigaraksa, Kabupaten Tangerang, Banten 15720</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Senin - Jumat: 08:00 - 16:00 WIB</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>bps3603@bps.go.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} BPS Kabupaten Tangerang. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
              <span>Portal Login Petugas</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
