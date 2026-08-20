'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { faqMenuSchema } from '@/lib/validations/faq'
import type { FaqMenu } from '@/lib/types/database'
import * as z from 'zod'
import { updateFaqMenu, deleteFaqMenu } from '@/lib/actions/faq'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type FormValues = z.infer<typeof faqMenuSchema>

interface EditFaqDialogProps {
  faq: FaqMenu | null
  faqs: FaqMenu[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditFaqDialog({ faq, faqs, open, onOpenChange }: EditFaqDialogProps) {
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
  })

  React.useEffect(() => {
    if (faq && open) {
      reset({
        parent_id: faq.parent_id || 'root',
        kode: faq.kode || '',
        title: faq.title,
        is_menu: faq.is_menu,
        content: faq.content,
        urutan: faq.urutan,
        is_active: faq.is_active,
      })
    }
  }, [faq, open, reset])

  // Only allow items that are marked as 'is_menu' to be parents
  // Also prevent setting itself as a parent to avoid infinite loops
  const menuOptions = faqs.filter(f => f.is_menu && f.id !== faq?.id)

  const hasChildren = React.useMemo(() => {
    if (!faq) return false
    return faqs.some(f => f.parent_id === faq.id)
  }, [faq, faqs])

  function onSubmit(data: FormValues) {
    if (!faq) return
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

      const result = await updateFaqMenu(faq.id, formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('FAQ berhasil diperbarui!')
        onOpenChange(false)
      }
    })
  }

  function handleDelete() {
    if (!faq) return
    const isConfirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus FAQ ini? Jika ini adalah menu utama, seluruh sub-menunya juga akan terhapus!'
    )
    if (!isConfirmed) return

    startTransition(async () => {
      const result = await deleteFaqMenu(faq.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('FAQ berhasil dihapus!')
        onOpenChange(false)
      }
    })
  }

  if (!faq) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-bold">Edit FAQ</DialogTitle>
          <DialogDescription>
            Ubah detail FAQ ini. Perhatikan perubahan pada kode dan struktur hirarkinya.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label>Tipe FAQ</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={watch('is_menu')}
                onCheckedChange={(val) => setValue('is_menu', val)}
                disabled={faq.is_menu && hasChildren}
              />
              <Label>{watch('is_menu') ? 'Menu Pilihan (Folder)' : 'Jawaban Akhir (Dokumen)'}</Label>
            </div>
            {watch('is_menu') ? (
              <p className="text-xs text-muted-foreground mt-1">
                Sebagai Menu Pilihan, FAQ ini akan otomatis dikembalikan ke level utama.
              </p>
            ) : null}
            {faq.is_menu && hasChildren && (
              <p className="text-xs text-destructive mt-1">
                Folder ini memiliki sub-menu. Anda tidak dapat mengubahnya menjadi Jawaban Akhir sebelum memindahkan atau menghapus sub-menunya.
              </p>
            )}
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
              <Label htmlFor={`edit-kode-${faq.id}`}>Kode</Label>
              <Input id={`edit-kode-${faq.id}`} {...register('kode')} className="rounded-xl" />
              {errors.kode && <p className="text-destructive text-xs">{errors.kode.message}</p>}
            </div>

            <div className="space-y-1.5 col-span-3">
              <Label htmlFor={`edit-title-${faq.id}`}>Judul (Title)</Label>
              <Input id={`edit-title-${faq.id}`} {...register('title')} className="rounded-xl" />
              {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`edit-content-${faq.id}`}>Konten / Isi Pesan</Label>
            <Textarea 
              id={`edit-content-${faq.id}`}
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

          <div className="flex justify-between items-center pt-6">
            <Button type="button" variant="destructive" className="rounded-xl" onClick={handleDelete} disabled={isPending}>
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-xl">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
