'use client'

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function WhatsAppFab() {
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "6285117193603";
  const waUrl = `https://wa.me/${waNumber}?text=Halo%20BPS%20Kabupaten%20Tangerang%20SIPASTI%20bisa%20bantu%20informasi%3F`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 group">
      {/* Floating Mini Notification Banner */}
      {showNotificationBadge && (
        <div className="relative bg-white dark:bg-slate-900 border border-emerald-500/30 text-slate-800 dark:text-slate-100 p-3 rounded-2xl shadow-xl max-w-[260px] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setShowNotificationBadge(false)}
            className="absolute -top-2 -left-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-600 dark:text-slate-300 p-1 rounded-full text-xs transition-colors shadow-xs"
            aria-label="Tutup notifikasi"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="bg-[#25D366] p-2 rounded-xl text-white shrink-0">
              <MessageCircle className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-bold text-xs">Butuh Bantuan Data?</p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">Chat langsung dengan bot & petugas BPS!</p>
            </div>
          </div>
        </div>
      )}

      {/* Main WhatsApp FAB Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-[#25D366]/40 hover:shadow-[#25D366]/60 transition-all duration-300 hover:scale-110 active:scale-95 group"
            aria-label="Chat WhatsApp Operasional BPS"
          >
            {/* Ripple Pulse Effect */}
            <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none"></span>

            <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8 fill-white stroke-none transition-transform group-hover:rotate-12 duration-300" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="left" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
          Chat WhatsApp BPS Kab. Tangerang
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
