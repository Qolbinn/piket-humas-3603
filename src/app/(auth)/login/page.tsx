'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { loginAction } from '@/lib/actions/auth'
import { Loader2, Eye, EyeOff, ArrowLeft, User, Lock, AlertCircle, ShieldCheck, Zap, Calendar } from 'lucide-react'

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit } = useForm<{ email: string; password: string }>()

  function onSubmit(data: { email: string; password: string }) {
    setErrorMsg(null)
    
    const finalIdentifier = data.email.trim()

    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', finalIdentifier)
      formData.append('password', data.password)
      const result = await loginAction(formData)
      if (result?.error) setErrorMsg(result.error)
    })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-background font-sans">
      
      {/* Left Column: Branding Showcase (Hidden on Mobile, Visible on LG screens) */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative bg-gradient-to-br from-[#035b87] via-[#0595d7] to-[#023b59] text-white p-12 flex-col justify-between overflow-hidden">
        {/* Background decorative patterns */}
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

        {/* Hero Middle Feature Highlight */}
        <div className="relative z-10 max-w-xl my-auto py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold mb-6 backdrop-blur-md text-blue-100">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Portal Khusus Petugas & Pengelola
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Pusat Manajemen <br />
            <span className="text-secondary">Layanan Humas & Eskalasi</span>
          </h1>

          <p className="text-blue-100 text-base leading-relaxed mb-8">
            Satu pintu untuk memantau pesan masuk masyarakat, merespons tiket eskalasi WhatsApp, dan mengelola jadwal piket petugas BPS Kabupaten Tangerang.
          </p>

          <div className="space-y-4 pt-4 border-t border-white/15">
            <div className="flex items-center gap-3 text-sm text-blue-50 font-medium">
              <div className="p-2 rounded-lg bg-white/10 border border-white/15">
                <Zap className="h-4 w-4 text-amber-300" />
              </div>
              <span>Notifikasi Realtime Tiket Eskalasi Pelanggan</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-50 font-medium">
              <div className="p-2 rounded-lg bg-white/10 border border-white/15">
                <Calendar className="h-4 w-4 text-emerald-300" />
              </div>
              <span>Manajemen Jadwal Piket & Kehadiran Operator</span>
            </div>
          </div>
        </div>

        {/* Footer info at bottom left */}
        <div className="relative z-10 text-xs text-blue-200/80 flex items-center justify-between border-t border-white/10 pt-4">
          <p>&copy; {new Date().getFullYear()} BPS Kabupaten Tangerang</p>
          <p className="font-mono text-[11px]">v1.0.0 • Supabase Connected</p>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 md:p-12 bg-background relative overflow-y-auto">
        
        {/* Top Header Controls */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Beranda</span>
          </Link>

          {/* Mobile Logo Display */}
          <div className="lg:hidden flex items-center gap-2">
            <Image src="/logo-bps.svg" alt="Logo" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="font-bold text-primary text-sm">SIPASTI</span>
          </div>
        </div>

        {/* Main Login Form Box */}
        <div className="w-full max-w-md mx-auto my-auto py-6">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Login Petugas</h2>
            <p className="text-sm text-muted-foreground">
              Masukkan username (atau email) dan password resmi Anda untuk mengelola dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Error Notification Alert */}
            {errorMsg && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* Username / Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-sm">Username / Email</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="text"
                  placeholder="Username atau nama@bps.go.id"
                  className="h-12 pl-10 bg-muted/40 focus:bg-background transition-all border-border/80 rounded-xl"
                  {...register('email', { required: true })}
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold text-sm">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 pl-10 pr-10 bg-muted/40 focus:bg-background transition-all border-border/80 rounded-xl"
                  {...register('password', { required: true })}
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              id="login-submit"
              disabled={isPending}
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-xl mt-2"
            >
              {isPending ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memverifikasi...</>
              ) : (
                'Masuk Dashboard'
              )}
            </Button>
          </form>
        </div>

        {/* Footer Copyright on Right Side */}
        <div className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          <p>Badan Pusat Statistik Kabupaten Tangerang &bull; SIPASTI</p>
        </div>

      </div>

    </div>
  )
}
