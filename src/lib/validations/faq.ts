import * as z from 'zod'

export const faqMenuSchema = z.object({
  parent_id: z.string().nullable().optional(),
  kode: z.string().min(1, { message: 'Kode wajib diisi' }),
  title: z.string().min(3, { message: 'Judul minimal 3 karakter' }),
  is_menu: z.boolean(),
  content: z.string().min(5, { message: 'Konten/Jawaban minimal 5 karakter' }),
  urutan: z.number().int().default(0),
  is_active: z.boolean().default(true),
})
