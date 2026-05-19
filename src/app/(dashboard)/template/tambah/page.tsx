import { getPegawai } from '@/lib/actions/pegawai'
import { TemplateForm } from '@/components/template/template-form'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function TambahTemplatePage() {
  const pegawais = await getPegawai()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/template">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buat Template</h1>
          <p className="text-muted-foreground">Tentukan alokasi petugas untuk setiap hari kerja</p>
        </div>
      </div>

      <TemplateForm pegawais={pegawais} />
    </div>
  )
}
