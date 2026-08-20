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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Plus, Loader2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import WaToolbar from './WaToolbar'
import { parseWaMarkdown } from '@/lib/utils/wa-format'

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

  const [isPreview, setIsPreview] = React.useState(false)

  const { ref: contentRef, ...contentRest } = register('content')
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

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
      <DialogContent className="sm:max-w-[800px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-bold">Tambah FAQ</DialogTitle>
          <DialogDescription>
            Buat menu FAQ baru atau tambahkan sub-menu untuk bot WhatsApp.
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
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="folder" id="create-type-folder" />
                    <Label htmlFor="create-type-folder" className="cursor-pointer">Menu Pilihan (Folder)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dokumen" id="create-type-dokumen" />
                    <Label htmlFor="create-type-dokumen" className="cursor-pointer">Jawaban Akhir (Dokumen)</Label>
                  </div>
                </RadioGroup>
                
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                  {watch('is_menu') 
                    ? 'Sebagai Menu Pilihan, FAQ ini dapat memiliki anak/sub-menu dan selalu berada di level utama.' 
                    : 'Sebagai Jawaban Akhir, FAQ ini akan menampilkan teks balasan langsung ke pelanggan.'}
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

              <div className="flex gap-4">
                <div className="space-y-1.5 w-1/3">
                  <Label htmlFor="kode">Kode</Label>
                  <Input id="kode" placeholder="Mis: 1 / 1A" {...register('kode')} className="rounded-xl" />
                  {errors.kode && <p className="text-destructive text-[11px]">{errors.kode.message}</p>}
                </div>
                <div className="space-y-1.5 w-2/3">
                  <Label htmlFor="title">Judul (Title)</Label>
                  <Input id="title" placeholder="Cth: Jam Buka" {...register('title')} className="rounded-xl" />
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
                <Label htmlFor="content">Konten / Isi Pesan</Label>
                
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
                    id="content" 
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

          <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
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
