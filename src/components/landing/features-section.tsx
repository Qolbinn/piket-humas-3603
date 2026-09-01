import { MessageCircle, Zap, UserCheck, ShieldCheck } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Chatbot WhatsApp 24/7",
      description: "Dapatkan info jam layanan, jadwal sensus, dan jawaban pertanyaan umum kapan saja tanpa menunggu jam kantor.",
      icon: MessageCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Respon Indikator Cepat",
      description: "Tanyakan data statistik populer seperti IPM, Inflasi, Ketenagakerjaan, dan PDRB langsung melalui pesan singkat.",
      icon: Zap,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Terhubung Petugas Piket",
      description: "Jika pertanyaan tidak tersedia di menu bot, pesan Anda akan diteruskan ke petugas humas yang sedang bertugas.",
      icon: UserCheck,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20"
    },
    {
      title: "Resmi, Aman & Gratis",
      description: "Layanan publik digital dari BPS Kabupaten Tangerang tanpa dipungut biaya apapun (100% Bebas Pungli).",
      icon: ShieldCheck,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20"
    }
  ];

  return (
    <section id="fitur" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-xs font-semibold mb-4 text-primary">
            Keunggulan Layanan
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-4">
            Mengapa Menggunakan SIPASTI?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Inovasi pelayanan statistik yang dirancang untuk memberikan kemudahan, kecepatan, dan kenyamanan masyarakat.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative p-7 bg-background rounded-2xl border border-border/80 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col items-start"
            >
              <div className={`inline-flex items-center justify-center rounded-xl p-3 mb-5 border ${feature.bg} ${feature.color}`}>
                <feature.icon className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
