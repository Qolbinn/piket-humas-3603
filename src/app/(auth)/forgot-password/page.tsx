'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { forgotPasswordAction } from '@/lib/actions/auth'
import { Loader2, ArrowLeft, Mail, AlertCircle, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const { register, handleSubmit } = useForm<{ email: string }>()

  function onSubmit(data: { email: string }) {
    setErrorMsg(null)
    setSuccessMsg(null)
    
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', data.email.trim())
      const result = await forgotPasswordAction(formData)
      if (result?.error) setErrorMsg(result.error)
      if (result?.success) setSuccessMsg(result.success)
    })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-background font-sans">
      
      {/* Left Column: Branding Showcase */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative bg-gradient-to-br from-[#035b87] via-[#0595d7] to-[#023b59] text-white p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
            <Image src="/logo-bps.svg" alt="Logo BPS" width={36} height={36} className="h-9 w-9 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">SIPASTI</span>
              <span className="text-[10px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">BPS 3603</span>
            </div>
            <p className="text-xs text-blue-100 font-medium">BPS Kabupaten Tangerang</p>
          </div>
        </div>

        {/* Hero Middle Highlight */}
        <div className="relative z-10 max-w-xl my-auto py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold mb-6 backdrop-blur-md text-blue-100">
            <KeyRound className="h-4 w-4 text-amber-300" />
            Pemulihan Akses Akun
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Lupa Password <br />
            <span className="text-secondary">Akun Petugas?</span>
          </h1>

          <p className="text-blue-100 text-base leading-relaxed mb-8">
            Jangan khawatir. Masukkan email dinas BPS Anda yang terdaftar, dan sistem kami akan mengirimkan instruksi pemulihan kata sandi secara aman.
          </p>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-sm text-blue-100 leading-relaxed">
            <p className="font-semibold text-white mb-1">📌 Catatan Keamanan:</p>
            <p>Pastikan Anda memeriksa folder Inbox maupun Spam di email resmi Anda setelah mengirimkan permintaan reset password.</p>
          </div>
        </div>

        {/* Footer info at bottom left */}
        <div className="relative z-10 text-xs text-blue-200/80 flex items-center justify-between border-t border-white/10 pt-4">
          <p>&copy; {new Date().getFullYear()} BPS Kabupaten Tangerang</p>
          <p className="font-mono text-[11px]">v1.0.0 • Supabase Auth</p>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 md:p-12 bg-background relative overflow-y-auto">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Login</span>
          </Link>

          <div className="lg:hidden flex items-center gap-2">
            <Image src="/logo-bps.svg" alt="Logo" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="font-bold text-primary text-sm">SIPASTI</span>
          </div>
        </div>

        {/* Form Box */}
        <div className="w-full max-w-md mx-auto my-auto py-6">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Reset Password</h2>
            <p className="text-sm text-muted-foreground">
              Masukkan alamat email Anda untuk menerima tautan pemulihan password akun.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errorMsg && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">{errorMsg}</span>
              </div>
            )}
            
            {successMsg && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3 flex items-start gap-3 animate-in fade-in duration-200">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium leading-snug">{successMsg}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-sm">Email Terdaftar</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@bps.go.id"
                  className="h-12 pl-10 bg-muted/40 focus:bg-background transition-all border-border/80 rounded-xl"
                  {...register('email', { required: true })}
                  disabled={isPending || !!successMsg}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending || !!successMsg}
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-xl mt-2"
            >
              {isPending ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengirim Tautan...</>
              ) : (
                'Kirim Tautan Reset'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          <p>Badan Pusat Statistik Kabupaten Tangerang &bull; SIPASTI</p>
        </div>

      </div>

    </div>
  )
}
