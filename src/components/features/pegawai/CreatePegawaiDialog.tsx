'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPegawaiSchema } from '@/lib/validations/pegawai'
import { createPegawai } from '@/lib/actions/pegawai'
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
import { Loader2, Plus } from 'lucide-react'
import * as z from 'zod'

type FormValues = z.infer<typeof createPegawaiSchema>

export default function CreatePegawaiDialog() {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createPegawaiSchema),
    defaultValues: { role: 'petugas' },
  })

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, String(value))
      })

      const result = await createPegawai(formData)
      if (result && 'error' in result && result.error) {
        toast.error(result.error as string)
      } else {
        toast.success('Pegawai berhasil ditambahkan.')
        reset()
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) reset() }}>
      <DialogTrigger asChild>
        <Button className="shadow-md rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pegawai
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Tambah Pegawai</DialogTitle>
          <DialogDescription>
            Buat akun dan profil pegawai baru di sini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" placeholder="Masukkan nama" {...register('name')} className="rounded-xl" />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Contoh: budi.s" {...register('username')} className="rounded-xl" />
            {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="nama@bps.go.id" {...register('email')} className="rounded-xl" />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Nomor Telepon / WhatsApp</Label>
            <Input id="phone" type="tel" placeholder="08123..." {...register('phone')} className="rounded-xl" />
            {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lid_wa">Nomor LID WA</Label>
            <Input id="lid_wa" placeholder="Contoh: 628123456789@c.us" {...register('lid_wa')} className="rounded-xl" />
            {errors.lid_wa && <p className="text-destructive text-xs">{errors.lid_wa.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Minimal 6 karakter" {...register('password')} className="rounded-xl" />
            {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select onValueChange={(v) => setValue('gender', v as 'L' | 'P')}>
                <SelectTrigger id="gender" className="rounded-xl">
                  <SelectValue placeholder="Pilih..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-destructive text-xs">{errors.gender.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="petugas" onValueChange={(v) => setValue('role', v as any)}>
                <SelectTrigger id="role" className="rounded-xl">
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
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
