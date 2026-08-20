import { requireAdmin } from '@/lib/actions/pegawai'
import { getFaqMenus } from '@/lib/actions/faq'
import FaqTreeView from '@/components/features/faq/FaqTreeView'
import CreateFaqDialog from '@/components/features/faq/CreateFaqDialog'
import PageHeader from '@/components/layout/page-header'
import { MessageSquareText, Layers, FolderTree } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Manajemen FAQ',
}

export default async function FaqPage() {
  await requireAdmin()

  const faqs = await getFaqMenus()

  // Stats calculation
  const totalMenus = faqs.filter(f => f.is_menu).length
  const totalAnswers = faqs.filter(f => !f.is_menu).length
  const totalActive = faqs.filter(f => f.is_active).length

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <PageHeader
        title="Manajemen FAQ"
        description="Atur struktur menu dan jawaban otomatis yang akan dibaca oleh bot WhatsApp."
        breadcrumbText="Master Data"
        breadcrumbIcon={FolderTree}
        action={<CreateFaqDialog faqs={faqs} />}
      />

      {/* Stats Bar */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-none shadow-md bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-indigo-100 font-medium">Total Menu (Folder)</p>
              <h3 className="text-4xl font-bold mt-2">{totalMenus}</h3>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl">
              <FolderTree className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-none shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-blue-100 font-medium">Total Jawaban Final</p>
              <h3 className="text-4xl font-bold mt-2">{totalAnswers}</h3>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl">
              <MessageSquareText className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-md bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-emerald-100 font-medium">Status Aktif</p>
              <h3 className="text-4xl font-bold mt-2">{totalActive} / {faqs.length}</h3>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl">
              <Layers className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tree View Content */}
      <FaqTreeView faqs={faqs} />
    </div>
  )
}
