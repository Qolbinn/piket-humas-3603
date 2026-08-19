import * as z from 'zod'

export const kategoriLayananSchema = z.object({
  kode: z.string().min(1, { message: 'Kode wajib diisi' }),
  nama: z.string().min(3, { message: 'Nama kategori minimal 3 karakter' }),
  is_active: z.boolean(),
})
