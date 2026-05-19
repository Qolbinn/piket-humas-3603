import { notFound, redirect } from 'next/navigation'
import { getPegawaiById } from '@/lib/actions/pegawai'
import { getCurrentPegawai } from '@/lib/actions/auth'
import EditPegawaiForm from './EditPegawaiForm'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EditPegawaiPageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Edit Pegawai — Piket Humas',
}

export default async function EditPegawaiPage({ params }: EditPegawaiPageProps) {
  const { id } = await params

  // Guard: hanya admin
  const currentPegawai = await getCurrentPegawai()
  if (currentPegawai?.role !== 'admin') redirect('/pegawai')

  const pegawai = await getPegawaiById(id)
  if (!pegawai) notFound()

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
          <h1 className="text-2xl font-bold tracking-tight text-primary">Edit Pegawai</h1>
          <p className="text-muted-foreground text-sm">
            Mengubah data pegawai: <span className="font-medium text-foreground">{pegawai.name}</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border rounded-2xl shadow-sm p-6">
        <EditPegawaiForm pegawai={pegawai} />
      </div>
    </div>
  )
}
