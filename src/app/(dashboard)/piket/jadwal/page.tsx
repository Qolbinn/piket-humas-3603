import { JadwalTab } from "@/components/piket/jadwal-tab";
import { getJadwalByRange } from "@/lib/actions/jadwal";
import { getTemplates } from "@/lib/actions/template";
import { getPegawai } from "@/lib/actions/pegawai";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default async function JadwalPage() {
  const now = new Date();
  
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(monthStart);
  
  const startDay = monthStart.getDay();
  const adjustedStart = new Date(monthStart);
  adjustedStart.setDate(monthStart.getDate() - (startDay === 0 ? 6 : startDay - 1));

  const endDay = monthEnd.getDay();
  const adjustedEnd = new Date(monthEnd);
  adjustedEnd.setDate(monthEnd.getDate() + (endDay === 0 ? 7 - endDay : 7 - endDay));

  const [jadwalInitial, templates, pegawais] = await Promise.all([
    getJadwalByRange(
      format(adjustedStart, "yyyy-MM-dd"), 
      format(adjustedEnd, "yyyy-MM-dd")
    ),
    getTemplates(),
    getPegawai()
  ]);

  return <JadwalTab initialData={jadwalInitial} templates={templates} pegawais={pegawais} />;
}
