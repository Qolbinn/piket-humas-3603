'use server'

// ============================================================
// Server Actions — Template
// CRUD untuk tabel template dan template_detail
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { templateSchema } from '@/lib/validations/template'
import type { Database } from '@/lib/types/database'

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

  return { supabase, userId: user.id }
}

// ---- GET ALL TEMPLATES ----
export async function getTemplates() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('template_piket')
    .select(`
      *,
      template_piket_detail (
        day_of_week,
        pegawai (id, name, gender)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// ---- GET TEMPLATE BY ID ----
export async function getTemplateById(id: string) {
  const supabase = await createClient()

  const { data, error } = (await supabase
    .from('template_piket')
    .select(`
      *,
      template_piket_detail (
        day_of_week,
        pegawai_id
      )
    `)
    .eq('id', id)
    .single()) as any

  if (error) throw new Error(error.message)
  return data
}

// ---- CREATE TEMPLATE ----
export async function createTemplate(data: any) {
  const { supabase } = await requireAdmin()
  
  const validated = templateSchema.parse(data)

  // 1. Insert Template
  const { data: newTemplate, error: tError } = (await supabase
    .from('template_piket')
    .insert({ name: validated.name })
    .select()
    .single()) as any

  if (tError) throw new Error(tError.message)

  // 2. Insert Details
  const details = validated.details.map(d => ({
    template_id: newTemplate.id,
    day_of_week: d.day_of_week,
    pegawai_id: d.pegawai_id
  }))

  const { error: dError } = await supabase
    .from('template_piket_detail')
    .insert(details as any)

  if (dError) {
    // Cleanup if detail fails
    await supabase.from('template_piket').delete().eq('id', newTemplate.id)
    throw new Error(dError.message)
  }

  revalidatePath('/piket')
  return { success: true, id: newTemplate.id }
}

// ---- UPDATE TEMPLATE ----
export async function updateTemplate(id: string, data: any) {
  const { supabase } = await requireAdmin()
  
  const validated = templateSchema.parse(data)

  // 1. Update Name
  const { error: tError } = await supabase
    .from('template_piket')
    .update({ name: validated.name })
    .eq('id', id)

  if (tError) throw new Error(tError.message)

  // 2. Refresh Details (Delete then Re-insert)
  await supabase.from('template_piket_detail').delete().eq('template_id', id)

  const details = validated.details.map(d => ({
    template_id: id,
    day_of_week: d.day_of_week,
    pegawai_id: d.pegawai_id
  }))

  const { error: dError } = await supabase
    .from('template_piket_detail')
    .insert(details as any)

  if (dError) throw new Error(dError.message)

  revalidatePath('/piket')
  return { success: true }
}

// ---- DELETE TEMPLATE ----
export async function deleteTemplate(id: string) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase
    .from('template_piket')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/piket')
  return { success: true }
}
