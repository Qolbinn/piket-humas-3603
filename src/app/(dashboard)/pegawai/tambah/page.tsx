'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPegawaiSchema } from '@/lib/validations/pegawai'
import { createPegawai } from '@/lib/actions/pegawai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type FormValues = {
  name: string
  username: string
  email: string
  phone?: string
  password: string
  gender: 'L' | 'P'
  role: 'admin' | 'petugas'
}

export default function TambahPegawaiPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createPegawaiSchema) as any,
    defaultValues: { role: 'petugas' },
  })

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, String(value))
      })

      const result = await createPegawai(formData)
      if (result && (result as any).error) {
        toast.error((result as any).error)
      } else {
        toast.success('Pegawai berhasil ditambahkan.')
        router.push('/pegawai')
      }
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="rounded-xl">
          <Link href="/pegawai">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Tambah Pegawai</h1>
          <p className="text-muted-foreground text-sm">Buat akun dan profil pegawai baru.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-card border rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Nama */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="Masukkan nama lengkap"
              {...register('name')}
              className="rounded-xl"
            />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Contoh: budi.santoso"
              {...register('username')}
              className="rounded-xl"
            />
            {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Contoh: nama@bps.go.id"
              {...register('email')}
              className="rounded-xl"
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">Nomor Telepon <span className="text-muted-foreground font-normal">(opsional)</span></Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Contoh: 08123456789"
              {...register('phone')}
              className="rounded-xl"
            />
            {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 6 karakter"
              {...register('password')}
              className="rounded-xl"
            />
            {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
          </div>

          {/* Gender & Role */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select onValueChange={(v) => setValue('gender', v as 'L' | 'P')}>
                <SelectTrigger id="gender" className="rounded-xl">
                  <SelectValue placeholder="Pilih..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-destructive text-xs">{errors.gender.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Select
                defaultValue="petugas"
                onValueChange={(v) => setValue('role', v as 'admin' | 'petugas')}
              >
                <SelectTrigger id="role" className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petugas">Petugas</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button asChild variant="outline" className="flex-1 rounded-xl">
              <Link href="/pegawai">Batal</Link>
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl"
              id="submit-tambah-pegawai"
            >
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
              ) : (
                'Simpan Pegawai'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
