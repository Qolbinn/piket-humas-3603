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
      <Card className="border-green-200 bg-green-50/50 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800 text-sm">Kehadiran Tercatat</p>
              <p className="text-xs text-green-600/80">Anda telah siap bertugas hari ini.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center gap-3">
          <div className="bg-primary/20 p-2.5 rounded-full mt-1 sm:mt-0 flex-shrink-0">
            <Hand className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-primary text-base sm:text-lg">Jadwal Piket Hari Ini</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Anda memiliki jadwal piket hari ini. Harap konfirmasi kehadiran Anda untuk mulai menerima eskalasi pesan.
            </p>
          </div>
        </div>
        <Button 
          onClick={handleConfirm} 
          disabled={isPending} 
          className="w-full sm:w-auto rounded-xl shadow-md shrink-0 whitespace-nowrap"
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
          👋 Konfirmasi Hadir
        </Button>
      </CardContent>
    </Card>
  )
}
