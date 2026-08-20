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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import WaToolbar from './WaToolbar'
import { parseWaMarkdown } from '@/lib/utils/wa-format'

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

  const [isPreview, setIsPreview] = React.useState(false)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)

  const { ref: contentRef, ...contentRest } = register('content')
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

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
    
    startTransition(async () => {
      const res = await deleteFaqMenu(faq.id)
      if (res?.error) {
        toast.error(res.error)
        setIsAlertOpen(false)
      } else {
        toast.success('FAQ berhasil dihapus.')
        setIsAlertOpen(false)
        onOpenChange(false)
      }
    })
  }

  if (!faq) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-bold">Edit FAQ</DialogTitle>
          <DialogDescription>
            Ubah detail FAQ ini. Perhatikan perubahan pada kode dan struktur hirarkinya.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Kolom Kiri: Pengaturan & Atribut */}
            <div className="md:col-span-5 space-y-5">
              
              <div className="space-y-3 p-3 border rounded-xl bg-muted/20">
                <Label className="text-sm font-semibold">Tipe FAQ</Label>
                
                <RadioGroup
                  value={watch('is_menu') ? 'folder' : 'dokumen'}
                  onValueChange={(val) => setValue('is_menu', val === 'folder')}
                  disabled={faq.is_menu && hasChildren}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="folder" id={`edit-type-folder-${faq.id}`} />
                    <Label htmlFor={`edit-type-folder-${faq.id}`} className="cursor-pointer">Menu Pilihan (Folder)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dokumen" id={`edit-type-dokumen-${faq.id}`} />
                    <Label htmlFor={`edit-type-dokumen-${faq.id}`} className="cursor-pointer">Jawaban Akhir (Dokumen)</Label>
                  </div>
                </RadioGroup>
                
                <div className="mt-2 space-y-1">
                  {watch('is_menu') ? (
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Sebagai Menu Pilihan, FAQ ini akan otomatis dikembalikan ke level utama.
                    </p>
                  ) : null}
                  {faq.is_menu && hasChildren && (
                    <p className="text-[11px] text-destructive leading-relaxed font-medium">
                      Folder ini memiliki sub-menu. Anda tidak dapat mengubahnya menjadi Jawaban Akhir sebelum sub-menunya dipindahkan/dihapus.
                    </p>
                  )}
                </div>
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

              <div className="flex gap-4">
                <div className="space-y-1.5 w-1/3">
                  <Label htmlFor={`edit-kode-${faq.id}`}>Kode</Label>
                  <Input id={`edit-kode-${faq.id}`} {...register('kode')} className="rounded-xl" />
                  {errors.kode && <p className="text-destructive text-[11px]">{errors.kode.message}</p>}
                </div>
                <div className="space-y-1.5 w-2/3">
                  <Label htmlFor={`edit-title-${faq.id}`}>Judul (Title)</Label>
                  <Input id={`edit-title-${faq.id}`} {...register('title')} className="rounded-xl" />
                  {errors.title && <p className="text-destructive text-[11px]">{errors.title.message}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-3 pb-1">
                <Switch
                  checked={watch('is_active')}
                  onCheckedChange={(val) => setValue('is_active', val)}
                />
                <Label>Status Aktif</Label>
              </div>
            </div>

            {/* Kolom Kanan: Editor Konten */}
            <div className="md:col-span-7 flex flex-col h-full">
              <div className="space-y-1.5 flex flex-col flex-1">
                <Label htmlFor={`edit-content-${faq.id}`}>Konten / Isi Pesan</Label>
                
                <div className="flex items-start justify-between">
                  <div className="min-h-[36px]">
                    {!isPreview && (
                      <WaToolbar 
                        textareaRef={textareaRef} 
                        onFormat={(val) => setValue('content', val, { shouldValidate: true })} 
                      />
                    )}
                  </div>
                  <Button 
                    type="button" 
                    variant={isPreview ? "secondary" : "outline"} 
                    size="sm" 
                    onClick={() => setIsPreview(!isPreview)}
                    className="h-8 text-xs rounded-lg"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    {isPreview ? 'Tutup Preview' : 'Preview WA'}
                  </Button>
                </div>
                
                {isPreview ? (
                  <div 
                    className="rounded-xl border h-[280px] overflow-y-auto p-4 text-sm bg-muted/10 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: parseWaMarkdown(watch('content')) || '<span class="text-muted-foreground italic">Belum ada konten...</span>' }}
                  />
                ) : (
                  <Textarea 
                    id={`edit-content-${faq.id}`}
                    placeholder={watch('is_menu') ? 'Isikan keterangan Menu ...' : 'Ketikkan jawaban dari Judul Pertanyaan ...'}
                    {...contentRest}
                    ref={(e) => {
                      contentRef(e)
                      textareaRef.current = e
                    }}
                    className="rounded-xl h-[280px] resize-none overflow-y-auto" 
                  />
                )}
                <div className="flex justify-between items-start pt-1">
                  <p className="text-[11px] text-muted-foreground">
                    Gunakan *tebal*, _miring_, atau ~coret~.
                  </p>
                  {errors.content && <p className="text-destructive text-[11px] max-w-[200px] text-right">{errors.content.message}</p>}
                </div>
              </div>
            </div>
            
          </div>

          <div className="flex justify-between items-center pt-6 mt-4 border-t">
            <Button type="button" variant="destructive" className="rounded-xl" onClick={() => setIsAlertOpen(true)} disabled={isPending}>
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" className="rounded-xl min-w-[100px]" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : 'Simpan'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus FAQ ini? 
              {faq?.is_menu && ' Jika ini folder, semua sub-menu di dalamnya juga akan ikut terhapus secara permanen.'}
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              {isPending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
