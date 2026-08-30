'use client'

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in fade-in zoom-in duration-300">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-background/80 hover:bg-primary hover:text-white text-foreground border border-border/80 backdrop-blur-md shadow-lg shadow-black/5 hover:shadow-primary/30 transition-all duration-300 hover:scale-110 active:scale-95 group"
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:-translate-y-0.5 duration-300 stroke-[2.5]" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-semibold text-xs">
          Kembali ke Atas
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
