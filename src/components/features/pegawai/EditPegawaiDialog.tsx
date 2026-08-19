'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2, Pencil } from 'lucide-react'
import * as z from 'zod'

type FormValues = z.infer<typeof updatePegawaiSchema>

interface EditPegawaiDialogProps {
  pegawai: Pegawai
}

export default function EditPegawaiDialog({ pegawai }: EditPegawaiDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(updatePegawaiSchema),
    defaultValues: {
      name: pegawai.name,
      username: pegawai.username,
      phone: pegawai.phone,
      lid_wa: pegawai.lid_wa,
      gender: pegawai.gender,
      role: pegawai.role,
    },
  })

  // Sync form when dialog opens
  React.useEffect(() => {
    if (open) {
      reset({
        name: pegawai.name,
        username: pegawai.username,
        phone: pegawai.phone,
        lid_wa: pegawai.lid_wa,
        gender: pegawai.gender,
        role: pegawai.role,
      })
    }
  }, [open, pegawai, reset])

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, String(value))
      })

      const result = await updatePegawai(pegawai.id, formData)
      if ('error' in result && result.error) {
        toast.error(result.error as string)
      } else {
        toast.success('Data pegawai berhasil diperbarui.')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Pegawai</DialogTitle>
          <DialogDescription>
            Perbarui data profil pegawai ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={pegawai.email} disabled className="rounded-xl bg-muted/50 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Email tidak dapat diubah dari sini.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Nama Lengkap</Label>
            <Input id="edit-name" placeholder="Masukkan nama lengkap" {...register('name')} className="rounded-xl" />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-username">Username</Label>
            <Input id="edit-username" placeholder="Contoh: budi.santoso" {...register('username')} className="rounded-xl" />
            {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-phone">Nomor Telepon / WhatsApp</Label>
            <Input id="edit-phone" type="tel" placeholder="Contoh: 08123456789" {...register('phone')} className="rounded-xl" />
            {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-lid-wa">Nomor LID WA</Label>
            <Input id="edit-lid-wa" placeholder="Contoh: 628123456789@c.us" {...register('lid_wa')} className="rounded-xl" />
            {errors.lid_wa && <p className="text-destructive text-xs">{errors.lid_wa.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-gender">Jenis Kelamin</Label>
              <Select defaultValue={pegawai.gender} onValueChange={(v) => setValue('gender', v as 'L' | 'P')}>
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
              <Select defaultValue={pegawai.role} onValueChange={(v) => setValue('role', v as any)}>
                <SelectTrigger id="edit-role" className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petugas">Petugas</SelectItem>
                  <SelectItem value="pimpinan">Pimpinan</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" variant="outline" className="rounded-xl mr-2" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-xl">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
