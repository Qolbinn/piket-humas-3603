'use client'

import React, { useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Hand, Loader2 } from 'lucide-react'
import { confirmPresence } from '@/lib/actions/jadwal'
import { toast } from 'sonner'

interface PresenceChecklistProps {
  jadwalId: string
  isHadir: boolean
  hadirAt?: string | null
}

export default function PresenceChecklist({ jadwalId, isHadir, hadirAt }: PresenceChecklistProps) {
  const [isPending, startTransition] = useTransition()
  const [marked, setMarked] = React.useState(isHadir)

  function handleConfirm() {
    startTransition(async () => {
      const res = await confirmPresence(jadwalId)
      if (res.error) {
        toast.error('Gagal konfirmasi kehadiran: ' + res.error)
      } else {
        toast.success('Kehadiran piket berhasil dicatat!')
        setMarked(true)
      }
    })
  }

  if (marked) {
    return (
      <Card className="border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20 shadow-xs rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="bg-emerald-500 p-2.5 rounded-xl text-white shadow-xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-emerald-900 dark:text-emerald-300 text-base">Kehadiran Piket Tercatat</p>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 font-medium">
                {hadirAt ? `Tercatat pada jam ${new Date(hadirAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB.` : 'Anda telah siap bertugas melayani eskalasi hari ini.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-primary/30 bg-primary/5 shadow-xs overflow-hidden relative rounded-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="bg-primary p-2.5 rounded-xl text-white shadow-xs shrink-0 mt-0.5 sm:mt-0">
            <Hand className="h-5 w-5 stroke-[2.25]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-primary text-base sm:text-lg">Jadwal Piket Hari Ini</h3>
              <span className="text-[10px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Belum Absen
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
              Anda memiliki jadwal piket hari ini. Harap konfirmasi kehadiran Anda untuk mulai memantau dan membalas eskalasi pelanggan.
            </p>
          </div>
        </div>
        <Button 
          onClick={handleConfirm} 
          disabled={isPending} 
          className="w-full sm:w-auto rounded-xl shadow-md shrink-0 font-bold gap-2 px-5 h-11"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          <span>Konfirmasi Hadir</span>
        </Button>
      </CardContent>
    </Card>
  )
}
