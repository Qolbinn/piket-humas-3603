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
        <Card className="rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-indigo-500/10 via-background to-background relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Total Menu (Folder)</p>
              <h3 className="text-3xl font-extrabold text-foreground mt-1">{totalMenus}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl border border-indigo-500/20">
              <FolderTree className="h-6 w-6 stroke-[2.25]" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-blue-500/10 via-background to-background relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Total Jawaban Final</p>
              <h3 className="text-3xl font-extrabold text-foreground mt-1">{totalAnswers}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl border border-blue-500/20">
              <MessageSquareText className="h-6 w-6 stroke-[2.25]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-emerald-500/10 via-background to-background relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Status Aktif</p>
              <h3 className="text-3xl font-extrabold text-foreground mt-1">{totalActive} / {faqs.length}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/20">
              <Layers className="h-6 w-6 stroke-[2.25]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tree View Content */}
      <FaqTreeView faqs={faqs} />
    </div>
  )
}
