'use server'

// ============================================================
// Server Actions — Jadwal Piket
// CRUD untuk jadwal_piket dan template
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TemplateDetail, JadwalPiket } from '@/lib/types/database'

// ---- GET JADWAL BY RANGE ----
export async function getJadwalByRange(startDate: string, endDate: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('jadwal_piket')
    .select(`
      *,
      pegawai (id, name, gender)
    `)
    .gte('tanggal', startDate)
    .lte('tanggal', endDate)
    .order('tanggal', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

// ---- GET MY SCHEDULE BY MONTH ----
export async function getMySchedule(year: number, month: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const lastDay = new Date(year, month, 0).getDate()
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('jadwal_piket')
    .select(`
      *,
      pegawai (id, name, gender)
    `)
    .eq('pegawai_id', user.id)
    .gte('tanggal', startDate)
    .lte('tanggal', endDate)
    .order('tanggal', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

// ---- HELPER: Cek role admin ----
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Tidak terautentikasi.')

  const { data: pegawai } = (await supabase
    .from('pegawai')
    .select('role')
    .eq('id', user.id)
    .single()) as any

  if (pegawai?.role !== 'admin') {
    throw new Error('Akses ditolak. Hanya admin yang dapat melakukan tindakan ini.')
  }

  return { supabase }
}

// ---- ASSIGN TEMPLATE TO RANGE ----
export async function assignJadwal(
  templateId: string,
  startDate: string, // YYYY-MM-DD
  endDate: string    // YYYY-MM-DD
) {
  const { supabase } = await requireAdmin()

  // 1. Ambil detail template
  const { data: details, error: detailError } = (await supabase
    .from('template_piket_detail')
    .select('day_of_week, pegawai_id')
    .eq('template_id', templateId)) as any

  if (detailError || !details || details.length === 0) {
    throw new Error('Template tidak ditemukan atau tidak memiliki alokasi petugas.')
  }

  // 2. Generate baris jadwal_piket
  const start = new Date(startDate)
  const end = new Date(endDate)
  const rows: any[] = []

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay() // 0=Minggu, 1=Senin, ..., 6=Sabtu
    
    // Hanya Senin-Jumat (1-5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dateStr = d.toISOString().split('T')[0]
      
      // Ambil petugas untuk hari ini
      const pegawais = details.filter((detail: any) => detail.day_of_week === dayOfWeek)
      
      pegawais.forEach((p: any) => {
        rows.push({
          tanggal: dateStr,
          pegawai_id: p.pegawai_id,
          template_id: templateId
        })
      })
    }
  }

  if (rows.length === 0) {
    return { success: false, message: 'Tidak ada jadwal yang dihasilkan untuk rentang tanggal ini (mungkin hanya akhir pekan).' }
  }

  // 3. Hapus jadwal lama pada tanggal-tanggal yang akan diisi oleh template ini
  const uniqueDatesToReplace = Array.from(new Set(rows.map(r => r.tanggal)))
  if (uniqueDatesToReplace.length > 0) {
    const { error: deleteError } = await supabase
      .from('jadwal_piket')
      .delete()
      .in('tanggal', uniqueDatesToReplace)
      
    if (deleteError) throw new Error(deleteError.message)
  }

  // 4. Insert ke database (bulk)
  const { error } = await supabase
    .from('jadwal_piket')
    .insert(rows)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/jadwal')
  return { success: true, count: rows.length }
}

// ---- DELETE JADWAL ----
export async function deleteJadwal(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('jadwal_piket')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/piket')
}

// ---- GET TODAY SCHEDULE (For Checklist) ----
export async function getTodaySchedule() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Waktu lokal atau padStart manual bisa bermasalah zona waktu, mari amankan dengan Date biasa
  const d = new Date()
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('jadwal_piket')
    .select('*')
    .eq('pegawai_id', user.id)
    .eq('tanggal', todayStr)
    .single()
    
  if (error) return null
  return data
}

// ---- CONFIRM PRESENCE ----
export async function confirmPresence(jadwalId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthenticated')

  const { error } = await supabase
    .from('jadwal_piket')
    .update({ is_hadir: true, hadir_at: new Date().toISOString() })
    .eq('id', jadwalId)
    .eq('pegawai_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}
