import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      question: "Apakah bot WA aktif 24 jam?",
      answer: "Bot dirancang untuk aktif pada jam kerja (saat PC server kantor dinyalakan). Jika ada pesan masuk di luar jam kerja, sistem akan secara otomatis merespons saat server kembali online di pagi hari."
    },
    {
      question: "Siapa yang dapat mengakses Dashboard Manajemen?",
      answer: "Dashboard hanya dapat diakses oleh pegawai dan petugas Humas BPS yang telah terdaftar dan memiliki kredensial login resmi."
    },
    {
      question: "Bagaimana cara kerja fitur Mengobrol dengan Petugas?",
      answer: "Jika pengguna memilih menu ini di WhatsApp, bot akan meminta data singkat. Kemudian, notifikasi realtime akan dikirim ke Dashboard, dan petugas yang sedang piket dapat langsung merespons via WA."
    },
    {
      question: "Apakah sistem ini gratis digunakan?",
      answer: "Sistem menggunakan stack open-source (Baileys) dan free-tier cloud services (Vercel, Supabase), sehingga meminimalkan biaya infrastruktur bulanan."
    }
  ];

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Pertanyaan Umum (FAQ)</h2>
          <p className="text-lg text-muted-foreground">
            Informasi seputar penggunaan sistem Piket Humas
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b">
              <AccordionTrigger className="text-left text-lg font-medium py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
