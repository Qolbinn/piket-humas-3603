'use client'

import * as React from 'react'
import type { FaqMenu } from '@/lib/types/database'
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown, Edit2, Plus, Eye, FileSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import EditFaqDialog from './EditFaqDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { parseWaMarkdown } from '@/lib/utils/wa-format'

interface FaqTreeViewProps {
  faqs: FaqMenu[]
}

export default function FaqTreeView({ faqs }: FaqTreeViewProps) {
  const [selectedFaq, setSelectedFaq] = React.useState<FaqMenu | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const [viewFaq, setViewFaq] = React.useState<FaqMenu | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)

  // Build tree structure
  const rootFaqs = faqs.filter((f) => !f.parent_id)

  // Sort them just in case (the server already ordered by kode, but it doesn't hurt to ensure roots are ordered)
  // Actually, since they are strings, JS sort might sort "10" before "2". We trust the DB or we can do a natural sort here.
  // We'll rely on the array order provided by DB.

  function handleEditClick(faq: FaqMenu) {
    setSelectedFaq(faq)
    setIsEditDialogOpen(true)
  }

  function handleViewClick(faq: FaqMenu) {
    setViewFaq(faq)
    setIsViewDialogOpen(true)
  }

  if (faqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl mt-6">
        <Folder className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-bold">Belum Ada FAQ</h3>
        <p className="text-muted-foreground mt-2 mb-6">
          Buat menu FAQ pertama Anda agar bot dapat merespons pelanggan.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 border border-border/80 rounded-2xl bg-card overflow-hidden shadow-xs">
      <div className="p-4 bg-muted/30 border-b border-border/60 flex justify-between items-center">
        <h3 className="font-extrabold text-base text-foreground">Struktur Pohon Menu FAQ</h3>
        <span className="text-xs text-muted-foreground">Klik ikon mata atau panah untuk melihat submenu/konten.</span>
      </div>
      <div className="p-3 space-y-1.5">
        {rootFaqs.map((faq) => (
          <FaqTreeNode 
            key={faq.id} 
            node={faq} 
            allFaqs={faqs} 
            level={0} 
            onEdit={handleEditClick} 
            onView={handleViewClick}
          />
        ))}
      </div>

      <EditFaqDialog 
        faq={selectedFaq} 
        faqs={faqs}
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-2xl">
          <div className="bg-primary/5 p-6 border-b border-border/60 flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
              <FileSearch className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold leading-tight text-foreground">
                {viewFaq?.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">
                  Kode: {viewFaq?.kode || '-'}
                </span>
                <span className="text-xs text-muted-foreground">
                  Type: {viewFaq?.is_menu ? 'Menu Pilihan' : 'Jawaban Final'}
                </span>
              </div>
            </div>
          </div>
          <ScrollArea className="max-h-[60vh]">
            <div 
              className="p-6 text-sm text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseWaMarkdown(viewFaq?.content) }}
            />
          </ScrollArea>
          <div className="p-4 border-t border-border/60 flex justify-end bg-muted/20">
            <Button onClick={() => setIsViewDialogOpen(false)} className="rounded-xl font-bold">Tutup</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface FaqTreeNodeProps {
  node: FaqMenu
  allFaqs: FaqMenu[]
  level: number
  onEdit: (faq: FaqMenu) => void
  onView: (faq: FaqMenu) => void
}

function FaqTreeNode({ node, allFaqs, level, onEdit, onView }: FaqTreeNodeProps) {
  // Default to expanded for top levels
  const [isExpanded, setIsExpanded] = React.useState(level < 2)
  
  const children = allFaqs.filter((f) => f.parent_id === node.id)
  const hasChildren = children.length > 0
  const isFolder = node.is_menu

  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center justify-between p-2.5 rounded-xl transition-all hover:bg-muted/50 group border border-transparent hover:border-border/60",
          !node.is_active && "opacity-50"
        )}
      >
        <div 
          className="flex items-center gap-2.5 flex-1 min-w-0" 
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {/* Collapse/Expand Toggle or View Button */}
          {isFolder || hasChildren ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-6 h-6 flex items-center justify-center shrink-0 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <button
              onClick={() => onView(node)}
              title="Lihat Konten WhatsApp"
              className="w-6 h-6 flex items-center justify-center shrink-0 rounded-lg hover:bg-blue-100 text-blue-500 transition-all opacity-0 group-hover:opacity-100"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Icon */}
          <div className="shrink-0">
            {isFolder ? (
              isExpanded ? <FolderOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> : <Folder className="h-4 w-4 text-indigo-500" />
            ) : (
              <FileText className="h-4 w-4 text-blue-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold bg-muted/60 text-foreground px-2 py-0.5 rounded-md border text-[11px]">
              {node.kode || '-'}
            </span>
            <span className="font-bold text-xs sm:text-sm truncate text-foreground">{node.title}</span>

            {!node.is_active && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-muted text-muted-foreground border">
                Nonaktif
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 rounded-lg text-xs font-semibold px-2.5"
            onClick={() => onEdit(node)}
          >
            <Edit2 className="h-3.5 w-3.5 mr-1.5" />
            <span>Edit</span>
          </Button>
        </div>
      </div>

      {/* Render Children */}
      {isExpanded && hasChildren && (
        <div className="mt-1 ml-4 border-l-2 border-border/40 pl-2 space-y-1">
          {children.map((child) => (
            <FaqTreeNode 
              key={child.id} 
              node={child} 
              allFaqs={allFaqs} 
              level={level + 1} 
              onEdit={onEdit}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  )
}
