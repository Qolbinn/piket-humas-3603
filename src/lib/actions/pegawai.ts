'use server'

// ============================================================
// Server Actions — Pegawai
// CRUD untuk tabel pegawai (admin only)
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { createPegawaiSchema, updatePegawaiSchema } from '@/lib/validations/pegawai'
import type { Pegawai } from '@/lib/types/database'

// ---- HELPER: Cek role admin ----
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { data: pegawai } = await supabase
    .from('pegawai')
    .select('role')
    .eq('id', user.id)
    .single() as { data: Pick<Pegawai, 'role'> | null, error: unknown }

  if (pegawai?.role !== 'admin') {
    return { error: 'Akses ditolak. Hanya admin yang dapat melakukan tindakan ini.' }
  }

  return { supabase, userId: user.id }
}

// ---- GET ALL PEGAWAI ----
export async function getPegawai() {
  const supabase = await createClient()

  const { data, error } = (await supabase
    .from('pegawai')
    .select('*')
    .order('name', { ascending: true })) as any

  if (error) throw new Error(error.message)
  return data
}

// ---- GET PEGAWAI BY ID ----
export async function getPegawaiById(id: string) {
  const supabase = await createClient()

  const { data, error } = (await supabase
    .from('pegawai')
    .select('*')
    .eq('id', id)
    .single()) as any

  if (error) return null
  return data
}

// ---- CREATE PEGAWAI (admin only) ----
export async function createPegawai(formData: FormData) {
  const adminCheck = await requireAdmin()
  if ('error' in adminCheck) return adminCheck

  const raw = {
    name:     formData.get('name') as string,
    username: formData.get('username') as string,
    email:    formData.get('email') as string,
    phone:    formData.get('phone') as string,
    lid_wa:   formData.get('lid_wa') as string,
    password: formData.get('password') as string,
    gender:   formData.get('gender') as 'L' | 'P',
    role:     (formData.get('role') as string) || 'petugas',
  }

  const parsed = createPegawaiSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Input tidak valid.'
    return { error: firstError }
  }

  const { name, username, email, phone, lid_wa, password, gender, role } = parsed.data
  const { supabase } = adminCheck
  const adminClient = createAdminClient()

  if (role === 'pimpinan') {
    // Demote current pimpinan to petugas
    await adminClient.from('pegawai').update({ role: 'petugas' }).eq('role', 'pimpinan')
  }

  // 1. Buat auth user via admin API (butuh service role key)
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return { error: authError?.message ?? 'Gagal membuat akun.' }
  }

  // 2. Insert profile pegawai
  const { error: profileError } = (await supabase
    .from('pegawai')
    .insert({
      id: authData.user.id,
      name,
      username,
      email,
      phone,
      lid_wa,
      gender,
      role,
    } as any)) as any

  if (profileError) {
    // Rollback: hapus auth user jika profile gagal
    await adminClient.auth.admin.deleteUser(authData.user.id)
    return { error: profileError.message }
  }

  revalidatePath('/pegawai')
  return { success: true }
}

// ---- UPDATE PEGAWAI (admin only) ----
export async function updatePegawai(id: string, formData: FormData) {
  const adminCheck = await requireAdmin()
  if ('error' in adminCheck) return adminCheck

  const raw = {
    name:     formData.get('name') as string,
    username: formData.get('username') as string,
    phone:    formData.get('phone') as string,
    lid_wa:   formData.get('lid_wa') as string,
    gender:   formData.get('gender') as 'L' | 'P',
    role:     formData.get('role') as 'admin' | 'pimpinan' | 'petugas',
  }

  const parsed = updatePegawaiSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Input tidak valid.'
    return { error: firstError }
  }

  const { name, username, phone, lid_wa, gender, role } = parsed.data
  const { supabase, userId } = adminCheck
  const adminClient = createAdminClient()

  // Anti self-demotion
  if (userId === id && role !== 'admin') {
    return { error: 'Anda tidak dapat menghilangkan akses admin dari akun Anda sendiri.' }
  }

  // Handle pimpinan swap
  if (role === 'pimpinan') {
    // Jika user ini BUKAN pimpinan sebelumnya, demote pimpinan lain
    await adminClient
      .from('pegawai')
      .update({ role: 'petugas' })
      .eq('role', 'pimpinan')
      .neq('id', id) // jangan ubah diri sendiri jika memang sudah pimpinan
  }

  const { error } = (await supabase
    .from('pegawai')
    .update({ name, username, phone, lid_wa, gender, role } as any)
    .eq('id', id)) as any

  if (error) return { error: error.message }

  revalidatePath('/pegawai')
  return { success: true }
}

// ---- DELETE PEGAWAI (admin only) ----
export async function deletePegawai(id: string) {
  const adminCheck = await requireAdmin()
  if ('error' in adminCheck) return adminCheck

  const { userId } = adminCheck

  if (userId === id) {
    return { error: 'Anda tidak dapat menghapus akun Anda sendiri.' }
  }

  const adminClient = createAdminClient()

  // Hapus auth user → cascade ke tabel pegawai via FK
  const { error } = await adminClient.auth.admin.deleteUser(id)
  if (error) return { error: error.message }

  revalidatePath('/pegawai')
  return { success: true }
}
