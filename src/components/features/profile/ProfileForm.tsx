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
import { Loader2 } from 'lucide-react'

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Read-only fields */}
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input
          value={pegawai.email}
          disabled
          className="rounded-xl bg-muted/50 text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
      </div>

      <div className="space-y-1.5">
        <Label>Username</Label>
        <Input
          value={pegawai.username}
          disabled
          className="rounded-xl bg-muted/50 text-muted-foreground"
        />
      </div>

      <div className="border-t pt-5 space-y-5">
        {/* Editable fields */}
        <div className="space-y-1.5">
          <Label htmlFor="profile-name">Nama Lengkap</Label>
          <Input
            id="profile-name"
            placeholder="Masukkan nama lengkap"
            {...register('name')}
            className="rounded-xl"
            disabled={isPending}
          />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-phone">
            Nomor Telepon{' '}
            <span className="text-muted-foreground font-normal">(opsional)</span>
          </Label>
          <Input
            id="profile-phone"
            type="tel"
            placeholder="Contoh: 08123456789"
            {...register('phone')}
            className="rounded-xl"
            disabled={isPending}
          />
          {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
        </div>
      </div>

      <Button
        type="submit"
        id="save-profile"
        disabled={isPending || !isDirty}
        className="w-full rounded-xl"
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
