import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description: string
  breadcrumbText: string
  breadcrumbIcon: LucideIcon
  action?: React.ReactNode
}

export default function PageHeader({ 
  title, 
  description, 
  breadcrumbText, 
  breadcrumbIcon: Icon,
  action 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 border-b border-border/40">
      <div className="flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg w-fit">
          <Icon className="h-3.5 w-3.5" />
          <span>{breadcrumbText}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
      {action && (
        <div className="shrink-0 pt-2 sm:pt-0">
          {action}
        </div>
      )}
    </div>
  )
}
