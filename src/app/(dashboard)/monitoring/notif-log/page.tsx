import { getNotifLogs } from "@/lib/actions/monitoring";
import NotifLogTableClient from "@/components/features/monitoring/NotifLogTableClient";
import { MessageSquareWarning } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { DateRangeFilter } from "@/components/features/eskalasi/DateRangeFilter";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { redirect } from "next/navigation";

export default async function NotifLogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  let { from, to } = resolvedSearchParams;

  if (!from || !to) {
    const now = new Date();
    const defaultFrom = format(startOfMonth(now), "yyyy-MM-dd");
    const defaultTo = format(endOfMonth(now), "yyyy-MM-dd");
    
    const newParams = new URLSearchParams();
    newParams.set("from", defaultFrom);
    newParams.set("to", defaultTo);
    
    redirect(`/monitoring/notif-log?${newParams.toString()}`);
  }

  const data = await getNotifLogs(from, to);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <PageHeader
          title="Log Notifikasi Bot"
          description="Pantau riwayat pengiriman pesan otomatis (reminder & feedback) dari sistem ke WhatsApp."
          breadcrumbText="Monitoring"
          breadcrumbIcon={MessageSquareWarning}
        />
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeFilter />
        </div>
      </div>

      <NotifLogTableClient data={data} />
    </div>
  );
}
