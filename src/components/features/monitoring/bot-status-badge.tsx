'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export default function BotStatusBadge() {
  const [lastPing, setLastPing] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const supabase = createClient()
  const TOLERANCE_MINUTES = 15

  // Ambil data pertama kali
  useEffect(() => {
    async function fetchInitialStatus() {
      const { data } = await supabase
        .from('bot_status')
        .select('last_ping_at')
        .eq('service_name', 'whatsapp_bot')
        .single()
      
      if (data?.last_ping_at) {
        setLastPing(new Date(data.last_ping_at))
      }
    }
    fetchInitialStatus()
  }, [])

  // Subscribe ke perubahan realtime tabel bot_status
  useEffect(() => {
    const channel = supabase
      .channel('bot_status_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bot_status', filter: 'service_name=eq.whatsapp_bot' },
        (payload) => {
          if (payload.new && 'last_ping_at' in payload.new) {
            setLastPing(new Date(payload.new.last_ping_at))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Timer internal untuk mengecek offline otomatis tiap 10 detik
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastPing) {
        const diffMs = new Date().getTime() - lastPing.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        setIsOnline(diffMins < TOLERANCE_MINUTES)
      }
    }, 10000)
    
    // Check initial
    if (lastPing) {
      const diffMs = new Date().getTime() - lastPing.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      setIsOnline(diffMins < TOLERANCE_MINUTES)
    }

    return () => clearInterval(interval)
  }, [lastPing])

  if (!lastPing) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center mr-2 cursor-help">
          <Badge variant="outline" className={`flex items-center gap-1.5 font-medium px-2.5 py-1 ${isOnline ? 'border-green-200 bg-green-50/50 text-green-700' : 'border-red-200 bg-red-50/50 text-red-700'}`}>
            <span className={`relative flex h-2 w-2`}>
              {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            {isOnline ? 'Bot Online' : 'Bot Offline'}
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        <p>Ping terakhir: {formatDistanceToNow(lastPing, { addSuffix: true, locale: id })}</p>
      </TooltipContent>
    </Tooltip>
  )
}
