'use server'

// ============================================================
// Server Actions — Pegawai
// CRUD untuk tabel pegawai
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ---- GET ALL PEGAWAI ----
export async function getPegawai() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pegawai')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

// ---- CREATE PEGAWAI ----
// Membuat auth user sekaligus profile pegawai
export async function createPegawai(formData: FormData) {
  const supabase = await createClient()

  const name     = formData.get('name') as string
  const username = formData.get('username') as string
  const email    = formData.get('email') as string
  const password = formData.get('password') as string
  const gender   = formData.get('gender') as 'L' | 'P'
  const role     = (formData.get('role') as string) || 'petugas'

  // 1. Buat auth user dulu (inviteByEmail lebih aman dari createUser di client)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return { error: authError?.message ?? 'Gagal membuat akun.' }
  }

  // 2. Insert profile pegawai dengan id dari auth user
  const { error: profileError } = await supabase
    .from('pegawai')
    .insert({ id: authData.user.id, name, username, email, gender, role })

  if (profileError) {
    // Rollback: hapus auth user jika insert profile gagal
    await supabase.auth.admin.deleteUser(authData.user.id)
    return { error: profileError.message }
  }

  revalidatePath('/pegawai')
  return { success: true }
}

// ---- UPDATE PEGAWAI ----
export async function updatePegawai(id: string, formData: FormData) {
  const supabase = await createClient()

  const updates = {
    name:       formData.get('name') as string,
    username:   formData.get('username') as string,
    gender:     formData.get('gender') as 'L' | 'P',
    role:       formData.get('role') as string,
    avatar_url: formData.get('avatar_url') as string | null,
  }

  const { error } = await supabase
    .from('pegawai')
    .update(updates)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/pegawai')
  return { success: true }
}

// ---- DELETE PEGAWAI ----
export async function deletePegawai(id: string) {
  const supabase = await createClient()

  // Hapus auth user (cascade ke tabel pegawai via FK)
  const { error } = await supabase.auth.admin.deleteUser(id)
  if (error) return { error: error.message }

  revalidatePath('/pegawai')
  return { success: true }
}
