'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { EskalasiStatus } from '../types/database'
import { getCurrentPegawai } from './auth'

export interface GetEskalasiParams {
  page: number
  limit?: number
  from?: string
  to?: string
  query?: string
  status?: string
  channel?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export async function getEskalasiSummary(from?: string, to?: string) {
  const supabase = await createClient()
  let q = supabase.from('eskalasi').select('status')
  
  if (from) q = q.gte('created_at', `${from}T00:00:00Z`)
  if (to) q = q.lte('created_at', `${to}T23:59:59Z`)
  
  const { data, error } = await q
  if (error) throw new Error(error.message)

  let total = 0
  let unresolved = 0
  let resolved = 0

  data.forEach(item => {
    total++
    if (item.status === 'RESOLVED') {
      resolved++
    } else {
      unresolved++
    }
  })

  return { total, unresolved, resolved }
}

export async function getEskalasi({ page, limit = 10, from, to, query: searchQuery, status, channel, sortBy, sortOrder }: GetEskalasiParams) {
  const supabase = await createClient()

  let query = supabase
    .from('eskalasi')
    .select('*, pegawai:pegawai_id(*), kategori_layanan:kategori_kode(nama)', { count: 'exact' })

  // Filter by date range (using created_at)
  if (from) {
    query = query.gte('created_at', `${from}T00:00:00Z`)
  }
  if (to) {
    query = query.lte('created_at', `${to}T23:59:59Z`)
  }

  // Search filter
  if (searchQuery) {
    query = query.or(`nama_pelanggan.ilike.%${searchQuery}%,detail.ilike.%${searchQuery}%`)
  }

  // Status filter
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  // Channel filter
  if (channel && channel !== 'all') {
    query = query.eq('channel', channel)
  }

  // Sorting
  if (sortBy) {
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  } else {
    query = query.order('status_weight', { ascending: true }).order('created_at', { ascending: true })
  }

  // Pagination
  const fromIndex = (page - 1) * limit
  const toIndex = fromIndex + limit - 1
  query = query.range(fromIndex, toIndex)

  const { data, error, count } = await query

  if (error) throw new Error(error.message)

  return {
    data,
    count: count ?? 0,
    totalPages: count ? Math.ceil(count / limit) : 0,
  }
}

export async function updateEskalasiStatus(id: string, status: EskalasiStatus, currentUserId?: string) {
  const supabase = await createClient()

  if (!currentUserId) throw new Error('Akses ditolak. Anda harus login terlebih dahulu.')

  const updateData: any = { status }

  if (status === 'ON_PROCESS') {
    updateData.pegawai_id = currentUserId
    updateData.resolved_at = null
  } else if (status === 'RESOLVED') {
    updateData.pegawai_id = currentUserId
    updateData.resolved_at = new Date().toISOString()
  } else if (status === 'OPEN') {
    // Reset if moved back to waiting
    updateData.pegawai_id = null
    updateData.resolved_at = null
  }

  const { error } = await supabase
    .from('eskalasi')
    .update(updateData)
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/eskalasi')
  return { success: true }
}

export async function triggerSurvey(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('eskalasi')
    .update({ feedback_status: 'PENDING' })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/eskalasi')
  return { success: true }
}

export async function createEskalasi(formData: FormData) {
  const supabase = await createClient()
  const pegawai = await getCurrentPegawai()
  
  const channel = formData.get('channel') as string
  const created_at = formData.get('created_at') as string
  let pelanggan_lid = formData.get('pelanggan_lid') as string | null
  const nama_pelanggan = formData.get('nama_pelanggan') as string
  const kategori_kode = formData.get('kategori_kode') as string
  const detail = formData.get('detail') as string
  
  if (!nama_pelanggan || !kategori_kode || !channel) {
    return { error: 'Semua field wajib diisi' }
  }
  
  if (channel === 'whatsapp' && pelanggan_lid) {
    pelanggan_lid = pelanggan_lid.includes('@s.whatsapp.net') 
      ? pelanggan_lid 
      : `${pelanggan_lid}@s.whatsapp.net`
  } else {
    pelanggan_lid = null
  }

  const { error } = await supabase
    .from('eskalasi')
    .insert({
      pelanggan_lid,
      nama_pelanggan,
      kategori_kode,
      detail,
      channel,
      status: pegawai ? 'ON_PROCESS' : 'OPEN',
      pegawai_id: pegawai ? pegawai.id : null,
      created_at: created_at ? new Date(created_at).toISOString() : undefined
    })
    
  if (error) return { error: error.message }
  
  revalidatePath('/eskalasi')
  return { success: true }
}

export async function updateEskalasiDetail(id: string, data: {
  nama_pelanggan: string
  kategori_kode: string
  channel: string
  detail: string
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('eskalasi')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/eskalasi')
  return { success: true }
}
