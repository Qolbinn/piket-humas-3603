'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentPegawai } from '@/lib/actions/auth'
import { faqMenuSchema } from '@/lib/validations/faq'
import { FaqMenu } from '@/lib/types/database'

async function requireAdmin() {
  const pegawai = await getCurrentPegawai()
  if (!pegawai || pegawai.role !== 'admin') {
    return { error: 'Akses ditolak. Hanya admin yang diizinkan.' }
  }
  return { success: true }
}

export async function getFaqMenus(): Promise<FaqMenu[]> {
  const supabase = await createClient()

  // Sesuai permintaan, diurutkan berdasarkan abjad KODE ascending
  const { data, error } = await supabase
    .from('faq_menu')
    .select('*')
    .order('kode', { ascending: true })

  if (error) throw new Error(error.message)
  return data as FaqMenu[]
}

export async function createFaqMenu(formData: FormData) {
  const adminCheck = await requireAdmin()
  if (adminCheck.error) return adminCheck

  let parent_id = formData.get('parent_id') as string | null
  if (parent_id === 'root' || parent_id === '') parent_id = null

  const raw = {
    parent_id,
    kode: formData.get('kode') as string,
    title: formData.get('title') as string,
    is_menu: formData.get('is_menu') === 'true',
    content: formData.get('content') as string,
    urutan: 0,
    is_active: formData.get('is_active') === 'true',
  }

  const parsed = faqMenuSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Input tidak valid.' }
  }

  const supabase = await createClient()

  // Cek apakah kode sudah dipakai
  const { data: existingKode } = await supabase
    .from('faq_menu')
    .select('id')
    .eq('kode', parsed.data.kode)
    .limit(1)

  if (existingKode && existingKode.length > 0) {
    return { error: `Gagal: Kode FAQ "${parsed.data.kode}" sudah digunakan.` }
  }

  const { error } = await supabase
    .from('faq_menu')
    .insert({
      parent_id: parsed.data.parent_id,
      kode: parsed.data.kode,
      title: parsed.data.title,
      is_menu: parsed.data.is_menu,
      content: parsed.data.content,
      urutan: parsed.data.urutan,
      is_active: parsed.data.is_active,
    })

  if (error) return { error: error.message }

  revalidatePath('/master/faq')
  return { success: true }
}

export async function updateFaqMenu(id: string, formData: FormData) {
  const adminCheck = await requireAdmin()
  if (adminCheck.error) return adminCheck

  let parent_id = formData.get('parent_id') as string | null
  if (parent_id === 'root' || parent_id === '') parent_id = null

  const raw = {
    parent_id,
    kode: formData.get('kode') as string,
    title: formData.get('title') as string,
    is_menu: formData.get('is_menu') === 'true',
    content: formData.get('content') as string,
    urutan: 0,
    is_active: formData.get('is_active') === 'true',
  }

  const parsed = faqMenuSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Input tidak valid.' }
  }

  const supabase = await createClient()

  // Cek apakah kode sudah dipakai oleh FAQ lain
  const { data: existingKode } = await supabase
    .from('faq_menu')
    .select('id')
    .eq('kode', parsed.data.kode)
    .neq('id', id)
    .limit(1)

  if (existingKode && existingKode.length > 0) {
    return { error: `Gagal: Kode FAQ "${parsed.data.kode}" sudah digunakan oleh FAQ lain.` }
  }

  // Mencegah perubahan folder menjadi dokumen jika masih punya child
  if (!parsed.data.is_menu) {
    const { data: children, error: checkError } = await supabase
      .from('faq_menu')
      .select('id')
      .eq('parent_id', id)
      .limit(1)

    if (checkError) return { error: checkError.message }
    if (children && children.length > 0) {
      return { error: 'Gagal: Folder ini masih memiliki sub-menu. Pindahkan atau hapus sub-menu terlebih dahulu.' }
    }
  }

  const { error } = await supabase
    .from('faq_menu')
    .update({
      parent_id: parsed.data.parent_id,
      kode: parsed.data.kode,
      title: parsed.data.title,
      is_menu: parsed.data.is_menu,
      content: parsed.data.content,
      urutan: parsed.data.urutan,
      is_active: parsed.data.is_active,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/master/faq')
  return { success: true }
}

export async function deleteFaqMenu(id: string) {
  const adminCheck = await requireAdmin()
  if (adminCheck.error) return adminCheck

  const supabase = await createClient()
  const { error } = await supabase
    .from('faq_menu')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/master/faq')
  return { success: true }
}
