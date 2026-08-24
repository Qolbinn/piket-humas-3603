import { redirect } from 'next/navigation'
import { getCurrentPegawai } from '@/lib/actions/auth'
import ProfileForm from '@/components/features/profile/ProfileForm'
import ChangePasswordForm from '@/components/features/profile/ChangePasswordForm'
import { Badge } from '@/components/ui/badge'
import { User as UserIcon, Mail, Phone, ShieldCheck, Calendar } from 'lucide-react'
import PageHeader from '@/components/layout/page-header'

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
    <div className="space-y-8 animate-in fade-in duration-500 w-full">
      {/* Header */}
      <PageHeader
        title="Profil Saya"
        description="Kelola informasi akun dan profil Anda."
        breadcrumbText="Akun"
        breadcrumbIcon={UserIcon}
      />

      <div className="space-y-6">
        {/* Top Row: Profile Info (Full Width) */}
        <div className="bg-card border rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#0595d7] to-[#8cc640] flex items-center justify-center shadow-md shrink-0">
            <span className="text-3xl font-bold text-white select-none">
              {pegawai.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Name & Role */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div>
              <p className="text-2xl font-bold text-foreground">{pegawai.name}</p>
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
          </div>

          {/* Contact Details (Right side on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border w-full md:w-auto">
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
              <UserIcon className="h-4 w-4 shrink-0" />
              <span>{pegawai.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Bergabung {joinDate}</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Forms (Side-by-side on desktop) */}
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <div className="bg-card border rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-5">Edit Informasi</h2>
            <ProfileForm pegawai={pegawai} />
          </div>

          <div className="bg-card border rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-5">Ubah Password</h2>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}
