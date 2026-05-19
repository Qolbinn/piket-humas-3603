import { getPegawai } from '@/lib/actions/pegawai'
import { getTemplateById } from '@/lib/actions/template'
import { TemplateForm } from '@/components/template/template-form'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  const [pegawais, template] = await Promise.all([
    getPegawai(),
    getTemplateById(params.id)
  ])

  if (!template) notFound()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/template">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Template</h1>
          <p className="text-muted-foreground">Ubah alokasi petugas untuk template ini</p>
        </div>
      </div>

      <TemplateForm initialData={template} pegawais={pegawais} />
    </div>
  )
}
