import { AlokasiTab } from "@/components/piket/alokasi-tab";
import { getTemplates } from "@/lib/actions/template";
import { getPegawai } from "@/lib/actions/pegawai";

export default async function AlokasiPage() {
  const [templates, pegawais] = await Promise.all([
    getTemplates(),
    getPegawai()
  ]);

  return <AlokasiTab templates={templates} pegawais={pegawais} />;
}
