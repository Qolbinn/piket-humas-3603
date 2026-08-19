import * as z from 'zod'

export const createPegawaiSchema = z.object({
  name: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
  username: z.string().min(3, { message: 'Username minimal 3 karakter' }),
  email: z.string().email({ message: 'Email tidak valid' }),
  phone: z.string().min(10, { message: 'Nomor HP minimal 10 digit' }),
  lid_wa: z.string().min(5, { message: 'Nomor LID WA tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
  gender: z.enum(['L', 'P'] as const, { error: 'Jenis kelamin wajib dipilih' }),
  role: z.enum(['admin', 'pimpinan', 'petugas'] as const),
})

export const updatePegawaiSchema = z.object({
  name: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
  username: z.string().min(3, { message: 'Username minimal 3 karakter' }),
  phone: z.string().min(10, { message: 'Nomor HP minimal 10 digit' }),
  lid_wa: z.string().min(5, { message: 'Nomor LID WA tidak valid' }),
  gender: z.enum(['L', 'P'] as const, { error: 'Jenis kelamin wajib dipilih' }),
  role: z.enum(['admin', 'pimpinan', 'petugas'] as const),
})

export const updateProfileSchema = z.object({
  name: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
  phone: z.string().min(10, { message: 'Nomor HP minimal 10 digit' }),
})
