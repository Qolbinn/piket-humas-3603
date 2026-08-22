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
    .from('riwayat_pelanggan')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${today}T00:00:00`)

  // Eskalasi menunggu
  const { count: eskalasiWaiting } = await supabase
    .from('eskalasi')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'OPEN')

  // Eskalasi hari ini total
  const { count: eskalasiHariIni } = await supabase
    .from('eskalasi')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${today}T00:00:00`)

  // Petugas piket hari ini
  const { data: piketHariIni } = await supabase
    .from('jadwal_piket')
    .select('pegawai (id, name, gender)')
    .eq('tanggal', today)

  return {
    totalPercakapan:  totalPercakapan  ?? 0,
    eskalasiWaiting:  eskalasiWaiting  ?? 0,
    eskalasiHariIni:  eskalasiHariIni  ?? 0,
    petugas:          piketHariIni     ?? [],
  }
}
