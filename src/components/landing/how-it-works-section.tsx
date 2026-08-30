import { MessageSquarePlus, Bot, Headphones, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Kirim Pesan WhatsApp",
      description: "Klik tombol WhatsApp di halaman ini atau kirim pesan 'Halo' ke nomor operasional BPS Kabupaten Tangerang.",
      icon: MessageSquarePlus,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    },
    {
      number: "02",
      title: "Respon Otomatis Bot",
      description: "Sistem chatbot pintar SIPASTI langsung menyajikan pilihan menu data statistik, FAQ, dan informasi indikator.",
      icon: Bot,
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      number: "03",
      title: "Eskalasi ke Petugas Piket",
      description: "Jika membutuhkan konsultasi khusus atau pengaduan, pesan Anda diteruskan langsung ke petugas humas yang piket.",
      icon: Headphones,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    }
  ];

  return (
    <section id="cara-kerja" className="py-20 lg:py-28 bg-muted/40 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-semibold mb-4 text-primary shadow-xs">
            Alur Pelayanan Publik
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-4">
            Mudah & Cepat dalam 3 Langkah
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Dapatkan informasi statistik tanpa perlu datang langsung ke kantor. Semua layanan dalam genggaman Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2 z-10 text-muted-foreground/30">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}

              {/* Step Badge */}
              <div className="absolute -top-4 bg-background border px-3 py-1 rounded-full text-xs font-bold text-muted-foreground shadow-xs">
                Langkah {step.number}
              </div>

              {/* Icon Container */}
              <div className={`p-4 rounded-2xl border mb-6 mt-2 ${step.color} transition-transform group-hover:scale-110 duration-300`}>
                <step.icon className="h-8 w-8 stroke-[1.75]" />
              </div>

              <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
