'use server'

// ============================================================
// Server Actions — Dashboard
// Statistik untuk halaman dashboard
// ============================================================

import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  // Total chat hari ini
  const { count: totalPercakapan } = await supabase
    .from('riwayat_chat_harian')
    .select('*', { count: 'exact', head: true })
    .eq('tanggal', today)

  // Eskalasi OPEN
  const { count: eskalasiOpen } = await supabase
    .from('eskalasi')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'OPEN')

  // Eskalasi ON_PROCESS
  const { count: eskalasiOnProcess } = await supabase
    .from('eskalasi')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ON_PROCESS')

  // Petugas piket hari ini
  const { data: piketHariIni } = await supabase
    .from('jadwal_piket')
    .select('pegawai (id, name, gender)')
    .eq('tanggal', today)

  return {
    totalPercakapan:  totalPercakapan  ?? 0,
    eskalasiOpen:     eskalasiOpen     ?? 0,
    eskalasiOnProcess:eskalasiOnProcess?? 0,
    petugas:          piketHariIni     ?? [],
  }
}

export async function getChatHistoryByDateRange(startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('riwayat_chat_harian')
    .select('tanggal')
    .gte('tanggal', startDate)
    .lte('tanggal', endDate);

  if (error) {
    console.error('Error getChatHistoryByDateRange:', error);
    return [];
  }

  // Aggregate count by date
  const countsByDate = data.reduce((acc: Record<string, number>, item) => {
    acc[item.tanggal] = (acc[item.tanggal] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(countsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
