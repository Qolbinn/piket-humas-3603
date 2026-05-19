'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updatePegawaiSchema } from '@/lib/validations/pegawai'
import { updatePegawai } from '@/lib/actions/pegawai'
import { type Pegawai } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

type FormValues = z.infer<typeof updatePegawaiSchema>

interface EditPegawaiFormProps {
  pegawai: Pegawai
}

export default function EditPegawaiForm({ pegawai }: EditPegawaiFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(updatePegawaiSchema),
    defaultValues: {
      name:     pegawai.name,
      username: pegawai.username,
      phone:    pegawai.phone ?? undefined,
      gender:   pegawai.gender,
      role:     pegawai.role,
    },
  })

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, String(value))
      })

      const result = await updatePegawai(pegawai.id, formData)
      if ('error' in result && result.error) {
        toast.error(result.error)
      } else {
        toast.success('Data pegawai berhasil diperbarui.')
        router.push('/pegawai')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Info email (read-only) */}
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input
          value={pegawai.email}
          disabled
          className="rounded-xl bg-muted/50 text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">Email tidak dapat diubah dari sini.</p>
      </div>

      {/* Nama */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-name">Nama Lengkap</Label>
        <Input
          id="edit-name"
          placeholder="Masukkan nama lengkap"
          {...register('name')}
          className="rounded-xl"
        />
        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-username">Username</Label>
        <Input
          id="edit-username"
          placeholder="Contoh: budi.santoso"
          {...register('username')}
          className="rounded-xl"
        />
        {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-phone">
          Nomor Telepon <span className="text-muted-foreground font-normal">(opsional)</span>
        </Label>
        <Input
          id="edit-phone"
          type="tel"
          placeholder="Contoh: 08123456789"
          {...register('phone')}
          className="rounded-xl"
        />
        {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
      </div>

      {/* Gender & Role */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="edit-gender">Jenis Kelamin</Label>
          <Select
            defaultValue={pegawai.gender}
            onValueChange={(v) => setValue('gender', v as 'L' | 'P')}
          >
            <SelectTrigger id="edit-gender" className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-destructive text-xs">{errors.gender.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-role">Role</Label>
          <Select
            defaultValue={pegawai.role}
            onValueChange={(v) => setValue('role', v as 'admin' | 'petugas')}
          >
            <SelectTrigger id="edit-role" className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petugas">Petugas</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button asChild variant="outline" className="flex-1 rounded-xl">
          <Link href="/pegawai">Batal</Link>
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-xl"
          id="submit-edit-pegawai"
        >
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
          ) : (
            'Simpan Perubahan'
          )}
        </Button>
      </div>
    </form>
  )
}
