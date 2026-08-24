'use server'

import { createClient } from '@/lib/supabase/server'

export async function getNotifLogs(from?: string, to?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('bot_notif_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (from) {
    query = query.gte('created_at', `${from}T00:00:00`)
  }
  if (to) {
    query = query.lte('created_at', `${to}T23:59:59`)
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching notif logs:', error)
    return [] as any[]
  }
  return data as any[]
}

export async function getKinerjaPetugas(from?: string, to?: string) {
  const supabase = await createClient()
  
  // Get all pegawai
  const { data: pegawaiList } = await supabase
    .from('pegawai')
    .select('id, name, role')
    .in('role', ['petugas', 'admin', 'pimpinan'])
    
  // Get all jadwal to calculate compliance
  let jadwalQuery = supabase
    .from('jadwal_piket')
    .select('pegawai_id, is_hadir')
    
  if (from) jadwalQuery = jadwalQuery.gte('tanggal', from)
  if (to) jadwalQuery = jadwalQuery.lte('tanggal', to)

  const { data: jadwalList } = await jadwalQuery;
    
  // Get all eskalasi to calculate SLA
  let eskalasiQuery = supabase
    .from('eskalasi')
    .select('pegawai_id, status, created_at, resolved_at')
    
  if (from) eskalasiQuery = eskalasiQuery.gte('created_at', `${from}T00:00:00`)
  if (to) eskalasiQuery = eskalasiQuery.lte('created_at', `${to}T23:59:59`)

  const { data: eskalasiList } = await eskalasiQuery;
    
  if (!pegawaiList) return []

  const kinerjaData = pegawaiList.map(pegawai => {
    // 1. Calculate Schedule Compliance
    const pegawaiJadwal = jadwalList?.filter(j => j.pegawai_id === pegawai.id) || []
    const totalJadwal = pegawaiJadwal.length
    const totalHadir = pegawaiJadwal.filter(j => j.is_hadir).length
    const compliancePercentage = totalJadwal > 0 ? (totalHadir / totalJadwal) * 100 : 0
    
    // 2. Calculate Escalations Handled
    const pegawaiEskalasi = eskalasiList?.filter(e => e.pegawai_id === pegawai.id) || []
    const totalAssigned = pegawaiEskalasi.length
    
    // 3. Calculate SLA (Average Resolution Time in minutes)
    const resolvedEskalasi = pegawaiEskalasi.filter(e => e.status === 'RESOLVED' && e.resolved_at)
    let totalMinutes = 0
    resolvedEskalasi.forEach(e => {
      const created = new Date(e.created_at).getTime()
      const resolved = new Date(e.resolved_at!).getTime()
      totalMinutes += (resolved - created) / (1000 * 60)
    })
    
    const averageResolutionTimeMinutes = resolvedEskalasi.length > 0 
      ? totalMinutes / resolvedEskalasi.length 
      : 0
      
    return {
      id: pegawai.id,
      name: pegawai.name,
      role: pegawai.role,
      totalJadwal,
      totalHadir,
      compliancePercentage,
      totalAssigned,
      totalResolved: resolvedEskalasi.length,
      averageResolutionTimeMinutes
    }
  })

  // Sort by name
  return kinerjaData.sort((a, b) => a.name.localeCompare(b.name))
}
