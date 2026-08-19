import { requireAdmin } from '@/lib/actions/pegawai'
import { getKategoriLayanan } from '@/lib/actions/layanan'
import LayananList from '@/components/features/layanan/LayananList'
import CreateLayananDialog from '@/components/features/layanan/CreateLayananDialog'
import { redirect } from 'next/navigation'
import { LayoutList } from 'lucide-react'

export const metadata = {
  title: 'Kategori Layanan | Master Data',
}

export default async function LayananPage() {
  const adminCheck = await requireAdmin()
  if ('error' in adminCheck) {
    redirect('/dashboard')
  }

  const layananData = await getKategoriLayanan()
  const activeCount = layananData?.filter(l => l.is_active).length || 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <LayoutList className="h-4 w-4" />
            <span>Master Data</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Kategori Layanan</h1>
          <p className="text-muted-foreground">
            Kelola daftar kategori keperluan atau layanan pelanggan.
          </p>
        </div>
        <CreateLayananDialog />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 max-w-2xl">
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Kategori</p>
          <p className="text-2xl font-bold text-foreground mt-1">{layananData?.length ?? 0}</p>
        </div>
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Aktif Digunakan</p>
          <p className="text-2xl font-bold text-[#8cc640] mt-1">{activeCount}</p>
        </div>
      </div>

      <div className="space-y-2">
        <LayananList data={layananData ?? []} />
      </div>
    </div>
  )
}
