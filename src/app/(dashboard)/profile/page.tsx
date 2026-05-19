import { redirect } from 'next/navigation'
import { getCurrentPegawai } from '@/lib/actions/auth'
import ProfileForm from '@/components/features/profile/ProfileForm'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, ShieldCheck, Calendar } from 'lucide-react'

export const metadata = {
  title: 'Profil Saya — Piket Humas',
  description: 'Lihat dan perbarui informasi profil akun Anda.',
}

export default async function ProfilePage() {
  const pegawai = await getCurrentPegawai()
  if (!pegawai) redirect('/login')

  const joinDate = new Date(pegawai.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Profil Saya</h1>
        <p className="text-muted-foreground mt-1">Kelola informasi akun dan profil Anda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Profile Card (kiri) */}
        <div className="md:col-span-2">
          <div className="bg-card border rounded-2xl shadow-sm p-6 flex flex-col items-center text-center gap-4 h-full">
            {/* Avatar placeholder */}
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#0595d7] to-[#8cc640] flex items-center justify-center shadow-md">
              <span className="text-3xl font-bold text-white select-none">
                {pegawai.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xl font-bold text-foreground">{pegawai.name}</p>
              <p className="text-sm text-muted-foreground font-mono">@{pegawai.username}</p>
            </div>

            <Badge
              className={
                pegawai.role === 'admin'
                  ? 'bg-[#0595d7] hover:bg-[#0595d7]/90 gap-1'
                  : 'bg-[#8cc640] hover:bg-[#8cc640]/90 gap-1'
              }
            >
              <ShieldCheck className="h-3 w-3" />
              {pegawai.role === 'admin' ? 'Admin' : 'Petugas'}
            </Badge>

            <div className="w-full space-y-2 pt-2 text-sm text-muted-foreground text-left">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{pegawai.email}</span>
              </div>
              {pegawai.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{pegawai.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 shrink-0" />
                <span>{pegawai.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Bergabung {joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form (kanan) */}
        <div className="md:col-span-3">
          <div className="bg-card border rounded-2xl shadow-sm p-6 h-full">
            <h2 className="text-lg font-semibold mb-5">Edit Informasi</h2>
            <ProfileForm pegawai={pegawai} />
          </div>
        </div>
      </div>
    </div>
  )
}
