import { z } from 'zod'

export const templateDetailSchema = z.object({
  day_of_week: z.number().min(1).max(5),
  pegawai_id: z.string().uuid('ID Pegawai tidak valid'),
})

export const templateSchema = z.object({
  name: z.string().min(3, 'Nama template minimal 3 karakter'),
  details: z.array(templateDetailSchema).min(1, 'Template harus memiliki minimal satu alokasi petugas'),
})

export type TemplateFormValues = z.infer<typeof templateSchema>
