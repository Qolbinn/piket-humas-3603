'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { changePasswordWithCurrentAction } from '@/lib/actions/auth'
import { toast } from 'sonner'
import { KeyRound, Loader2 } from 'lucide-react'

export default function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || password.length < 6) {
      toast.error('Password baru minimal 6 karakter.')
      return
    }

    if (password !== confirmPassword) {
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
      // Clear form
      const form = document.getElementById('change-password-form') as HTMLFormElement
      if (form) form.reset()
    }
  }

  return (
    <form id="change-password-form" action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="oldPassword">Password Saat Ini</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="oldPassword"
            name="oldPassword"
            type="password"
            placeholder="Ketik password lama Anda"
            className="pl-9"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password Baru</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Minimal 6 karakter"
            className="pl-9"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Ketik ulang password baru"
            className="pl-9"
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full rounded-xl">
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
        ) : (
          'Ubah Password'
        )}
      </Button>
    </form>
  )
}
