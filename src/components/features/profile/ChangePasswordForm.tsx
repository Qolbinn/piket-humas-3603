'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { changePasswordWithCurrentAction } from '@/lib/actions/auth'
import { toast } from 'sonner'
import { KeyRound, Loader2, Check, ShieldAlert } from 'lucide-react'

export default function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const isMinLength = newPassword.length >= 6
  const isMatching = newPassword !== '' && newPassword === confirmPassword

  async function handleSubmit(formData: FormData) {
    const password = formData.get('password') as string
    const confirm = formData.get('confirmPassword') as string

    if (!password || password.length < 6) {
      toast.error('Password baru minimal 6 karakter.')
      return
    }

    if (password !== confirm) {
      toast.error('Konfirmasi password tidak cocok.')
      return
    }

    setIsLoading(true)
    const result = await changePasswordWithCurrentAction(formData)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
      setNewPassword('')
      setConfirmPassword('')
      const form = document.getElementById('change-password-form') as HTMLFormElement
      if (form) form.reset()
    }
  }

  return (
    <form id="change-password-form" action={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="oldPassword" className="text-xs font-bold text-foreground">Password Saat Ini</Label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            id="oldPassword"
            name="oldPassword"
            type="password"
            placeholder="Ketik password lama Anda"
            className="pl-10 rounded-xl h-10 border-border/80 text-sm shadow-2xs"
            required
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs font-bold text-foreground">Password Baru</Label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            id="password"
            name="password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="pl-10 rounded-xl h-10 border-border/80 text-sm shadow-2xs"
            required
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-xs font-bold text-foreground">Konfirmasi Password Baru</Label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ketik ulang password baru"
            className="pl-10 rounded-xl h-10 border-border/80 text-sm shadow-2xs"
            required
          />
        </div>
      </div>

      {/* Password Security Checklist */}
      {newPassword.length > 0 && (
        <div className="bg-muted/40 p-3 rounded-xl border border-border/60 space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
              isMinLength ? 'bg-emerald-500 text-white' : 'bg-muted-foreground/30 text-muted-foreground'
            }`}>
              {isMinLength ? <Check className="h-2.5 w-2.5" /> : '•'}
            </div>
            <span className={isMinLength ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-muted-foreground'}>
              Minimal 6 karakter
            </span>
          </div>

          {confirmPassword.length > 0 && (
            <div className="flex items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                isMatching ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {isMatching ? <Check className="h-2.5 w-2.5" /> : '!'}
              </div>
              <span className={isMatching ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-red-500 font-bold'}>
                {isMatching ? 'Konfirmasi password cocok' : 'Password tidak cocok'}
              </span>
            </div>
          )}
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full rounded-xl h-10 font-bold shadow-xs mt-2">
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
        ) : (
          'Ubah Password'
        )}
      </Button>
    </form>
  )
}
