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
import { forgotPasswordAction } from '@/lib/actions/auth'
import { Loader2 } from 'lucide-react'

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
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
        <div className="bg-white p-2 rounded-xl shadow-sm border">
          <Image src="/logo-bps.svg" alt="Logo" width={40} height={40} className="h-10 w-auto" style={{ width: "auto" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-primary leading-none">Humas</span>
          <span className="text-sm font-medium text-muted-foreground">Badan Pusat Statistik</span>
        </div>
      </Link>

      <Card className="w-full max-w-md border-muted/50 shadow-xl shadow-primary/5 backdrop-blur-sm bg-background/95">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">Lupa Password</CardTitle>
          <CardDescription className="text-base">
            Masukkan email Anda. Kami akan mengirimkan tautan untuk mengatur ulang password.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            {errorMsg && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3">
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm px-4 py-3">
                {successMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">Email Terdaftar</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@bps.go.id"
                className="h-11 bg-muted/50 focus:bg-background transition-colors"
                {...register('email', { required: true })}
                disabled={isPending}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-5 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 text-base font-medium shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</>
              ) : (
                'Kirim Tautan Reset'
              )}
            </Button>
            <div className="text-center text-sm">
              <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                Kembali ke halaman Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
