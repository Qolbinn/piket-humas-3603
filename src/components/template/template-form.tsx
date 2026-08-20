'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { templateSchema, type TemplateFormValues } from '@/lib/validations/template'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useTransition, useEffect } from 'react'
import { createTemplate, updateTemplate } from '@/lib/actions/template'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Plus, X } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface TemplateFormProps {
  initialData?: any
  pegawais: any[]
  onSuccess?: () => void
  onCancel?: () => void
}

export function TemplateForm({ initialData, pegawais, onSuccess, onCancel }: TemplateFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Transform initialData to match form values
  const defaultValues: Partial<TemplateFormValues> = {
    name: initialData?.name || '',
    details: initialData?.template_piket_detail 
      ? initialData.template_piket_detail.map((d: any) => ({
          day_of_week: d.day_of_week,
          pegawai_id: d.pegawai?.id || d.pegawai_id
        }))
      : []
  }

  const { register, watch, setValue, setError, clearErrors, formState: { errors } } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema as any),
    defaultValues
  })

  const currentDetails = watch('details') || []

  const togglePegawai = (day: number, pegawaiId: string) => {
    const exists = currentDetails.find(d => d.day_of_week === day && d.pegawai_id === pegawaiId)

    if (exists) {
      setValue('details', currentDetails.filter(d => !(d.day_of_week === day && d.pegawai_id === pegawaiId)), { shouldValidate: true })
    } else {
      // Check if already 3 pegawais for this day
      const count = currentDetails.filter(d => d.day_of_week === day).length
      if (count >= 3) {
        toast.error('Maksimal 3 petugas per hari')
        return
      }
      setValue('details', [...currentDetails, { day_of_week: day, pegawai_id: pegawaiId }], { shouldValidate: true })
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()
    
    const formData = {
      name: watch('name'),
      details: watch('details') || []
    }

    const parsed = templateSchema.safeParse(formData)
    
    if (!parsed.success) {
      console.error("Form Validation Errors:", parsed.error)
      parsed.error.issues.forEach(err => {
        if (err.path.length > 0) {
          setError(err.path[0] as keyof TemplateFormValues, { type: 'manual', message: err.message })
        }
      })
      toast.error("Cek kembali isian formulir Anda")
      return
    }

    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateTemplate(initialData.id, parsed.data)
          toast.success('Template berhasil diperbarui')
        } else {
          await createTemplate(parsed.data)
          toast.success('Template berhasil dibuat')
        }
        if (onSuccess) onSuccess()
        router.refresh()
      } catch (err: any) {
        toast.error(err.message)
      }
    })
  }

  const days = [
    { value: 1, label: 'Senin' },
    { value: 2, label: 'Selasa' },
    { value: 3, label: 'Rabu' },
    { value: 4, label: 'Kamis' },
    { value: 5, label: 'Jumat' },
  ]

  return (
    <form onSubmit={handleManualSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Template</Label>
        <Input
          id="name"
          placeholder="Misal: Tim Charlie"
          {...register('name')}
          disabled={isPending}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Alokasi Petugas per Hari (Max 3)</Label>
        <div className="grid grid-cols-5 gap-2 border rounded-lg p-2 bg-muted/20">
          {days.map((day) => {
            const dayDetails = currentDetails.filter(d => d.day_of_week === day.value)
            
            return (
              <div key={day.value} className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-center py-1 bg-muted rounded">{day.label}</div>
                
                {/* Selected Pegawais */}
                {dayDetails.map((detail, idx) => {
                  const pegawai = pegawais.find(p => p.id === detail.pegawai_id)
                  if (!pegawai) return null
                  
                  return (
                    <div key={idx} className="flex items-center justify-between px-2 py-1 bg-background border rounded text-xs shadow-sm group">
                      <span className="truncate">{pegawai.name.split(' ')[0]}</span>
                      <button 
                        type="button" 
                        onClick={() => togglePegawai(day.value, pegawai.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}

                {/* Add Button */}
                {dayDetails.length < 3 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 text-xs border-dashed text-muted-foreground w-full bg-background" disabled={isPending}>
                        <Plus className="mr-1 h-3 w-3" /> Tambah
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[180px]">
                      {pegawais.map(p => {
                        const isSelected = dayDetails.some(d => d.pegawai_id === p.id)
                        return (
                          <DropdownMenuItem 
                            key={p.id}
                            disabled={isSelected}
                            onClick={() => togglePegawai(day.value, p.id)}
                            className={cn("text-xs", isSelected && "opacity-50")}
                          >
                            {p.name}
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )
          })}
        </div>
        {errors.details && <p className="text-sm text-destructive">{errors.details.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => onCancel ? onCancel() : router.back()}
          disabled={isPending}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
          ) : (
            "Simpan Template"
          )}
        </Button>
      </div>
    </form>
  )
}
