import { redirect } from 'next/navigation'
import { getCurrentPegawai } from '@/lib/actions/auth'
import ProfileForm from '@/components/features/profile/ProfileForm'
import ChangePasswordForm from '@/components/features/profile/ChangePasswordForm'
import { Badge } from '@/components/ui/badge'
import { User as UserIcon, Mail, Phone, ShieldCheck, Calendar, Lock } from 'lucide-react'
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

  const isAdminRole = pegawai.role === 'admin'
  const isPimpinan = pegawai.role === 'pimpinan'

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full">
      {/* Header */}
      <PageHeader
        title="Profil Saya"
        description="Kelola informasi akun dan pengaturan keamanan profil Anda."
        breadcrumbText="Akun"
        breadcrumbIcon={UserIcon}
      />

      <div className="space-y-6">
        {/* Top Profile Summary Card */}
        <div className="relative overflow-hidden bg-card border border-border/80 rounded-2xl shadow-xs p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-2xl -mr-20 -mt-20 pointer-events-none" />

          {/* Avatar with Gradient Ring */}
          <div className="relative p-1 rounded-full bg-gradient-to-br from-primary via-emerald-400 to-sky-400 shadow-md shrink-0">
            <div className="h-24 w-24 rounded-full bg-card flex items-center justify-center">
              <span className="text-3xl font-black bg-gradient-to-br from-primary to-emerald-500 bg-clip-text text-transparent select-none">
                {pegawai.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Name & Role */}
          <div className="flex-1 text-center md:text-left space-y-2.5 z-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">{pegawai.name}</h2>
              <p className="text-xs text-muted-foreground font-mono font-bold mt-0.5">@{pegawai.username}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
              isAdminRole
                ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20'
                : isPimpinan
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
            }`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              {isAdminRole ? 'Admin Sistem' : isPimpinan ? 'Pimpinan Humas' : 'Petugas Piket'}
            </span>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground bg-muted/30 p-4 rounded-2xl border border-border/60 w-full md:w-auto z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Mail className="h-3.5 w-3.5 shrink-0" />
              </div>
              <span className="truncate font-semibold">{pegawai.email}</span>
            </div>
            {pegawai.phone && (
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                </div>
                <span className="font-semibold font-mono">{pegawai.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <UserIcon className="h-3.5 w-3.5 shrink-0" />
              </div>
              <span className="font-semibold">{pegawai.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
              </div>
              <span className="font-semibold">Bergabung {joinDate}</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Forms (Side-by-side on desktop) */}
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <div className="bg-card border border-border/80 rounded-2xl shadow-xs p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-border/60">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">Edit Informasi</h3>
                <p className="text-xs text-muted-foreground">Perbarui data diri dan nomor kontak Anda</p>
              </div>
            </div>
            <ProfileForm pegawai={pegawai} />
          </div>

          <div className="bg-card border border-border/80 rounded-2xl shadow-xs p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-border/60">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">Ubah Password</h3>
                <p className="text-xs text-muted-foreground">Perbarui kata sandi akun Anda secara berkala</p>
              </div>
            </div>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}
