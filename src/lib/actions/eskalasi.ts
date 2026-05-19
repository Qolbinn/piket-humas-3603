'use server'

// ============================================================
// Server Actions — Eskalasi
// CRUD + update status + realtime support
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Eskalasi } from '@/lib/types/database'

// ---- GET ESKALASI (dengan filter status) ----
export async function getEskalasi(status?: 'waiting' | 'handled' | 'closed') {
  const supabase = await createClient()

  let query = supabase
    .from('eskalasi')
    .select(`
      *,
      pegawai (id, name, gender)
    `)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data
}

// ---- GET ESKALASI STATS (untuk dashboard) ----
export async function getEskalasiStats() {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  const { count: totalHariIni } = await supabase
    .from('eskalasi')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${today}T00:00:00`)

  const { count: waiting } = await supabase
    .from('eskalasi')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'waiting')

  return { totalHariIni: totalHariIni ?? 0, waiting: waiting ?? 0 }
}

// ---- HANDLE ESKALASI (ubah status ke handled) ----
export async function handleEskalasi(id: string, pegawaiId: string) {
  const supabase = await createClient()

  const handledAt = new Date().toISOString()

  // Ambil created_at untuk menghitung waktu_respons
  const { data: eskalasi } = await supabase
    .from('eskalasi')
    .select('created_at')
    .eq('id', id)
    .single() as { data: { created_at: string } | null, error: unknown }

  let waktuRespons: number | null = null
  if (eskalasi?.created_at) {
    const diffMs = new Date(handledAt).getTime() - new Date(eskalasi.created_at).getTime()
    waktuRespons = Math.round(diffMs / 1000 / 60) // dalam menit
  }

  const { error } = (await supabase
    .from('eskalasi')
    .update({
      status: 'handled',
      pegawai_id: pegawaiId,
      handled_at: handledAt,
      waktu_respons: waktuRespons,
    } as any)
    .eq('id', id)) as any

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true, waktuRespons }
}

// ---- CLOSE ESKALASI ----
export async function closeEskalasi(id: string) {
  const supabase = await createClient()

  const { error } = (await supabase
    .from('eskalasi')
    .update({ status: 'closed' } as any)
    .eq('id', id)) as any

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}
