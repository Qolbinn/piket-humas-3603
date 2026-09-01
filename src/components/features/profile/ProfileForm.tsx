'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateProfileSchema } from '@/lib/validations/pegawai'
import { updateProfileAction } from '@/lib/actions/auth'
import { type Pegawai } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Lock, Mail, AtSign } from 'lucide-react'

type FormValues = z.infer<typeof updateProfileSchema>

interface ProfileFormProps {
  pegawai: Pegawai
}

export default function ProfileForm({ pegawai }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name:  pegawai.name,
      phone: pegawai.phone ?? undefined,
    },
  })

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.phone) formData.append('phone', data.phone)

      const result = await updateProfileAction(formData)
      if ('error' in result && result.error) {
        toast.error(result.error)
      } else {
        toast.success('Profil berhasil diperbarui.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Read-only fields */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            value={pegawai.email}
            disabled
            className="pl-10 rounded-xl bg-muted/40 text-muted-foreground border-border/60 font-medium text-xs h-10"
          />
          <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground">Username</Label>
        <div className="relative">
          <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            value={pegawai.username}
            disabled
            className="pl-10 rounded-xl bg-muted/40 text-muted-foreground border-border/60 font-mono text-xs h-10"
          />
          <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
        </div>
      </div>

      <div className="border-t border-border/60 pt-4 space-y-4">
        {/* Editable fields */}
        <div className="space-y-1.5">
          <Label htmlFor="profile-name" className="text-xs font-bold text-foreground">Nama Lengkap</Label>
          <Input
            id="profile-name"
            placeholder="Masukkan nama lengkap"
            {...register('name')}
            className="rounded-xl h-10 border-border/80 text-sm shadow-2xs"
            disabled={isPending}
          />
          {errors.name && <p className="text-destructive text-xs font-medium">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-phone" className="text-xs font-bold text-foreground">
            Nomor Telepon / WhatsApp{' '}
            <span className="text-muted-foreground font-normal">(opsional)</span>
          </Label>
          <Input
            id="profile-phone"
            type="tel"
            placeholder="Contoh: 08123456789"
            {...register('phone')}
            className="rounded-xl h-10 border-border/80 text-sm shadow-2xs font-mono"
            disabled={isPending}
          />
          {errors.phone && <p className="text-destructive text-xs font-medium">{errors.phone.message}</p>}
        </div>
      </div>

      <Button
        type="submit"
        id="save-profile"
        disabled={isPending || !isDirty}
        className="w-full rounded-xl h-10 font-bold shadow-xs mt-2"
      >
        {isPending ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
        ) : (
          'Simpan Perubahan'
        )}
      </Button>
    </form>
  )
}
