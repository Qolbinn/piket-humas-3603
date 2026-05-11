import { Bell, Calendar, LayoutDashboard } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Notifikasi Realtime",
      description: "Dapatkan pemberitahuan seketika di dashboard saat ada pelanggan yang membutuhkan bantuan petugas secara langsung.",
      icon: Bell,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Jadwal Piket Terpadu",
      description: "Sistem penjadwalan otomatis yang memastikan selalu ada petugas yang stand-by untuk melayani pertanyaan pelanggan.",
      icon: Calendar,
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      title: "Dashboard Manajemen",
      description: "Pantau performa chatbot, kelola data pegawai, dan lihat statistik interaksi harian dari satu tempat tersentralisasi.",
      icon: LayoutDashboard,
      color: "text-green-600 dark:text-green-400", 
      bg: "bg-green-100 dark:bg-green-900/20"
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Fitur Utama</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dirancang khusus untuk mempermudah pekerjaan humas dan mempercepat respons kepada masyarakat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative p-8 bg-background rounded-2xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className={`inline-flex items-center justify-center rounded-xl p-3 mb-6 ${feature.bg} ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
