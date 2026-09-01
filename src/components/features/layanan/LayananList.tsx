'use client'

import * as React from 'react'
import { type KategoriLayanan } from '@/lib/types/database'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import EditLayananDialog from './EditLayananDialog'
import DeleteLayananButton from './DeleteLayananButton'

interface LayananListProps {
  data: KategoriLayanan[]
}

export default function LayananList({ data }: LayananListProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-2xl bg-muted/20">
        <p className="text-base font-bold text-foreground">Belum ada kategori layanan.</p>
        <p className="text-xs text-muted-foreground mt-1">Silakan tambah kategori baru untuk mulai mengelola layanan.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.map((layanan) => (
        <Card 
          key={layanan.id} 
          className={cn(
            "rounded-2xl shadow-xs border border-border/80 bg-card hover:bg-muted/10 transition-all overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 relative group",
            layanan.is_active ? "border-t-4 border-t-emerald-500" : "border-t-4 border-t-muted-foreground/40"
          )}
        >
          <CardHeader className="p-5">
            <div className="flex items-start gap-3.5">
              <div className={cn(
                "p-3 rounded-xl border shrink-0 transition-colors",
                layanan.is_active 
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                  : "bg-muted text-muted-foreground border-border/60"
              )}>
                <Tag className="h-5 w-5 stroke-[2.25]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-mono font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-lg border border-primary/20">
                    #{layanan.kode}
                  </span>
                  
                  {layanan.is_active ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-muted text-muted-foreground border">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></span>
                      Nonaktif
                    </span>
                  )}
                </div>

                <CardTitle className="text-base font-extrabold text-foreground truncate mt-2" title={layanan.nama}>
                  {layanan.nama}
                </CardTitle>
                
                <CardDescription className="mt-1 text-[11px] text-muted-foreground">
                  Dibuat {format(new Date(layanan.created_at), 'dd MMM yyyy', { locale: id })}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 pt-3 mt-3 border-t border-border/40">
              <EditLayananDialog layanan={layanan} />
              <DeleteLayananButton id={layanan.id} name={layanan.nama} />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
