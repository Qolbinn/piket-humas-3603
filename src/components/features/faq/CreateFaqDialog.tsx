'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { faqMenuSchema } from '@/lib/validations/faq'
import type { FaqMenu } from '@/lib/types/database'
import * as z from 'zod'
import { createFaqMenu } from '@/lib/actions/faq'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type FormValues = z.infer<typeof faqMenuSchema>

export default function CreateFaqDialog({ faqs }: { faqs: FaqMenu[] }) {
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
    resolver: zodResolver(faqMenuSchema),
    defaultValues: { 
      parent_id: 'root',
      is_menu: false,
      is_active: true,
      urutan: 0
    },
  })

  // Only allow items that are marked as 'is_menu' to be parents
  const menuOptions = faqs.filter(f => f.is_menu)

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const formData = new FormData()
      
      // If it's a menu, it must be root (no parent)
      if (!data.is_menu && data.parent_id && data.parent_id !== 'root') {
        formData.append('parent_id', data.parent_id)
      }
      
      formData.append('kode', data.kode)
      formData.append('title', data.title)
      formData.append('is_menu', String(data.is_menu))
      formData.append('content', data.content)
      formData.append('is_active', String(data.is_active))

      const result = await createFaqMenu(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('FAQ berhasil ditambahkan!')
        setOpen(false)
        reset()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl font-semibold shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Tambah FAQ Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-bold">Tambah FAQ</DialogTitle>
          <DialogDescription>
            Buat menu FAQ baru atau tambahkan sub-menu untuk bot WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label>Tipe FAQ</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={watch('is_menu')}
                onCheckedChange={(val) => setValue('is_menu', val)}
              />
              <Label>{watch('is_menu') ? 'Menu Pilihan (Folder)' : 'Jawaban Akhir (Dokumen)'}</Label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Jika ini adalah Menu Pilihan, maka ia dapat memiliki anak/sub-menu dan akan diletakkan di level utama.
            </p>
          </div>

          {!watch('is_menu') && (
            <div className="space-y-1.5">
              <Label>Pilih Induk (Parent)</Label>
              <Select value={watch('parent_id') || 'root'} onValueChange={(val) => setValue('parent_id', val)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih Induk Menu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">-- Menu Utama (Root) --</SelectItem>
                  {menuOptions.map((menu) => (
                    <SelectItem key={menu.id} value={menu.id}>
                      [{menu.kode}] {menu.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5 col-span-1">
              <Label htmlFor="kode">Kode</Label>
              <Input id="kode" placeholder="Mis: 1 / 1A" {...register('kode')} className="rounded-xl" />
              {errors.kode && <p className="text-destructive text-xs">{errors.kode.message}</p>}
            </div>

            <div className="space-y-1.5 col-span-3">
              <Label htmlFor="title">Judul (Title)</Label>
              <Input id="title" placeholder="Contoh: Jam Buka Kantor" {...register('title')} className="rounded-xl" />
              {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Konten / Isi Pesan</Label>
            <Textarea 
              id="content" 
              placeholder={watch('is_menu') ? 'Silakan pilih menu di bawah ini:' : 'Kantor BPS buka dari jam...'}
              {...register('content')} 
              className="rounded-xl min-h-[100px]" 
            />
            {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t mt-4">
            <Switch
              checked={watch('is_active')}
              onCheckedChange={(val) => setValue('is_active', val)}
            />
            <Label>Status Aktif</Label>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
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
