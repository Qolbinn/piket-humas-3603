import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPegawai } from '@/lib/actions/pegawai'
import { getCurrentPegawai } from '@/lib/actions/auth'
import PegawaiTableClient from '@/components/features/pegawai/PegawaiTableClient'
import CreatePegawaiDialog from '@/components/features/pegawai/CreatePegawaiDialog'

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="h-4 w-4" />
            <span>Manajemen SDM</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Data Pegawai</h1>
          <p className="text-muted-foreground">
            Manajemen data pegawai humas dan hak akses sistem.
          </p>
        </div>
        {isAdmin && <CreatePegawaiDialog />}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Pegawai</p>
          <p className="text-2xl font-bold text-foreground mt-1">{pegawaiList?.length ?? 0}</p>
        </div>
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Petugas</p>
          <p className="text-2xl font-bold text-[#8cc640] mt-1">
            {pegawaiList?.filter((p: any) => p.role === 'petugas').length ?? 0}
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-sm text-muted-foreground">Admin</p>
          <p className="text-2xl font-bold text-[#0595d7] mt-1">
            {pegawaiList?.filter((p: any) => p.role === 'admin').length ?? 0}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-2">
        {!isAdmin && (
          <p className="text-xs text-muted-foreground italic px-1">
            Hanya admin yang dapat mengelola data pegawai
          </p>
        )}
        <PegawaiTableClient data={pegawaiList ?? []} isAdmin={isAdmin} />
      </div>
    </div>
  )
}
