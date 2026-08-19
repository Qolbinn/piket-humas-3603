'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { kategoriLayananSchema } from '@/lib/validations/layanan'
import { createKategoriLayanan } from '@/lib/actions/layanan'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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

type FormValues = z.infer<typeof kategoriLayananSchema>

export default function CreateLayananDialog() {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(kategoriLayananSchema),
    defaultValues: { is_active: true },
  })

  const isActive = watch('is_active')

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('kode', data.kode)
      formData.append('nama', data.nama)
      formData.append('is_active', String(data.is_active))

      const result = await createKategoriLayanan(formData)
      if (result && 'error' in result && result.error) {
        toast.error(result.error as string)
      } else {
        toast.success('Kategori layanan berhasil ditambahkan.')
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
          Tambah Kategori
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Tambah Kategori Layanan</DialogTitle>
          <DialogDescription>
            Buat kategori baru untuk mengelompokkan pesan dan eskalasi pelanggan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="kode">Kode Kategori</Label>
            <Input id="kode" placeholder="Contoh: 1" {...register('kode')} className="rounded-xl" />
            {errors.kode && <p className="text-destructive text-xs">{errors.kode.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nama">Nama Kategori</Label>
            <Input id="nama" placeholder="Contoh: Info Harga" {...register('nama')} className="rounded-xl" />
            {errors.nama && <p className="text-destructive text-xs">{errors.nama.message}</p>}
          </div>

          <div className="flex flex-row items-center justify-between rounded-xl border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Status Aktif</Label>
              <p className="text-sm text-muted-foreground">
                Kategori yang aktif dapat dipilih oleh pengguna.
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
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
