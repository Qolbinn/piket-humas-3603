'use server'

// ============================================================
// Server Actions — Auth
// Login, logout, forgot password
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// ---- LOGIN ----
export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Email atau password salah. Silakan coba lagi.' }
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

  if (!email) {
    return { error: 'Email wajib diisi.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: 'Gagal mengirim email reset. Pastikan email terdaftar.' }
  }

  return { success: 'Link reset password sudah dikirim ke email Anda.' }
}

// ---- GET CURRENT USER PROFILE ----
export async function getCurrentPegawai() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null

  const { data: pegawai } = await supabase
    .from('pegawai')
    .select('*')
    .eq('id', user.id)
    .single()

  return pegawai
}
