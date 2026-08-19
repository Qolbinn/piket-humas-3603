'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { kategoriLayananSchema } from '@/lib/validations/layanan'
import { updateKategoriLayanan } from '@/lib/actions/layanan'
import { type KategoriLayanan } from '@/lib/types/database'
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
import { Loader2, Pencil } from 'lucide-react'
import * as z from 'zod'

type FormValues = z.infer<typeof kategoriLayananSchema>

interface EditLayananDialogProps {
  layanan: KategoriLayanan
}

export default function EditLayananDialog({ layanan }: EditLayananDialogProps) {
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
    defaultValues: {
      kode: layanan.kode,
      nama: layanan.nama,
      is_active: layanan.is_active,
    },
  })

  React.useEffect(() => {
    if (open) {
      reset({
        kode: layanan.kode,
        nama: layanan.nama,
        is_active: layanan.is_active,
      })
    }
  }, [open, layanan, reset])

  const isActive = watch('is_active')

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('kode', data.kode)
      formData.append('nama', data.nama)
      formData.append('is_active', String(data.is_active))

      const result = await updateKategoriLayanan(layanan.id, formData)
      if ('error' in result && result.error) {
        toast.error(result.error as string)
      } else {
        toast.success('Kategori layanan berhasil diperbarui.')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Kategori Layanan</DialogTitle>
          <DialogDescription>
            Perbarui nama atau status aktif dari kategori ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor={`edit-kode-${layanan.id}`}>Kode Kategori</Label>
            <Input id={`edit-kode-${layanan.id}`} placeholder="Contoh: 1" {...register('kode')} className="rounded-xl" />
            {errors.kode && <p className="text-destructive text-xs">{errors.kode.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`edit-nama-${layanan.id}`}>Nama Kategori</Label>
            <Input id={`edit-nama-${layanan.id}`} placeholder="Contoh: Info Harga" {...register('nama')} className="rounded-xl" />
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
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
