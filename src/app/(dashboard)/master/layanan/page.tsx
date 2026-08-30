import { requireAdmin } from '@/lib/actions/pegawai'
import { getKategoriLayanan } from '@/lib/actions/layanan'
import LayananList from '@/components/features/layanan/LayananList'
import CreateLayananDialog from '@/components/features/layanan/CreateLayananDialog'
import PageHeader from '@/components/layout/page-header'
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
      <PageHeader
        title="Kategori Layanan"
        description="Kelola daftar kategori keperluan atau layanan pelanggan."
        breadcrumbText="Master Data"
        breadcrumbIcon={LayoutList}
        action={<CreateLayananDialog />}
      />

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Total Kategori</p>
            <p className="text-3xl font-extrabold text-foreground mt-1">{layananData?.length ?? 0}</p>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20">
            <LayoutList className="h-6 w-6 stroke-[2.25]" />
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-emerald-500/10 via-background to-background relative overflow-hidden flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Aktif Digunakan</p>
            <p className="text-3xl font-extrabold text-foreground mt-1">{activeCount}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/20">
            <LayoutList className="h-6 w-6 stroke-[2.25]" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <LayananList data={layananData ?? []} />
      </div>
    </div>
  )
}
