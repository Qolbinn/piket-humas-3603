'use server'

// ============================================================
// Server Actions — Auth
// Login, logout, forgot password
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { Pegawai } from '@/lib/types/database'

import { createAdminClient } from '@/lib/supabase/admin'

export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const identifier = formData.get('email') as string
  const password = formData.get('password') as string

  if (!identifier || !password) {
    return { error: 'Username/Email dan password wajib diisi.' }
  }

  let loginEmail = identifier

  if (!identifier.includes('@')) {
    const adminSupabase = createAdminClient()
    const { data: pegawai, error: fetchError } = await adminSupabase
      .from('pegawai')
      .select('email')
      .eq('username', identifier)
      .single()
      
    if (fetchError || !pegawai?.email) {
      return { error: 'Username tidak ditemukan. Silakan coba lagi atau gunakan email.' }
    }
    loginEmail = pegawai.email
  }

  const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password })

  if (error) {
    return { error: 'Username/Email atau password salah. Silakan coba lagi.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// ---- LOGOUT ----
export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// ---- FORGOT PASSWORD ----
export async function forgotPasswordAction(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  // Use headers to dynamically get the origin, fallback to localhost for safety
  const { headers } = await import('next/headers')
  const headersList = await headers()
  const origin = headersList.get('origin') || 'http://localhost:3000'

  if (!email) {
    return { error: 'Email wajib diisi.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: 'Gagal mengirim email reset. Pastikan email terdaftar.' }
  }

  return { success: 'Link reset password sudah dikirim ke email Anda.' }
}

// ---- RESET PASSWORD (UPDATE USER) ----
export async function resetPasswordAction(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  if (!password || password.length < 6) {
    return { error: 'Password minimal 6 karakter.' }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: 'Gagal mengubah password. Sesi mungkin telah kadaluarsa.' }
  }

  return { success: 'Password berhasil diubah!' }
}

// ---- GET CURRENT USER PROFILE ----
export async function getCurrentPegawai() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null

  const { data: pegawai } = (await supabase
    .from('pegawai')
    .select('*')
    .eq('id', user.id)
    .single()) as any

  return pegawai as Pegawai | null
}

// ---- UPDATE PROFILE (self) ----
export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Sesi tidak ditemukan, silakan login ulang.' }

  const name  = formData.get('name') as string
  const phone = (formData.get('phone') as string) || null

  if (!name || name.length < 3) {
    return { error: 'Nama minimal 3 karakter.' }
  }

  const { error } = (await supabase
    .from('pegawai')
    .update({ name, phone } as any)
    .eq('id', user.id)) as any

  if (error) return { error: error.message }

  revalidatePath('/profile')
  revalidatePath('/', 'layout')
  return { success: true }
}

// ---- CHANGE PASSWORD (VERIFY OLD) ----
export async function changePasswordWithCurrentAction(formData: FormData) {
  const supabase = await createClient()
  const oldPassword = formData.get('oldPassword') as string
  const newPassword = formData.get('password') as string

  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return { error: 'Semua field wajib diisi dan password baru minimal 6 karakter.' }
  }

  // 1. Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user?.email) {
    return { error: 'Sesi tidak ditemukan, silakan login ulang.' }
  }

  // 2. Verify old password by attempting sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: oldPassword,
  })

  if (signInError) {
    return { error: 'Password lama salah.' }
  }

  // 3. Update password
  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
  if (updateError) {
    return { error: 'Gagal mengubah password.' }
  }

  return { success: 'Password berhasil diubah!' }
}
