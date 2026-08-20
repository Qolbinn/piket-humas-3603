'use client'

import * as React from 'react'
import { Bold, Italic, Strikethrough, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WaToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onFormat: (newValue: string) => void
}

export default function WaToolbar({ textareaRef, onFormat }: WaToolbarProps) {
  const applyFormat = (prefix: string, suffix: string = prefix) => {
    const el = textareaRef.current
    if (!el) return
    
    const start = el.selectionStart
    const end = el.selectionEnd
    const val = el.value
    
    const before = val.substring(0, start)
    const selected = val.substring(start, end) || 'teks'
    const after = val.substring(end)
    
    const newVal = before + prefix + selected + suffix + after
    onFormat(newVal)
    
    // Attempt to restore focus and selection after state update
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length)
    }, 10)
  }

  return (
    <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border w-fit shadow-sm">
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" 
        onClick={() => applyFormat('*')} 
        title="Tebal (Bold) - *teks*"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" 
        onClick={() => applyFormat('_')} 
        title="Miring (Italic) - _teks_"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" 
        onClick={() => applyFormat('~')} 
        title="Coret (Strikethrough) - ~teks~"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" 
        onClick={() => applyFormat('```')} 
        title="Monospace (Code) - ```teks```"
      >
        <Code className="h-4 w-4" />
      </Button>
    </div>
  )
}
