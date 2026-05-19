import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const mockEskalasi = [
  {
    id: "1",
    nomor: "+62 812-3456-7890",
    nama: "Ahmad Fauzi",
    keperluan: "Pengaduan Layanan",
    waktu: "Senin, 12 Mei - 14:30 WIB"
  },
  {
    id: "2",
    nomor: "+62 856-7890-1234",
    nama: "Siti Rahma",
    keperluan: "Pertanyaan Prosedur Sensus",
    waktu: "Senin, 12 Mei - 15:45 WIB"
  },
  {
    id: "3",
    nomor: "+62 811-2233-4455",
    nama: "Budi Santoso",
    keperluan: "Kendala Aplikasi Sensus",
    waktu: "Selasa, 13 Mei - 09:15 WIB"
  }
];

export default function PelangganPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ekskalasi Pelanggan</h1>
        <p className="text-muted-foreground">Daftar pelanggan yang diekskalasi dari interaksi chatbot WhatsApp.</p>
      </div>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nomor Pelanggan</TableHead>
              <TableHead>Nama Pelanggan</TableHead>
              <TableHead>Keperluan</TableHead>
              <TableHead>Waktu Masuk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEskalasi.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.nomor}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.keperluan}</TableCell>
                <TableCell>{item.waktu}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
