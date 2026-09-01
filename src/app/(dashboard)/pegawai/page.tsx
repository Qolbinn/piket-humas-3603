import { Users, UserCheck, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPegawai } from '@/lib/actions/pegawai'
import { getCurrentPegawai } from '@/lib/actions/auth'
import PegawaiTableClient from '@/components/features/pegawai/PegawaiTableClient'
import CreatePegawaiDialog from '@/components/features/pegawai/CreatePegawaiDialog'
import PageHeader from '@/components/layout/page-header'

export const metadata = {
  title: 'Data Pegawai — Piket Humas',
  description: 'Manajemen data pegawai humas dan hak akses sistem.',
}

export default async function PegawaiPage() {
  const [pegawaiList, currentPegawai] = await Promise.all([
    getPegawai(),
    getCurrentPegawai(),
  ])

  const isAdmin = currentPegawai?.role === 'admin'
  const totalCount = pegawaiList?.length ?? 0
  const petugasCount = pegawaiList?.filter((p: any) => p.role === 'petugas').length ?? 0
  const adminCount = pegawaiList?.filter((p: any) => p.role === 'admin' || p.role === 'pimpinan').length ?? 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <PageHeader
        title="Data Pegawai"
        description="Manajemen data pegawai humas dan hak akses sistem."
        breadcrumbText="Manajemen SDM"
        breadcrumbIcon={Users}
        action={isAdmin ? <CreatePegawaiDialog /> : undefined}
      />

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Pegawai */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/5" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Total Pegawai</p>
              <p className="text-3xl font-extrabold text-foreground">{totalCount}</p>
              <p className="text-xs text-muted-foreground">terdaftar di sistem</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Petugas Piket */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background border border-emerald-500/20 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-emerald-500/5" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Petugas Piket</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{petugasCount}</p>
              <p className="text-xs text-muted-foreground">operator aktif</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Admin & Pimpinan */}
        <div className="relative overflow-hidden bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-background border border-sky-500/20 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-sky-500/5" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Admin & Pimpinan</p>
              <p className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">{adminCount}</p>
              <p className="text-xs text-muted-foreground">pengelola sistem</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <ShieldCheck className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-2">
        {!isAdmin && (
          <p className="text-xs text-muted-foreground italic px-1">
            Hanya admin yang dapat mengelola data pegawai
          </p>
        )}
        <PegawaiTableClient data={pegawaiList ?? []} isAdmin={isAdmin} currentPegawaiId={currentPegawai?.id} />
      </div>
    </div>
  )
}
