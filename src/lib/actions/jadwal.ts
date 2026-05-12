'use server'

// ============================================================
// Server Actions — Jadwal Piket
// CRUD untuk jadwal_piket dan template
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ---- GET JADWAL BY MONTH ----
export async function getJadwalByMonth(year: number, month: number) {
  const supabase = await createClient()

  // Bulan di JS 0-indexed, tapi di PostgreSQL 1-indexed
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = new Date(year, month, 0).toISOString().split('T')[0] // last day

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

// ---- GET ALL TEMPLATES ----
export async function getTemplates() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('template')
    .select(`
      *,
      template_detail (
        *,
        pegawai (id, name, gender)
      )
    `)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

// ---- ASSIGN TEMPLATE TO WEEKS ----
export async function assignTemplateToWeeks(
  templateId: string,
  dates: string[] // array of ISO date strings (hanya Senin-Jumat)
) {
  const supabase = await createClient()

  // Ambil detail template
  const { data: details, error: detailError } = await supabase
    .from('template_detail')
    .select('day_of_week, pegawai_id')
    .eq('template_id', templateId)

  if (detailError || !details) throw new Error('Template tidak ditemukan.')

  // Build rows jadwal_piket dari tanggal yang dipilih
  const rows = dates.flatMap((dateStr) => {
    const dayOfWeek = new Date(dateStr).getDay() // 0=Sun, 1=Mon, ...
    // Convert ke 1-5 (Senin-Jumat)
    const mappedDay = dayOfWeek === 0 ? 7 : dayOfWeek

    const pegawaiForDay = details.filter(d => d.day_of_week === mappedDay)
    return pegawaiForDay.map(d => ({
      tanggal: dateStr,
      pegawai_id: d.pegawai_id,
      template_id: templateId,
    }))
  })

  if (rows.length === 0) return { success: false, message: 'Tidak ada jadwal yang dibuat.' }

  const { error } = await supabase
    .from('jadwal_piket')
    .upsert(rows, { onConflict: 'tanggal,pegawai_id', ignoreDuplicates: true })

  if (error) throw new Error(error.message)

  revalidatePath('/piket')
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
