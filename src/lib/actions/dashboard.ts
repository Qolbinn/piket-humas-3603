'use server'

// ============================================================
// Server Actions — Dashboard
// Statistik untuk halaman dashboard
// ============================================================

import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats(filter: 'today' | 'week' | 'month' = 'today') {
  const supabase = await createClient()

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  let startDateStr = todayStr;
  
  if (filter === 'week') {
    const d = new Date(now);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(d.setDate(diff));
    startDateStr = startOfWeek.toISOString().split('T')[0];
  } else if (filter === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startDateStr = startOfMonth.toISOString().split('T')[0];
  }

  // Total chat berdasarkan filter
  const { data: chatsData } = await supabase
    .from('riwayat_chat_harian')
    .select('count')
    .gte('tanggal', startDateStr)
    .lte('tanggal', todayStr)

  const totalPercakapan = chatsData?.reduce((acc, curr) => acc + (curr.count || 0), 0) || 0;

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
    .eq('tanggal', todayStr)

  // Fetch resolved eskalasi within filter range
  const { data: resolvedData } = await supabase
    .from('eskalasi')
    .select('created_at, resolved_at')
    .eq('status', 'RESOLVED')
    .gte('resolved_at', `${startDateStr}T00:00:00`)
    .lte('resolved_at', `${todayStr}T23:59:59`);

  let averageSla = 0;

  if (resolvedData && resolvedData.length > 0) {
    let totalMinutes = 0;
    resolvedData.forEach((e) => {
      const created = new Date(e.created_at).getTime();
      const resolved = new Date(e.resolved_at!).getTime();
      totalMinutes += (resolved - created) / (1000 * 60);
    });
    averageSla = Math.round(totalMinutes / resolvedData.length);
  }

  return {
    totalPercakapan:  totalPercakapan  ?? 0,
    eskalasiOpen:     eskalasiOpen     ?? 0,
    eskalasiOnProcess:eskalasiOnProcess?? 0,
    petugas:          piketHariIni     ?? [],
    averageSla,
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

export async function getCategoryDistribution(startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('eskalasi')
    .select('kategori_kode, kategori_layanan(nama)')
    .gte('created_at', `${startDate}T00:00:00`)
    .lte('created_at', `${endDate}T23:59:59`);

  if (error || !data) return [];

  const countMap = data.reduce((acc: Record<string, number>, item: any) => {
    // Attempt to get the name from the join, otherwise fallback to kode
    const name = item.kategori_layanan?.nama || item.kategori_kode || 'Lainnya';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(countMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export async function getChannelDistribution(startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('eskalasi')
    .select('channel')
    .gte('created_at', `${startDate}T00:00:00`)
    .lte('created_at', `${endDate}T23:59:59`);

  if (error || !data) return [];

  const countMap = data.reduce((acc: Record<string, number>, item) => {
    const channel = item.channel || 'Lainnya';
    acc[channel] = (acc[channel] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(countMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
