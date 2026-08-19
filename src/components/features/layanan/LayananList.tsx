'use client'

import * as React from 'react'
import { type KategoriLayanan } from '@/lib/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import EditLayananDialog from './EditLayananDialog'
import DeleteLayananButton from './DeleteLayananButton'

interface LayananListProps {
  data: KategoriLayanan[]
}

export default function LayananList({ data }: LayananListProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed bg-muted/20">
        <p className="text-lg font-medium text-foreground">Belum ada kategori layanan.</p>
        <p className="text-sm text-muted-foreground mt-1">Silakan tambah kategori baru untuk mulai mengelola layanan.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((layanan) => (
        <Card key={layanan.id} className="rounded-2xl shadow-sm border bg-card/50 hover:bg-card transition-all overflow-hidden flex flex-col justify-between">
          <CardHeader className="p-5 pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate flex items-center gap-2" title={layanan.nama}>
                  <Badge variant="outline" className="text-xs bg-muted/50 rounded-lg">{layanan.kode}</Badge>
                  {layanan.nama}
                </CardTitle>
                <CardDescription className="mt-1.5 text-xs text-muted-foreground">
                  Dibuat pada {format(new Date(layanan.created_at), 'dd MMM yyyy', { locale: id })}
                </CardDescription>
              </div>
              <div className="flex items-center -mt-1 -mr-2">
                <EditLayananDialog layanan={layanan} />
                <DeleteLayananButton id={layanan.id} name={layanan.nama} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-3">
            <div className="flex items-center gap-2 mt-2">
              {layanan.is_active ? (
                <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 px-2 py-0.5 rounded-md font-medium text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></div>
                  Aktif Digunakan
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground px-2 py-0.5 rounded-md font-medium text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mr-1.5"></div>
                  Nonaktif
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
