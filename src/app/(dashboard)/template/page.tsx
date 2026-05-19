import { getTemplates } from '@/lib/actions/template'
import { Button } from '@/components/ui/button'
import { Plus, Settings2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function TemplatePage() {
  const templates = await getTemplates()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Alokasi</h1>
          <p className="text-muted-foreground"> Kelola template jadwal piket mingguan </p>
        </div>
        <Button asChild>
          <Link href="/template/tambah">
            <Plus className="mr-2 h-4 w-4" /> Tambah Template
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates?.map((template: any) => (
          <Card key={template.id} className="overflow-hidden border-muted/50 hover:border-primary/30 transition-colors shadow-sm">
            <CardHeader className="pb-3 bg-muted/20">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                    <Link href={`/template/${template.id}/edit`}>
                      <Settings2 className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <CardDescription>
                Dibuat {new Date(template.created_at).toLocaleDateString('id-ID')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((day) => {
                  const dayName = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'][day - 1]
                  const detail = template.template_detail.filter((d: any) => d.day_of_week === day)
                  
                  return (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">{dayName}</span>
                      <div className="flex -space-x-2">
                        {detail.length > 0 ? (
                          detail.map((d: any, i: number) => (
                            <Badge key={i} variant="secondary" className="px-2 py-0 border-background shadow-sm">
                              {d.pegawai.name.split(' ')[0]}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs italic text-muted-foreground">Kosong</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {templates?.length === 0 && (
          <div className="col-span-full py-12 text-center bg-muted/10 rounded-xl border-2 border-dashed">
            <p className="text-muted-foreground">Belum ada template. Silakan buat yang pertama.</p>
          </div>
        )}
      </div>
    </div>
  )
}
