import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, ArrowRight, CheckCircle2, ShieldCheck, Zap, Headphones } from "lucide-react";

export function HeroSection() {
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890";
  const waUrl = `https://wa.me/${waNumber}?text=Halo%20BPS%20Kabupaten%20Tangerang%20SIPASTI%20bisa%20bantu%20informasi%3F`;

  return (
    <section className="relative overflow-hidden bg-background pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-[#25D366]/10 blur-[120px]"></div>
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-6 text-primary shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#25D366] animate-pulse"></span>
              Layanan Pelayanan Statistik Terintegrasi (SIPASTI)
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6 leading-[1.15]">
              Butuh Data & Informasi Statistik? <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-[#25D366]">
                Tanya Langsung via WhatsApp!
              </span>
            </h1>
            
            <p className="max-w-2xl text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
              Layanan informasi resmi BPS Kabupaten Tangerang. Dapatkan jawaban cepat seputar data IPM, inflasi, statistik kependudukan, atau terhubung langsung dengan petugas piket secara gratis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 px-8 text-base font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/25 hover:shadow-[#25D366]/40 transition-all rounded-xl gap-3">
                  <MessageCircle className="h-6 w-6 fill-white stroke-none" />
                  <span>Chat WhatsApp Sekarang</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
              <Link href="#cara-kerja" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full h-14 px-8 text-base font-semibold bg-background/60 backdrop-blur-sm border-2 hover:bg-muted transition-all rounded-xl">
                  Pelajari Cara Kerja
                </Button>
              </Link>
            </div>

            {/* Value Props Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-4 border-t border-border/60">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground/80">
                <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Respon Otomatis 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground/80">
                <Headphones className="h-4 w-4 text-primary shrink-0" />
                <span>Eskalasi ke Petugas Piket</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground/80">
                <ShieldCheck className="h-4 w-4 text-[#25D366] shrink-0" />
                <span>100% Resmi & Gratis</span>
              </div>
            </div>
          </div>

          {/* Right Column: WhatsApp Mockup Visual */}
          <div className="lg:col-span-5 relative w-full max-w-[440px] mx-auto lg:max-w-none">
            {/* Glowing Backdrop */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-[#25D366] rounded-3xl blur-xl opacity-30 animate-pulse"></div>
            
            {/* Mobile Phone Mockup Frame */}
            <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl p-3 sm:p-4 text-slate-100 overflow-hidden">
              
              {/* WhatsApp Header Mockup */}
              <div className="bg-[#075E54] text-white p-3 rounded-t-2xl flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#075E54] font-bold text-sm overflow-hidden p-0.5">
                    <img src="/logo-bps.svg" alt="BPS Logo" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-sm truncate">SIPASTI BPS Kab. Tangerang</h4>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-400 stroke-white shrink-0" />
                  </div>
                  <p className="text-[11px] text-emerald-100/90 font-medium">Online • Layanan Resmi</p>
                </div>
              </div>

              {/* Chat Content Body */}
              <div className="bg-[#E5DDD5] dark:bg-slate-900 p-3 sm:p-4 flex flex-col gap-3 min-h-[380px] max-h-[420px] overflow-y-auto text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-sans rounded-b-2xl">
                
                {/* Time stamp indicator */}
                <div className="self-center bg-white/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 text-[10px] px-2.5 py-1 rounded-md shadow-xs">
                  Hari ini
                </div>

                {/* User Message */}
                <div className="self-end bg-[#DCF8C6] dark:bg-emerald-900/60 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl rounded-tr-xs max-w-[82%] shadow-xs border border-emerald-200/40">
                  <p className="font-normal">Halo BPS, saya mau tanya data IPM Kabupaten Tangerang terbaru dong?</p>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 float-right ml-2 mt-1">08:30 ✓✓</span>
                </div>

                {/* Bot Response */}
                <div className="self-start bg-white dark:bg-slate-800 p-3 rounded-xl rounded-tl-xs max-w-[88%] shadow-xs border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-[#075E54] dark:text-emerald-400 mb-1">🤖 Bot SIPASTI BPS</p>
                  <p className="leading-snug">Selamat pagi! Indeks Pembangunan Manusia (IPM) BPS Kab. Tangerang tahun 2023 adalah <b>73.32</b> (Meningkat 0.75 point).</p>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                    <p className="font-medium text-slate-700 dark:text-slate-200">Ketik pilihan lanjutan:</p>
                    <p className="mt-0.5"><b>1</b> • Detail Komponen IPM</p>
                    <p><b>99</b> • Bicara dengan Petugas Piket</p>
                  </div>
                  <span className="text-[9px] text-slate-400 float-right mt-1">08:30</span>
                </div>

                {/* Escalation Notification Badge floating inside */}
                <div className="mt-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-2.5 rounded-xl border border-emerald-500/30 shadow-lg flex items-center gap-2.5 animate-bounce">
                  <div className="bg-[#25D366] p-1.5 rounded-lg text-white">
                    <Headphones className="h-4 w-4" />
                  </div>
                  <div className="text-[11px] flex-1">
                    <p className="font-bold text-slate-900 dark:text-slate-100 leading-none">Petugas Stand-by</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">Petugas piket siap melayani pertanyaan spesifik Anda</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
