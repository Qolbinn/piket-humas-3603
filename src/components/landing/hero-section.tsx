import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[100px]"></div>
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-6 text-primary shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Pelayanan Publik Digital BPS
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6 leading-[1.1]">
              Layanan Humas <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Responsif & Terpadu
              </span>
            </h1>
            
            <p className="max-w-xl text-xl text-muted-foreground mb-10 leading-relaxed">
              Sistem chatbot WhatsApp cerdas yang didukung dengan manajemen dashboard terpusat untuk memberikan informasi dan layanan pengaduan secara instan kepada masyarakat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 px-8 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl">
                  Masuk Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-background/50 backdrop-blur-sm border-2 hover:bg-muted transition-all rounded-xl">
                <MessageCircle className="mr-2 h-5 w-5 text-[#25D366]" />
                Coba Chatbot WA
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <p>Dipercaya oleh petugas humas BPS</p>
            </div>
          </div>

          {/* Right side Visual/Mockup */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            <div className="relative rounded-2xl border bg-background/50 backdrop-blur-xl shadow-2xl p-2 lg:p-4 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 rounded-2xl pointer-events-none"></div>
              <img 
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop" 
                alt="Chatbot Illustration" 
                className="w-full h-auto rounded-xl shadow-inner opacity-90 object-cover aspect-[4/3]"
              />
              {/* Floating notification badge */}
              <div className="absolute -left-6 top-1/4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border animate-bounce flex items-center gap-3">
                <div className="bg-[#25D366] p-2 rounded-full">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">Pesan Baru</p>
                  <p className="text-xs text-muted-foreground">Butuh bantuan petugas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
