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
    <div className="mt-6 border rounded-3xl bg-card overflow-hidden shadow-sm">
      <div className="p-4 bg-muted/30 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg">Struktur Menu FAQ</h3>
      </div>
      <div className="p-4 space-y-2">
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
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="bg-muted/50 p-6 border-b flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600 shrink-0">
              <FileSearch className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold leading-tight">
                {viewFaq?.title}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Kode Menu: {viewFaq?.kode}
              </DialogDescription>
            </div>
          </div>
          <ScrollArea className="max-h-[60vh]">
            <div 
              className="p-6 text-sm text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseWaMarkdown(viewFaq?.content) }}
            />
          </ScrollArea>
          <div className="p-4 border-t flex justify-end bg-muted/20">
            <Button onClick={() => setIsViewDialogOpen(false)} className="rounded-xl">Tutup</Button>
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
          "flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-muted/50 group border border-transparent hover:border-border",
          !node.is_active && "opacity-60"
        )}
      >
        <div 
          className="flex items-center gap-3 flex-1 min-w-0" 
          style={{ paddingLeft: `${level * 24}px` }}
        >
          {/* Collapse/Expand Toggle or View Button */}
          {isFolder || hasChildren ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-6 h-6 flex items-center justify-center shrink-0 rounded-md hover:bg-muted transition-colors"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <button
              onClick={() => onView(node)}
              title="Lihat Konten"
              className="w-6 h-6 flex items-center justify-center shrink-0 rounded-md hover:bg-blue-100 text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}

          {/* Icon */}
          <div className="text-primary shrink-0">
            {isFolder ? (
              isExpanded ? <FolderOpen className="h-5 w-5" /> : <Folder className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5 text-blue-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <Badge variant="outline" className="bg-background shrink-0 font-mono">
              {node.kode || '-'}
            </Badge>
            <span className="font-medium truncate">{node.title}</span>
            {!node.is_active && (
              <Badge variant="secondary" className="text-[10px]">Nonaktif</Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 rounded-lg px-3"
            onClick={() => onEdit(node)}
          >
            <Edit2 className="h-3.5 w-3.5 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Render Children */}
      {isExpanded && hasChildren && (
        <div className="mt-1">
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
