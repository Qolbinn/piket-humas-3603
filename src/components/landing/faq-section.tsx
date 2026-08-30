import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      question: "Bagaimana cara menghubungi layanan SIPASTI via WhatsApp?",
      answer: "Cukup klik tombol 'Chat WhatsApp Sekarang' atau tombol mengambang di pojok kanan bawah. Anda juga bisa menyimpan nomor operasional resmi BPS Kabupaten Tangerang di ponsel Anda dan mengirim pesan 'Halo'."
    },
    {
      question: "Apakah chatbot WhatsApp ini aktif 24 jam?",
      answer: "Ya, sistem bot otomatis dapat memberikan respon informasi jam buka, alamat, dan menu data populer selama 24 jam penuh. Untuk konsultasi langsung dengan petugas piket, layanan tersedia pada jam kerja resmi kantor (Senin-Jumat, 08:00 - 16:00 WIB)."
    },
    {
      question: "Data dan informasi statistik apa saja yang bisa ditanyakan?",
      answer: "Anda dapat menanyakan berbagai data indikator makro BPS Kabupaten Tangerang seperti Indeks Pembangunan Manusia (IPM), Tingkat Pengangguran Terbuka (TPT), angka inflasi, jumlah penduduk, hingga penjelasan definisi konsep statistik."
    },
    {
      question: "Bagaimana jika pertanyaan saya tidak ada di menu bot otomatis?",
      answer: "Ketik pilihan '99' pada obrolan WhatsApp untuk terhubung ke petugas piket. Pesan Anda akan langsung masuk ke antrean eskalasi dan petugas humas kami yang sedang bertugas akan membalas pesan Anda."
    },
    {
      question: "Apakah layanan informasi data ini dipungut biaya?",
      answer: "Tidak ada biaya sama sekali. Seluruh pelayanan informasi publik BPS Kabupaten Tangerang melalui layanan SIPASTI ini disediakan secara 100% gratis dan resmi."
    }
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-semibold mb-4 text-primary">
            Pertanyaan Populer
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-4">
            Pertanyaan Umum (FAQ)
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Temukan jawaban cepat atas pertanyaan seputar penggunaan layanan informasi statistik SIPASTI.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full bg-background rounded-2xl border p-4 sm:p-6 shadow-xs">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0 py-1">
              <AccordionTrigger className="text-left text-base sm:text-lg font-bold py-4 hover:no-underline hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed pb-4 pt-1">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
