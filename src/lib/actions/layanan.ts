'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentPegawai } from '@/lib/actions/auth'
import { kategoriLayananSchema } from '@/lib/validations/layanan'

async function requireAdmin() {
  const pegawai = await getCurrentPegawai()
  if (!pegawai || pegawai.role !== 'admin') {
    return { error: 'Akses ditolak. Hanya admin yang diizinkan.' }
  }
  return { success: true }
}

export async function getKategoriLayanan() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('kategori_layanan')
    .select('*')
    .order('nama', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function createKategoriLayanan(formData: FormData) {
  const adminCheck = await requireAdmin()
  if (adminCheck.error) return adminCheck

  const raw = {
    kode: formData.get('kode') as string,
    nama: formData.get('nama') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const parsed = kategoriLayananSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Input tidak valid.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('kategori_layanan')
    .insert({
      kode: parsed.data.kode,
      nama: parsed.data.nama,
      is_active: parsed.data.is_active,
    })

  if (error) return { error: error.message }

  revalidatePath('/master/layanan')
  return { success: true }
}

export async function updateKategoriLayanan(id: string, formData: FormData) {
  const adminCheck = await requireAdmin()
  if (adminCheck.error) return adminCheck

  const raw = {
    kode: formData.get('kode') as string,
    nama: formData.get('nama') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const parsed = kategoriLayananSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Input tidak valid.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('kategori_layanan')
    .update({
      kode: parsed.data.kode,
      nama: parsed.data.nama,
      is_active: parsed.data.is_active,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/master/layanan')
  return { success: true }
}

export async function deleteKategoriLayanan(id: string) {
  const adminCheck = await requireAdmin()
  if (adminCheck.error) return adminCheck

  const supabase = await createClient()
  const { error } = await supabase
    .from('kategori_layanan')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/master/layanan')
  return { success: true }
}
